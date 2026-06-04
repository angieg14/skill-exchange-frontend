import { cn } from "@/lib/utils"

export default function CategoryFilter({ categories, category, onCategoryChange }) {
    return (
        <div className="flex gap-2 mb-4">
            <button onClick={() => onCategoryChange("all")} className={cn(
                "px-4 py-2 border rounded-md text-sm",
                category === "all" ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted"
            )}>All</button>
            {categories.map((categ) => (
                <button key={categ} onClick={() => onCategoryChange(categ)} className={cn(
                    "px-4 py-2 border rounded-md text-sm",
                    categ === category ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted"
                )}>{categ}</button>
            ))}
        </div>
    )
}