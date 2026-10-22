const icons = { Hatchback: '🚙', Sedan: '🚘', SUV: '🚗' };
export default function VehicleCard({ model, type, pricePerDay, available, onBook }) {
 return <article className="vehicle-card"><div className="vehicle-art"><span>{icons[type] || '🚗'}</span><span className="type-tag">{type}</span></div>
 <div className="vehicle-body"><h3>{model}</h3><p>Self-drive • Unlimited memories</p><div className="vehicle-bottom"><div><b>₹{pricePerDay.toLocaleString('en-IN')}</b><small> / day</small></div>
 {available ? <button onClick={onBook}>Book Now →</button> : <span className="unavailable">Not Available</span>}</div></div></article>;
}