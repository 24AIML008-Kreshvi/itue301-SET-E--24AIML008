import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
export default function Nav() {
 const { customer, logout } = useAuth(); const navigate = useNavigate();
 return <header className="nav"><Link className="brand" to="/">Drive<span>Easy</span><small>CAR RENTALS</small></Link><nav>
 <NavLink to="/">Login</NavLink><NavLink to="/fleet">Fleet</NavLink><NavLink to="/my-bookings">My Bookings</NavLink><NavLink to="/admin">Admin</NavLink>
 </nav><div className="account">{customer && <span>Hi, {customer.name}</span>}{customer && <button className="outline small" onClick={() => { logout(); navigate('/'); }}>Logout</button>}</div></header>;
}