import { useState } from "react";
import api from "@/lib/api";
import ProgressBar from "./ProgressBar";

export default function GoalCard({ goal, onGoalUpdated }) {
  if (!goal) return null;

  const [isAchieving, setIsAchieving] = useState(false);
  
  // 1. NUEVO: Creamos un estado local para el cambio instantáneo del botón
  const [localAchieved, setLocalAchieved] = useState(false);
  
  // 2. MODIFICADO: Ahora el botón revisa si se completó en el servidor O si el usuario acaba de hacer clic
  const isCompleted = localAchieved || Number(goal?.current_value || 0) >= Number(goal?.target_value || 1) || goal?.status === "achieved";

  const handleAchieve = async () => {
    setIsAchieving(true);
    try {
      // Mandamos la petición al servidor
      await api.post(`/goals/${goal.id}/achieve/`);
      
      // 3. NUEVO: Apenas el servidor responde "OK", cambiamos el botón visualmente al instante
      setLocalAchieved(true);
      
      // Le avisamos a la página que recargue los datos por debajo
      if (onGoalUpdated) onGoalUpdated(); 
    } catch (error) {
      console.error("Error al actualizar la meta", error);
    } finally {
      setIsAchieving(false);
    }
  };

  return (
    <div className="border rounded-xl p-5 bg-white shadow-sm flex flex-col gap-4">
      <div className="flex justify-between items-start gap-2">
        <h3 className="font-bold text-gray-900 text-lg">{goal?.title || "Sin título"}</h3>
        
        {/* Aquí ocurre la magia visual */}
        {isCompleted ? (
          <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md text-xs font-medium border border-emerald-200 transition-all">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
            Alcanzada
          </span>
        ) : (
          <button 
            onClick={handleAchieve} 
            disabled={isAchieving}
            className="flex items-center gap-1 text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md text-xs font-medium border border-blue-200 transition-colors disabled:opacity-50"
          >
            {isAchieving ? "Actualizando..." : "Alcanzar"}
          </button>
        )}
      </div>

      <p className="text-sm text-gray-500">
        Skill vinculada: <span className="font-semibold text-gray-700">{goal?.skill?.name || "Sin skill"}</span>
      </p>

      {/* Si el botón se hizo clic (localAchieved), forzamos la barra al 100% visualmente */}
      <ProgressBar 
        progress={localAchieved ? goal?.target_value : (goal?.current_value || 0)} 
        target={goal?.target_value || 1} 
      />

      <div className="text-xs text-gray-400 flex items-center gap-1 mt-1">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
        Límite: {goal?.target_date || "Sin fecha"}
      </div>
    </div>
  );
}