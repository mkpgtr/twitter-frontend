import './Sidebar.css'

import React, { useEffect } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import ContainerLarge from '../../../ContainerLarge/ContainerLarge'
import Modal from '../Modal/Modal'
import { useAuth } from '../../../context/auth/AuthContext'
import { useTweetContext } from '../../../context/auth/TweetContext'


const Sidebar = () => {




    const [auth,setAuth] = useAuth();
    const {authDetails,setAuthDetails} = useTweetContext()

    

    const navigate = useNavigate();
    
    
    


    


    const logOut = () => {
        setAuth({ ...auth, user: null, token: '' });
        setAuthDetails({ ...auth, user: null, token: '' });
        localStorage.removeItem('auth');
    
        navigate('/login')
        console.log('after navigate')
      }
  return (
    <ContainerLarge>
    <div class="sidebar">
    <i class="fa-regular fa-message"></i>
    <div class="sidebarOption active">
        <span class="material-symbols-outlined">
            home
        </span>
        <NavLink to='/'>
            <h2>Home</h2>
            </NavLink>
    </div>
    <div class="sidebarOption">
        <span class="material-symbols-outlined">
            person
        </span>
        <NavLink to='/profile'>
            <h2>Profile</h2>
            </NavLink>
    </div>
    <div class="sidebarOption">
        <span class="material-symbols-outlined">
            logout
        </span>
        <a onClick={()=>logOut()}>
            <h2>logout</h2>
            </a>
    </div>
    <div class="sidebarOption2 justify-content-center gap-2 last-sidebar-item">
        <div class="user-profile-img-container">
            <img src="./images/blank-profile-picture-973460__340.webp" alt=""/>
        </div>
        <div class="name-n-username-container">
            <h2>{auth?.user?.name}</h2>
            <div class="username-container">
                <span>@{auth?.user?.username}</span>
            </div>
        </div>
    </div>

</div>

<Outlet/>
{/* <Modal /> */}
</ContainerLarge>
  )
}

export default Sidebar