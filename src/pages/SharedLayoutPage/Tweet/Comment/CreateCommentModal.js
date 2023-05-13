import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuth } from '../../../../context/auth/AuthContext'
import { useTweetContext } from '../../../../context/auth/TweetContext'
import './Modal.css'

const CreateCommentModal = ({reloadSingleTweet,setReloadSingleTweet}) => {

    const {tweetToAddACommentOn,getAllTweets,getSingleUserDetails} = useTweetContext()
    const [comment,setComment] = useState();
    const [auth,setAuth] = useAuth();
    const [singleTweet,setSingleTweet] = useState()



    const navigate = useNavigate()
    const id = useParams()

    useEffect(()=>{
        getAllTweets()
       },[reloadSingleTweet])



    const sendPostRequestToAddCommentRouteInTheBackend =async()=>{

        const tweetComment = {
            content:comment,
            commentedBy:auth?.user?.userId
        }

        console.log(tweetToAddACommentOn,'tweet to add a comment on')

        const {data} = await axios.put(`/tweet/createComment/${tweetToAddACommentOn}`,tweetComment)

       if(data?.error){
        toast.error(data?.error)
       }else{
        // ! just to refresh all the tweets with updated comments
        
        // if(data?.tweetToAddACommentOn?.isAReply){
        //     navigate(`/tweet/${data?.tweetToAddACommentOn?.isAReplyOfTweet}`)
        // }  
        console.log(data,'data coming from createcomment2')
        getSingleUserDetails()
        setReloadSingleTweet(!reloadSingleTweet)
        toast.success('Comment added Successfully')

        // getSingleTweetDetails()

       }

      

       
    }

    return (<>
        <div class="modal fade" id="exampleModal2" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel">Tweet your reply</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <input className="new-tweet" onChange={(e)=>setComment(e.target.value)} cols="60" rows="5" placeholder="Add your reply here" />
                </div>
                <div class="upload-image-div">
    
                    <i class="fa-regular fa-image"></i>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary tweet-btn-2" data-bs-dismiss="modal" onClick={()=>sendPostRequestToAddCommentRouteInTheBackend()}>Reply</button>
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
                    <button type="button" onClick={()=>sendPostRequestToAddCommentRouteInTheBackend(tweetToAddACommentOn)} class="btn btn-primary tweet-btn-2">Reply</button>
                </div>
            </div>
        </div>
        
    </div>
    </>
      )
}

export default CreateCommentModal