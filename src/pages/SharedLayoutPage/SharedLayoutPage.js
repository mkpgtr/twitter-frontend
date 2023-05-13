import React from 'react'
import { Outlet } from 'react-router-dom'
import ContainerLarge from '../../ContainerLarge/ContainerLarge'
import Modal from './Modal/Modal'
import './SharedLayoutPage.css'
import Sidebar from './Sidebar/Sidebar'

const SharedLayoutPage = () => {
  return (
      <div>
          <ContainerLarge>
        {/* ! sidebar */}
       <Sidebar />
        {/* ! profile section */}
        
        <Outlet />
        </ContainerLarge>
     
        {/* ! modal */}

        <Modal />
    </div>
   

  )
}

export default SharedLayoutPage