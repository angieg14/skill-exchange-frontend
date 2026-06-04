import { cn } from "@/lib/utils";

export default function ProgressBar({ progress, target }) {
  // Convertimos a números seguros para evitar el NaN%
  const safeProgress = Number(progress) || 0;
  const safeTarget = Number(target) || 1; // Usamos 1 por defecto para no dividir entre cero

  const percentage = Math.min(Math.round((safeProgress / safeTarget) * 100), 100);
  const isCompleted = percentage >= 100;

  return (
    <div>
      <div className="flex justify-between text-xs mb-2">
        <span className="font-medium text-gray-700">Progreso</span>
        <span className="font-medium text-gray-700">
          {safeProgress} / {safeTarget} ({percentage}%)
        </span>
      </div>
      
      <div className="w-full bg-blue-50 rounded-full h-2.5">
        <div 
          className={cn(
            "h-2.5 rounded-full transition-all duration-500", 
            isCompleted ? "bg-emerald-500" : "bg-blue-500"
          )}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}