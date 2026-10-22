import {useEffect,useState} from 'react';
import {useAuth} from '../context/AuthContext';
export default function AdminPanel(){
 const{customer,token}=useAuth(),[summary,setSummary]=useState(null),[error,setError]=useState('');
 useEffect(()=>{if(!['admin','manager'].includes(customer?.role))return;fetch('/api/v1/admin/summary',{headers:{Authorization:`Bearer ${token}`}}).then(async r=>{const data=await r.json();if(!r.ok)throw new Error(data.message);setSummary(data)}).catch(err=>setError(err.message))},[customer,token]);
 return <main className="page"><div className="page-intro"><span className="eyebrow">FLEET OPERATIONS</span><h1>Admin panel<span className="accent">.</span></h1><p>Overview for authorized fleet managers and administrators.</p></div>{!['admin','manager'].includes(customer?.role)?<p className="error">Staff access only. Sign in using the manager or admin demo account.</p>:error?<p className="error">{error}</p>:!summary?<p>Loading summary...</p>:<div className="stats">{Object.entries(summary).map(([key,value])=><div key={key} className="stat"><span>{key}</span><strong>{value}</strong></div>)}</div>}</main>;
}