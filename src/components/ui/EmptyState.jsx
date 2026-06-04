export default function EmptyState({ title = "No hay resultados", description = "No encontramos datos para mostrar." }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      
      <div className="text-5xl mb-4">
        📭
      </div>
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      <p className="text-sm text-gray-500 mt-1 max-w-sm">{description}</p>
    </div>
  );
}