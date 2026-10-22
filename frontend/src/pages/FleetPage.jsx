import {useEffect,useState} from 'react';
import VehicleCard from '../components/VehicleCard';
import {useAuth} from '../context/AuthContext';
export default function FleetPage(){
 const[vehicles,setVehicles]=useState([]),[loading,setLoading]=useState(true),[error,setError]=useState('');
 const[filter,setFilter]=useState('All'),[selectedVehicle,setSelectedVehicle]=useState('');
 const[pickupDate,setPickupDate]=useState(''),[returnDate,setReturnDate]=useState(''),[feedback,setFeedback]=useState('');
 const[submitting,setSubmitting]=useState(false),{token}=useAuth();
 async function refresh(){const r=await fetch('/api/v1/vehicles');if(!r.ok)throw new Error('Could not load vehicles');setVehicles(await r.json())}
 useEffect(()=>{let active=true;fetch('/api/v1/vehicles').then(r=>{if(!r.ok)throw new Error('Could not load vehicles');return r.json()}).then(data=>{if(active)setVehicles(data)}).catch(err=>{if(active)setError(err.message)}).finally(()=>{if(active)setLoading(false)});return()=>{active=false}},[]);
 async function book(e){e.preventDefault();setSubmitting(true);setFeedback('');try{
 const r=await fetch('/api/v1/bookings',{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`},body:JSON.stringify({vehicleId:selectedVehicle,pickupDate,returnDate})});
 const data=await r.json();if(!r.ok)throw new Error(data.message||'Booking failed');
 setFeedback('✅ Booking reserved! View it under My Bookings.');setSelectedVehicle('');setPickupDate('');setReturnDate('');await refresh();
 }catch(err){setFeedback(`❌ ${err.message}`)}finally{setSubmitting(false)}}
 const filtered=filter==='All'?vehicles:vehicles.filter(v=>v.type===filter);
 return <main className="page"><div className="page-intro"><span className="eyebrow">FIND YOUR NEXT DRIVE</span><h1>Explore our fleet<span className="accent">.</span></h1><p>From city runabouts to weekend adventures, your perfect ride starts here.</p></div><div className="toolbar"><div className="filters">{['All','Hatchback','Sedan','SUV'].map(t=><button key={t} className={filter===t?'selected':'outline'} onClick={()=>setFilter(t)}>{t}</button>)}</div><span className="muted">{filtered.length} vehicles</span></div>
 {loading&&<p className="notice">Loading vehicles...</p>}{error&&<p className="error">{error}. Check that the backend is running.</p>}
 {!loading&&!error&&<div className="vehicle-grid">{filtered.map(v=><VehicleCard key={v._id} model={v.model} type={v.type} pricePerDay={v.pricePerDay} available={v.available} onBook={()=>{setSelectedVehicle(v._id);setFeedback('');document.getElementById('booking-form')?.scrollIntoView({behavior:'smooth'})}}/>)}</div>}
 <section className="booking-section" id="booking-form"><div><span className="eyebrow">READY TO GO?</span><h2>Reserve a vehicle</h2><p>Choose your dates, confirm your ride, and we'll take care of the rest.</p></div><form className="booking-form" onSubmit={book}><label>Vehicle<select required value={selectedVehicle} onChange={e=>setSelectedVehicle(e.target.value)}><option value="">Select available vehicle</option>{vehicles.filter(v=>v.available).map(v=><option key={v._id} value={v._id}>{v.model}</option>)}</select></label><label>Pickup date<input required type="date" value={pickupDate} min={new Date().toLocaleDateString('en-CA')} onChange={e=>setPickupDate(e.target.value)}/></label><label>Return date<input required type="date" value={returnDate} min={pickupDate||new Date().toLocaleDateString('en-CA')} onChange={e=>setReturnDate(e.target.value)}/></label><p className="selection">Selected: {vehicles.find(v=>v._id===selectedVehicle)?.model||'None yet'}</p><button disabled={submitting||!selectedVehicle}>{submitting?'Reserving...':'Confirm Booking →'}</button>{feedback&&<p className="feedback">{feedback}</p>}</form></section></main>;
}