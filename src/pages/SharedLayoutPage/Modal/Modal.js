import './Modal.css'

import React, { useState } from 'react'
import { useAuth } from '../../../context/auth/AuthContext'



const Modal = () => {

 

   
  return (<>
    <div class="modal fade" id="exampleModal4" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="exampleModalLabel">Tweet your reply</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <input className="new-tweet" cols="60" rows="5" placeholder="Add your reply" />
            </div>
            <div class="upload-image-div">

                <i class="fa-regular fa-image"></i>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary tweet-btn-2">Tweet</button>
            </div>
        </div>
    </div>
    
</div>




<div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="exampleModalLabel">Tweet Your Status</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <textarea class="new-tweet" name = "content" id="" cols="45" rows="5" placeholder="Add your reply"
                    value=""></textarea>
            </div>
            <div class="upload-image-div">

                <i class="fa-regular fa-image"></i>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary tweet-btn-2">Reply</button>
            </div>
        </div>
    </div>
    
</div>
</>
  )
}

export default Modal