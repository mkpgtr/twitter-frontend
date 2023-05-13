import React, { useEffect } from 'react'
import { useNavigate,Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/auth/AuthContext';
import Login from '../../pages/Login/Login';


const ProtectedRoute = ({children}) => {

    const [auth,setAuth] = useAuth();
    const navigate = useNavigate()

   useEffect(()=>{
    if(!localStorage.getItem('auth')){
        toast.warning("Please login to continue",{
          toastId:"please login to continue post"
        })
        return navigate('/login')
     }
   },[]);

  return (
    <div>
      {children}
    </div>
  )
}

export default ProtectedRoute