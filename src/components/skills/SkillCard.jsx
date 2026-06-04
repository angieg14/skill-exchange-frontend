import Link from "next/link"

export default function SkillCard({ skill }) {
    const levelColors = {
        beginner: "bg-green-100 text-green-700",
        intermediate: "bg-blue-100 text-blue-700",
        advanced: "bg-orange-100 text-orange-700",
    }

    return (
        <Link href={`/dashboard/skills/${skill.id}`}>
            <div className="border rounded-lg p-4 flex flex-col gap-2">
                <p className="font-semibold">{skill.name}</p>
                <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">{skill.category}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${levelColors[skill.level] || "bg-gray-100 text-gray-700"}`}>
                        {skill.level}
                    </span>
                </div>
            </div>
        </Link>
    )
}