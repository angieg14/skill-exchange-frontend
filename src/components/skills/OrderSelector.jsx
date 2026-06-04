export default function OrderSelector({ order, onOrderChange }) {
    return (
        <select value={order} onChange={(e) => onOrderChange(e.target.value)}
            className="border rounded-md px-3 py-2 text-sm">
            <option value="name">Nombre A-Z</option>
            <option value="-name">Nombre Z-A</option>
        </select>
    )
}