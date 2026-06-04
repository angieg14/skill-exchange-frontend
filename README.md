# 🚀 Skill Exchange — Frontend

Aplicación web desarrollada con **Next.js (App Router)** y **Tailwind CSS** que consume una API REST en Django. Esta plataforma permite la gestión e intercambio de habilidades, la exploración de perfiles de usuario y el seguimiento de metas de aprendizaje.

---

## 🛠️ Tecnologías

- **Framework:** Next.js 15 / React 18
- **Estilos:** Tailwind CSS
- **Peticiones HTTP:** Axios
- **Seguridad:** Autenticación con JWT (JSON Web Tokens)

---

## 🏗️ Arquitectura y Decisiones de Diseño

El proyecto sigue un enfoque modular, escalable y basado en buenas prácticas:

1. **Componentes Globales Reutilizables (`components/ui/`):** Se centralizó la interfaz genérica (`<LoadingState />`, `<EmptyState />`, `<ErrorMessage />`, `<Pagination />`) para cumplir con el principio **DRY (Don't Repeat Yourself)** y mantener consistencia visual.
2. **Estrategia Client vs. Server Components:** Se aprovechó el renderizado del servidor por defecto de Next.js. La directiva `"use client"` se usó estrictamente en componentes interactivos (eventos `onClick`, `onChange`) o que requieren Hooks (`useState`, `useEffect`).
3. **Navegación Dinámica:** El `layout.jsx` del dashboard genera los enlaces dinámicamente mapeando un arreglo, facilitando la escalabilidad futura.

---

## 🧩 Módulos Implementados

### 1. 💡 Habilidades (Skills)
- **`/dashboard/skills`**: Listado general paginado. Incluye filtros de categorías (`Set` dinámico), buscador por nombre y selector de ordenamiento (A-Z / Z-A).
- **`/dashboard/skills/[id]`**: Vista de detalle de una habilidad, generada a partir del parámetro ID en la URL.
- **Componentes clave:** `<SkillCard />` (Renderiza niveles con colores dinámicos), `<CategoryFilter />`, `<OrderSelector />`.

### 2. 👥 Directorio de Usuarios (Users)
- **`/dashboard/users`**: Listado paginado de los miembros de la plataforma.
- **Lifting State Up & Debounce:** Se extrajo la barra de búsqueda al componente `<UserFilter />`, manteniendo el estado en el padre. Se aplicó un *Debounce* de 500ms para optimizar las peticiones al servidor mientras el usuario escribe.

### 3. 🎯 Metas de Aprendizaje (Goals)
- **`/dashboard/goals`**: Visualización y gestión de metas de estudio.
- **Actualización Optimista (Optimistic UI):** Al marcar una meta como completada, la interfaz (`<GoalCard />`) reacciona de inmediato usando estado local, mientras la petición se envía en segundo plano.
- **Lógica separada y Fallbacks:** El cálculo del porcentaje se modularizó en `<ProgressBar />` y se implementó *Optional Chaining* (`?.`) para evitar caídas si la API envía datos incompletos.

---

## 🔐 Autenticación y Consumo de API

Cada petición incluye el token JWT en el header (`Authorization: Bearer {token}`). Si el token expira o es inválido, el frontend intercepta el error `401 Unauthorized`, limpia el `localStorage` y redirige automáticamente a `/login`.

**Base URL:** `https://apiskills.danidev.co/api`

### 🔌 Endpoints Principales Integrados:
| Módulo | Endpoint | Método | Descripción |
|--------|----------|--------|-------------|
| **Skills** | `/skills/?page={p}` | `GET` | Listado y filtrado de habilidades. |
| **Skills** | `/skills/{id}/` | `GET` | Detalle específico de una habilidad. |
| **Users** | `/users/?page={p}&search={s}` | `GET` | Directorio de usuarios con búsqueda. |
| **Goals** | `/goals/?page={p}` | `GET` | Listado del progreso de las metas. |
| **Goals** | `/goals/{id}/achieve/` | `POST` | Marca una meta específica como completada. |