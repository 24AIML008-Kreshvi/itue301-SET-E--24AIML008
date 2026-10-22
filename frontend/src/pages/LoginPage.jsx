import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
export default function LoginPage(){
 const[email,setEmail]=useState('customer@driveeasy.test'),[password,setPassword]=useState('Demo@12345'),[error,setError]=useState(''),[loading,setLoading]=useState(false);
 const{login}=useAuth(),navigate=useNavigate();
 async function submit(e){e.preventDefault();setLoading(true);setError('');try{
 const response=await fetch('/api/v1/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password})});
 const data=await response.json();if(!response.ok)throw new Error(data.message||'Login failed');
 login(data);navigate('/fleet');
 }catch(err){setError(err.message)}finally{setLoading(false)}}
 return <main className="login-layout"><section className="hero"><span className="eyebrow">YOUR KEYS TO FREEDOM</span><h1>Hit the road.<br/><em>On your terms.</em></h1><p>Simple bookings. Great cars. The open road is waiting.</p><div className="hero-emoji">🚗 <span>✦</span></div></section><section className="login-panel"><div className="form-card"><span className="eyebrow">WELCOME BACK</span><h2>Start your journey</h2><p>Sign in to explore our fleet and book a ride.</p><form onSubmit={submit}><label>Email address<input type="email" required value={email} onChange={e=>setEmail(e.target.value)}/></label><label>Password<input type="password" required value={password} onChange={e=>setPassword(e.target.value)}/></label>{error&&<p className="error">{error}</p>}<button className="wide" disabled={loading}>{loading?'Signing in...':'Sign In →'}</button></form><p className="hint">Demo: customer@driveeasy.test / Demo@12345</p></div></section></main>;
}