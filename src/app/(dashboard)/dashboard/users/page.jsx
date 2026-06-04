"use client"

import api from "@/lib/api"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Pagination from "@/components/ui/Pagination"
import EmptyState from "@/components/ui/EmptyState"
import UserFilter from "@/components/users/UserFilter" // <-- Tu nuevo componente

export default function UsersPage() {
    const [users, setUsers] = useState([])
    const [search, setSearch] = useState("") // El estado sigue aquí
    const [debouncedSearch, setDebouncedSearch] = useState("")
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    //Estados para lo de paginar
    const [page, setPage] = useState(1)
    const [count, setCount] = useState(0)
    const [pageSize, setPageSize] = useState(10)

    // Efecto de Debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search)
            setPage(1)
        }, 500)
        return () => clearTimeout(timer)
    }, [search])

    // Petición al API  
    useEffect(() => {
        setLoading(true)
        const endpoint = `/users/?page=${page}${debouncedSearch ? `&search=${debouncedSearch}` : ""}`

        api.get(endpoint)
            .then(({ data }) => {
                setUsers(data.results)
                setCount(data.count)
            })
            .catch(() => {
                localStorage.removeItem("access_token")
                localStorage.removeItem("refresh_token")
                router.replace("/login")
            })
            .finally(() => setLoading(false))
    }, [router, page, debouncedSearch])

    //esto es para obtener las iniciales de los usuarios
    const obtenerIniciales = (nombre, apellido) => {
        const primeraLetraNombre = nombre ? nombre.charAt(0) : ""
        const primeraLetraApellido = apellido ? apellido.charAt(0) : ""
        return `${primeraLetraNombre}${primeraLetraApellido}`.toUpperCase()
    }

    const formatearFecha = (fechaOriginal) => {
        if (!fechaOriginal) return ""
        const fecha = new Date(fechaOriginal)
        return fecha.toLocaleDateString("es-ES", {
            day: "numeric",
            month: "short",
            year: "numeric",
        })
    }

    return (
        <div className="flex flex-col gap-6 w-full p-4 md:p-8">
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Usuarios</h1>

            {/* Aquí implementas tu nuevo componente pasándole los props */}
            <UserFilter search={search} setSearch={setSearch} />

            {loading ? (
                <div className="flex items-center justify-center p-12 text-muted-foreground text-sm">
                    Cargando directorio de usuarios...
                </div>
            ) : users.length === 0 ? (
                <div className="mt-8">
                    <EmptyState message="No se encontraron usuarios que coincidan con tu búsqueda." />
                </div>
            ) : (
                <div className="border rounded-lg bg-background shadow-sm overflow-hidden flex flex-col">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/50 border-b">
                                <tr>
                                    <th className="px-6 py-4 text-left font-medium text-muted-foreground">Usuario</th>
                                    <th className="px-6 py-4 text-left font-medium text-muted-foreground">Email</th>
                                    <th className="px-6 py-4 text-left font-medium text-muted-foreground">Fecha de ingreso</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border text-left">
                                {users.map((usuario) => (
                                    <tr key={usuario.id} className="hover:bg-muted/30 transition-colors">
                                        <td className="px-6 py-3 flex items-center gap-4">
                                            <div className="h-10 w-10 shrink-0 bg-muted rounded-full flex items-center justify-center text-xs font-semibold text-foreground border">
                                                {obtenerIniciales(usuario.first_name, usuario.last_name)}
                                            </div>
                                            <span className="font-medium text-foreground">
                                                {usuario.first_name} {usuario.last_name}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3 text-muted-foreground">{usuario.email}</td>
                                        <td className="px-6 py-3 text-muted-foreground">{formatearFecha(usuario.date_joined)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    
                    <div className="px-4 py-3 border-t flex items-center justify-start bg-muted/10">
                        <Pagination
                            count={count}
                            page={page}
                            pageSize={pageSize}
                            onPageChange={setPage}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}