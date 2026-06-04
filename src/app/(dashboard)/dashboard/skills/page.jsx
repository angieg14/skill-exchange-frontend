"use client"

import api from "@/lib/api"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import SkillCard from "@/components/skills/SkillCard"
import CategoryFilter from "@/components/skills/CategoryFilter"
import OrderSelector from "@/components/skills/OrderSelector"
import Pagination from "@/components/ui/Pagination"
import EmptyState from "@/components/ui/EmptyState"
import ErrorMessage from "@/components/ui/ErrorMessage"
import LoadingState from "@/components/ui/LoadingState"
import { Button } from "@/components/ui/button"

export default function SkillsPage() {
    const router = useRouter();
    const [skills, setSkills] = useState([])
    const [category, setCategory] = useState("all")
    const [search, setSearch] = useState("")
    const [order, setOrder] = useState("name")

    const [page, setPage] = useState(1)
    const [count, setCount] = useState(0)
    const pageSize = 10

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        api
            .get(`/skills/?page=${page}`)
            .then(({ data }) => {
                setSkills(data.results)
                setCount(data.count)
            })
            .catch(() => {
                localStorage.removeItem("access_token")
                localStorage.removeItem("refresh_token")
                router.replace("/login")
            })
            .finally(() => setLoading(false))
    }, [router, page])

    const categories = Array.from(new Set(skills.map((skill) => skill.category)))
    const filteredSkills = skills
        .filter((skill) => category === "all" || skill.category === category)
        .filter((skill) => skill.name.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => order === "name"
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name))

    if (loading) return <LoadingState />
    if (error) return <ErrorMessage message={error} />

    return (
        <div>
            <main className="flex-1 p-6 space-y-4">
                <h2 className="text-xl font-semibold">Skills</h2>
                <CategoryFilter categories={categories} category={category} onCategoryChange={setCategory} />
                <div className="flex gap-4">
                    <Input placeholder="Buscar skills..." onChange={(e) => setSearch(e.target.value)} className="flex-1" />
                    <OrderSelector order={order} onOrderChange={setOrder} />
                </div>
                {(category !== "all" || search !== "") && (
                    <Button variant="outline"
                        onClick={() => {
                            setCategory("all")
                            setSearch("")
                            setOrder("name")
                        }}
                        className="text-sm text-muted-foreground hover:text-foreground underline">
                        Limpiar filtros
                    </Button>
                )}
                <div className="grid grid-cols-3 gap-4">
                    {filteredSkills.length === 0
                        ? <EmptyState />
                        : filteredSkills.map((skill) => (
                            <SkillCard key={skill.id} skill={skill} />
                        ))
                    }
                </div>
                <Pagination count={count} page={page} pageSize={pageSize} onPageChange={setPage} />
            </main>
        </div >
    )
}