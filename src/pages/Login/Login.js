import axios from 'axios';
import React, { useState } from 'react'
import './Login.css';
import { ToastContainer, toast } from 'react-toastify';
import {NavLink, useNavigate} from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../../context/auth/AuthContext';
import { useTweetContext } from '../../context/auth/TweetContext';


const loginObject = {

	email:'',
	password:''
}
const Login = () => {
	const [loginDetails,setLoginDetails] = useState(loginObject);

	const [auth,setAuth] = useAuth()

	const navigate = useNavigate();

	const {getAllTweets} = useTweetContext()

	const handleChange = (e)=>{
		setLoginDetails({...loginDetails,[e.target.name]:e.target.value})
		console.log(loginDetails);
	}

	const sendLoginRequestToTheBackend = async(e)=>{
		e.preventDefault()
		const {data} = await axios.post('http://localhost:5000/auth/login',loginDetails)

		console.log(data)

		if(data?.error){
			toast.error(data?.error)
		}
		else{
			localStorage.setItem('auth',JSON.stringify(data));
			console.log(data)
			setAuth({
				...auth,token:data?.token,user:data?.user
			});
			getAllTweets()
			toast.success("User Logged In Successfully")
			navigate('/')
		}

	}
	
  return (
    <div class="container" id="container">
		<ToastContainer />
		<div class="form-container log-in-container">
			<form>
				<h1 className='form-heading login-heading'>Log in</h1>
				<input type="email" onChange={handleChange} name='email' placeholder="Email" />
				<input type="password" onChange={handleChange} name='password' placeholder="Password" />
                <button type='button' onClick={(e)=>sendLoginRequestToTheBackend(e)}>Login</button>
				<p>Don't have an account? <NavLink to='/register'>Register here</NavLink></p>
			</form>
		</div>
		<div class="overlay-container">
			<div class="overlay">
				<div class="overlay-panel overlay-right welcome-back">
					<i class="fa-solid iconStyle fa-hands-praying"></i>
                    <h2>Welcome Back</h2>
				</div>
			</div>
		</div>
	</div>
  )
}

export default Login