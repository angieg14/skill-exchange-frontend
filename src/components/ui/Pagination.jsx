    import { cn } from "@/lib/utils"

export default function Pagination({ count, page, pageSize, onPageChange }) {
    const totalPages = Math.ceil(count / pageSize)

    // Mejora 1: Si no hay suficientes datos para 2 páginas, se oculta
    if (totalPages <= 1) return null

    return (
        <div className="flex items-center gap-2 mt-4">
            <button onClick={() => onPageChange(page - 1)} disabled={page === 1}
                // Mejora 2: Se agregó hover:bg-muted para mejor experiencia de usuario
                className="px-3 py-1 border rounded-md text-sm disabled:opacity-50 hover:bg-muted transition-colors">
                &lt;
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => onPageChange(p)}
                    className={cn(
                        "px-3 py-1 border rounded-md text-sm transition-colors",
                        p === page 
                            ? "bg-foreground text-background" 
                            : "text-muted-foreground hover:bg-muted"
                    )}>{p}</button>
            ))}
            
            <button onClick={() => onPageChange(page + 1)} disabled={page === totalPages}
                className="px-3 py-1 border rounded-md text-sm disabled:opacity-50 hover:bg-muted transition-colors">
                &gt;
            </button>
        </div>
    )
}