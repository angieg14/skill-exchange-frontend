"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import api from "@/lib/api"
import LoadingState from "@/components/ui/LoadingState"
import ErrorMessage from "@/components/ui/ErrorMessage"

export default function SkillDetailPage({ params }) {
    const router = useRouter()
    const [skill, setSkill] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const levelColors = {
        beginner: "bg-green-100 text-green-700",
        intermediate: "bg-blue-100 text-blue-700",
        advanced: "bg-orange-100 text-orange-700",
    }

    useEffect(() => {
        params.then(({ id }) => {
            api.get(`/skills/${id}/`)
                .then(({ data }) => setSkill(data))
                .catch(() => setError("No se pudo cargar la skill."))
                .finally(() => setLoading(false))
        })
    }, [params])

    if (loading) return <LoadingState />
    if (error) return <ErrorMessage message={error} />

    return (
        <main className="flex-1 p-6 space-y-4">
            <Link href="/dashboard/skills" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
                ← Volver a Skills
            </Link>

            <div className="border rounded-lg p-6 max-w-xl space-y-4">
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="text-xl font-bold">{skill.name}</h2>
                        <p className="text-sm text-blue-600 capitalize">{skill.category}</p>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full border ${levelColors[skill.level]}`}>
                        {skill.level}
                    </span>
                </div>

                {skill.description && (
                    <p className="text-sm text-muted-foreground">{skill.description}</p>
                )}

                <hr />

                <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                        <p className="text-muted-foreground">ID</p>
                        <p className="font-semibold">#{skill.id}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground">Categoría</p>
                        <p className="font-semibold capitalize">{skill.category}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground">Nivel</p>
                        <p className="font-semibold capitalize">{skill.level}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground">Creada</p>
                        <p className="font-semibold">{new Date(skill.created_at).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground">Actualizada</p>
                        <p className="font-semibold">{new Date(skill.updated_at).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}</p>
                    </div>
                </div>
            </div>
        </main>
    )
}