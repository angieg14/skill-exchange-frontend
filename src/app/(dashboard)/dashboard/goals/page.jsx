"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import api from "@/lib/api"

// Importaciones de UI
import LoadingState from "@/components/ui/LoadingState"
import ErrorMessage from "@/components/ui/ErrorMessage"
import EmptyState from "@/components/ui/EmptyState"
import Pagination from "@/components/ui/Pagination"

// Importación de la tarjeta principal
import GoalCard from "@/components/goals/GoalCard"

export default function GoalsPage() {
    const [goals, setGoals] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    
    // Paginación
    const [page, setPage] = useState(1)
    const [count, setCount] = useState(0)
    const pageSize = 10 
    
    const router = useRouter()

    const fetchGoals = () => {
        setLoading(true)
        api.get(`/goals/?page=${page}`) 
            .then(({ data }) => {
                // Aquí usamos data.results porque así viene en tu JSON de Bruno
                setGoals(data.results || [])
                // Guardamos el count total para que la paginación sepa cuántos hay
                setCount(data.count || 0)
                setError(false)
            })
            .catch((err) => {
                if (err.response?.status === 401) {
                    localStorage.removeItem("access_token")
                    localStorage.removeItem("refresh_token")
                    router.replace("/login")
                } else {
                    setError(true)
                }
            })
            .finally(() => setLoading(false))
    }

    // Se ejecuta al cargar la página o al cambiar de número de página
    useEffect(() => {
        fetchGoals()
    }, [page, router])

    // Manejo de pantallas de carga y error
    if (loading) return <LoadingState />
    if (error) return <ErrorMessage message="No pudimos cargar tus metas de aprendizaje." />

    // Matemáticas para el texto inferior (ej: "1-10 de 123")
    const startRange = count === 0 ? 0 : (page - 1) * pageSize + 1;
    const endRange = Math.min(page * pageSize, count);

    return (
        <div className="flex flex-col min-h-screen p-6 bg-slate-50">
            
            {/* Cabecera superior con el ícono de trofeo */}
            <div className="mb-8 flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        Metas de Aprendizaje
                    </h1>
                    <p className="text-gray-500 text-sm">
                        Establece objetivos de estudio, mide tu progreso y alcanza tus metas.
                    </p>
                </div>
                
                <div className="p-3 bg-blue-50 text-blue-500 rounded-full border border-blue-100 hidden sm:block">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 4v2a4 4 0 01-4 4H8a4 4 0 01-4-4V4h12zM12 10v8m-4 0h8m-8-4h8"></path>
                    </svg>
                </div>
            </div>

            {/* Contenido principal */}
            {goals.length === 0 ? (
                <EmptyState 
                    title="Sin metas activas" 
                    description="Aún no tienes metas de aprendizaje registradas." 
                />
            ) : (
                <>
                    {/* Grilla de tarjetas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {goals.map((goal) => (
                            <GoalCard 
                                key={goal.id} 
                                goal={goal} 
                                onGoalUpdated={fetchGoals} 
                            />
                        ))}
                    </div>

                    {/* Paginación y contador inferior */}
                    <div className="mt-8 flex justify-between items-center text-sm text-muted-foreground">
                        <p>{startRange}-{endRange} de {count}</p>
                        
                        <Pagination 
                            count={count} 
                            page={page} 
                            pageSize={pageSize} 
                            onPageChange={setPage} 
                        />
                    </div>
                </>
            )}
        </div>
    )
}