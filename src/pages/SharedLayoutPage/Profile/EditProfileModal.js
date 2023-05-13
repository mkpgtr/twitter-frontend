import axios from 'axios';
import React, { useState } from 'react'
import { toast } from 'react-toastify';
import { useTweetContext } from '../../../context/auth/TweetContext';

const EditProfileModal = () => {

    const {auth} = useTweetContext()
    const [file,setFile] = useState()
    const [loggedInUser,setLoggedInUser] = useState()
   

    const sendPostRequestToBackendToUploadProfilePhoto = async () => {

        if(!file){
            return toast.error('Please upload a file')
        }
        const formData = new FormData();

        let image_url = ''

        formData.append('file',file?.data)

        const {data} = await axios.post('/user/uploadProfilePicture',formData,{
            headers:{
                "Content-Type":"multipart/form-data"
            }
        })

        console.log(data)

        if(data?.error){
            toast.error(data?.error)
        }else{
            image_url = data?.imgURL
            console.log(image_url)
            window.location.reload()
        }
    }
    const handleChange = (e)=>{
        console.log('from edit profile file change')
        const img = {
            preview : URL.createObjectURL(e.target.files[0]),
            data:e.target.files[0]
        }
        console.log(e.target.files[0])
        setFile(img)
    }
    return (<>
        <div class="modal fade" id="exampleModal3" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel">Upload Your Photo</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <input type='file' onChange={handleChange} className="new-tweet" cols="60" rows="5" placeholder="Add your reply" />
                </div>
                <div class="upload-image-div">
    
                    <i class="fa-regular fa-image"></i>
                </div>
                {file?.preview && <img style={{"margin":"0 auto"}} src={file?.preview} width='100%' height='310px' />}
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" data-bs-dismiss="modal" onClick={()=>sendPostRequestToBackendToUploadProfilePhoto()} class="btn btn-primary tweet-btn-2">Upload</button>
                </div>
            </div>
        </div>
        
    </div>
    
    
    
  
    </>
      )
}

export default EditProfileModal