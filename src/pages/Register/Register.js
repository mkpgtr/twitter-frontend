import React, { useState } from 'react'
import './Register.css'
import axios from 'axios'
import { useAuth } from '../../context/auth/AuthContext'
import { toast } from 'react-toastify'
import { NavLink, useNavigate } from 'react-router-dom'



const registerObject = {
 name:'',
 username:'',
 email:'',
 password:''
}
const Register = () => {

    const [registerDetails,setRegisterDetails] = useState(registerObject)

    const [auth,setAuth] = useAuth()
    const navigate = useNavigate()
    

    const handleChange = (e)=>{
        setRegisterDetails({...registerDetails,[e.target.name]:e.target.value})
        console.log(registerDetails)
    }

    const sendRequestToBackendToRegisterRoute =async(e)=>{
      e.preventDefault();
        const {data} = await axios.post('http://localhost:5000/auth/register',registerDetails)
        if(data?.error){
          toast.error(data?.error)
        }
        else{
          localStorage.setItem('auth',JSON.stringify(data));
          setAuth({
            ...auth,token:data?.token,user:data?.user
          });
          toast.success("Registration Successful! Please Login")
          navigate('/login')
        }
    }
  return (
  <div className="container" id="container">
  <div className="form-container register-container">
    <form>
      <h1 className='form-heading'>Register</h1>
      <input type="name" onChange={handleChange} name="name" placeholder="Full Name" />
      <input type="email" onChange={handleChange} name="email" placeholder="Email" />
      <input type="username" onChange={handleChange} name="username" placeholder="Username" />
      <input type="password" onChange={handleChange} name="password" placeholder="Password" />
      <button type='button' onClick={(e)=>sendRequestToBackendToRegisterRoute(e)}>Register</button>

      <p>Already Registered? <NavLink to='/login'>Login here</NavLink></p>
    </form>
  </div>
  <div className="container__overlay">
    <div className="overlay">
      <div className="overlay-panel overlay-right">
        <h2 className='mb-1'>Join Us</h2>
        <i className="fa-regular iconStyle fa-comment-dots" />
      </div>
    </div>
  </div>
</div>

  )
}

export default Register