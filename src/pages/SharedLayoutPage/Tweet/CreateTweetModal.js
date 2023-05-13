import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuth } from '../../../context/auth/AuthContext'
import { useTweetContext } from '../../../context/auth/TweetContext'

const CreateTweetModal = () => {

    const {auth,tweetBool,setTweetBool,getAllTweets} = useTweetContext()
    const [file,setFile] = useState()


    

    
    
    const tweetObject = {
        content: '',
        tweetedBy:auth?.user?.userId
    }


    const [tweet, setTweet] = useState(tweetObject)

    const handleFileChange = async(e)=> {
        const img = {
            // ! reactogram
            preview : URL.createObjectURL(e.target.files[0]),
            data:e.target.files[0]
        }

        console.log(e.target.files[0])
        setFile(img)
        
    }
    console.log(file,'file change');


   


    
    const handleChangeFromCreateTweetTextArea = (e)=>{

        

        setTweet(
        {
            ...tweet,
        [e.target.name]:e.target.value
    }
        )
    }

    

    const sendPostRequestToBackendToCreateTweet = async () => {

        // ! intialize javascript form data
        const formData = new FormData();

        let image_url = ''

        formData.append('file',file?.data)

        // ! send the image to the backend
        // ! from backend, upload the image to cloud
        const {data} = await axios.post('/tweet/uploadPictureToCloud',formData,{
            headers:{
                "Content-Type":"multipart/form-data",
            
            }
        })

        console.log(data)

        if(data?.error){
            toast.error(data?.error)
        }else{
            // ! image url coming from the backend
            image_url = data?.imgURL
            console.log(image_url)
        }

        // ! package the tweet and image into one object
        // ! and then send it to the backend
        const finalTweetObjectToSendToBackend = {
            tweet,
            image:image_url?.url || null
            
        }
   
        
        try {
          
            const { data } = await axios.post('/tweet/createTweet', {...finalTweetObjectToSendToBackend},{
               
            })
            console.log(data)

            if (data?.error) {
                toast.error(data?.error)
            } else {
                // ! show react-toastify toast
                toast.success("Tweet Created Successfully")
                setFile('')
                setTweet(tweetObject)
                getAllTweets()
            }
        } catch (error) {
            toast.error(error)
        }
    }

    

   
   

  return (
    <div class="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="exampleModalLabel">Tweet Your Status</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <textarea class="new-tweet" onChange={handleChangeFromCreateTweetTextArea} name = "content" id="" cols="45" rows="5" placeholder="Create Tweet"
                    />
                    {file?.preview && <img src={file?.preview} width='100px' height='110px' />}
            </div>
            <div class="upload-image-div">
                <input type="file" name='file' onChange={handleFileChange}/>
                <i class="fa-regular fa-image"></i>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" data-bs-dismiss="modal" onClick={()=>sendPostRequestToBackendToCreateTweet()} class="btn btn-primary tweet-btn-2">Tweet</button>
            </div>
        </div>
    </div>
    
</div>
  )
}

export default CreateTweetModal