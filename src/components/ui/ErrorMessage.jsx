export default function ErrorMessage({ message = "Ha ocurrido un error al cargar los datos." }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200 text-center">
        <h3 className="font-bold text-lg mb-1">¡Ups! Algo salió mal</h3>
        <p className="text-sm">{message}</p>
      </div>
    </div>
  );
}