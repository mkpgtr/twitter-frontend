import axios from 'axios';
import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTweetContext } from '../../../context/auth/TweetContext';
import CreateCommentModal from '../Tweet/Comment/CreateCommentModal';
import './SingleTweetPage.css'
const SingleTweetPage = () => {

    const {auth,setTweetToAddACommentOn,tweetToAddACommentOn,sendRequestToBackendToReTweeet} = useTweetContext()
    const [singleTweet,setSingleTweet] = useState()
    const [reloadSingleTweet,setReloadSingleTweet] = useState(false)
   

    const params = useParams()
    const navigate = useNavigate()
    const id = params.id;

    // const date = new Date(singleTweet?.createdAt).toDateString()
    const date = moment(singleTweet?.createdAt).fromNow()

    const sendLikeRequest = async(id)=>{
        // e.stopEvent()
        const {data} = await axios.put(`/tweet/likeTweet/${id}`)

        if(data?.error){
            toast.error(data?.error)
        }else{
            // ! i am sending a boolean from the backend
            if(data?.like){

                toast.info("Tweet Liked Successfully")
            }
            // ! when like is true it means tweet was unliked
            if(!data?.like){
                toast.info("Tweet Unliked Successfully")

            }
            getSingleTweetDetails()
        }
    }

    const sendDeleteRequestToBackend = async(id)=>{
        const {data} = await axios.delete(`/tweet/deleteTweet/${id}`);
        
        if(data?.error){
            toast.error(data?.error)
        }else{

            // ! this is very helpful when deleting a tweet that is not a reply
            // ! when this happens we know that we are deleting a tweet
            // ! after deleting this tweet we navigate to the homepage because it does not make sense to stay on the single tweet page
            // ! without the tweet
            if(data?.deletedTweetNotAReply){
                // toast.success('Tweet Deleted Successfully');
                navigate('/')
            }
            toast.success('Comment Deleted Successfully');

            if(data?.deletedTweet){
                // ! this will lead to the parent tweet of the deleted reply.
                // ! this really made me feel so good
                // ! to send data from the backend to cause conditional navigation from the frontend
                navigate(`/tweet/${data?.parentTweet}`)
            }
            getSingleTweetDetails();

        }

        setReloadSingleTweet(!reloadSingleTweet)
     
    }

    // ! show single tweet
    
    // ! this function is applied on the replies. because the replies are themselves tweets
    // ! when we click the info icon on any reply we trigger this function and show it as a single tweet

    const showSingleTweet = (id)=>{
        // ! navigate to the single tweet page 
        navigate(`/tweet/${id}`)
        getSingleTweetDetails();
        
       
    }
    const fetchDetailsOfTweetToCommentOn = async(IDOftweetToCommentOn)=>{
        setTweetToAddACommentOn(IDOftweetToCommentOn)
        console.log(tweetToAddACommentOn,'tweetid to add a comment on')
        const {data} = await axios.get(`/tweet/getSingleTweet/${IDOftweetToCommentOn}`)
        console.log(data)
        
    }
   
    // ! send request to the backend to get the details of a single tweet
    const getSingleTweetDetails = async()=>{

        const {data} = await axios.get(`/tweet/getSingleTweet/${id}`)
        if(data?.singleTweet){
            console.log(data?.singleTweet?.tweetedBy?.username)
            setSingleTweet(data?.singleTweet)
            console.log(data)
        }
    }

    if(!singleTweet){
        getSingleTweetDetails()
    }
    

    useEffect(()=>{
        getSingleTweetDetails()
        // ! singleTweet?.replies changes every time we reply, that's when useEffect runs and 
        // ! getSingleTweetDetails is caled
        // ! i was stuck at this for 1+ hours

        // ! reloadSingleTweet is like a connection between createTweetModal and singleTweetPage
        // ! this helps reload the singleTweet with updated replies count when I add a new comment
        // ! I spent more than 1.5 hrs on this and was finally so happy to get this done.
        
    },[id,tweetToAddACommentOn,reloadSingleTweet])


    console.log(singleTweet)
    
    if(!singleTweet){
        return <h1 style={{marginTop:"4rem"}}> No tweets To SHow</h1>
    }

  return (
    <div>
        
        <div class="single-feed" style={{"marginTop":"6.6rem","minWidth":"45rem"}}>
                    <div class="tweet-header d-flex ">
                       {
                        singleTweet?.tweetedBy?.profile_picture ?  <div class="user-profile-img-container">
                        <img src={singleTweet?.tweetedBy?.profile_picture} alt="" />
                    </div> : <div class="user-profile-img-container">
                        <img src={require('../images/images/blank-profile-picture.webp')} alt="" />
                    </div>
                       }
    
    
                        <div className="username-container">
                            <span className="username">{singleTweet?.tweetedBy?.username}</span>
                        </div>
                        <div class="date-container">
                            <span class="date">
                                
                               {date}
                            </span>
                        </div>
                        {singleTweet?.tweetedBy?._id === auth?.user?.userId && <div class="delete-icon-container" onClick={()=>sendDeleteRequestToBackend(singleTweet._id)}>
                            <i  class="fa-solid fa-trash-can"></i>
                        </div>}
                        
    
                    </div>
                    <div class="single-tweet-text">
                        <span>{singleTweet?.content}</span>
                    </div>
                    {/* ! conditional logic to show/hide picture based on whether
                        there is an image in a tweet or not
                    */}
                    {singleTweet?.image ?  <div class="single-tweet-img-container">
                        <img src={singleTweet?.image} alt="" />
                    </div> :null}
                   

                    {/* <div class="single-tweet-img-container">
                        {singleTweet.image && <img src={singleTweet.image} alt="" />}
                    </div> */}
                    <div class="tweet-operations  d-flex gap-4">
                        <div class="like-icon-container" 
                        >
                            <a ><i onClick={()=> sendLikeRequest(singleTweet._id)} className={`${singleTweet?.likes.map((singleLike)=>{
                                if(singleLike.user===auth?.user?.userId){
                                    return `fa-heart fa-solid`
                                }
                                else{
                                    return "fa-heart fa-regular"
                                }
                            //    return like.user==auth?.user?.userId ? 'fa-solid fa-heart':'fa-regular fa-heart'
                            })} ${singleTweet?.likes?.length===0 &&'fa-regular fa-heart'}` }></i>
                                    
                            <span>{singleTweet?.likes?.length}</span></a>
                                    {/* // "fa-solid fa-heart" :"fa-regular fa-heart"                                */}
                        </div>
                        <div class="comment-icon-container" onClick={()=>fetchDetailsOfTweetToCommentOn(singleTweet._id)}  >
                            <a  data-bs-toggle="modal" 
                            data-bs-target="#exampleModal2" ><i class="fa-regular fa-comment"></i>
                            <span>{singleTweet?.replies?.length}</span></a>
    
                        </div>
    
                        <div class="retweet-icon-container" onClick={()=>sendRequestToBackendToReTweeet(singleTweet?._id)}>
                            <i class="fa-solid fa-retweet"></i>
                            <span>{singleTweet?.reTweetedBy?.length}</span>
                        </div>
                    </div>
                    <div>

                    </div>
                    
                    {
                        singleTweet?.replies.map((reply,index)=>{
                            // ! return when reply is null
                            // ! i faced this problem of empty comments when I deleted a comment
                            // ! but the tweet showed in its array of replies a null reply
                            if(reply?.reply===null){
                                return
                            }
                            return <div style={{marginLeft:"2rem",marginTop:"2rem"}}>
                            
                            {/* ! give a margin of 1rem above the 1st reply */}
                    <span style={{"marginLeft":"3rem","fontWeight":"bold"}}>@{reply?.reply?.tweetedBy?.username}</span><span style={{marginLeft:"1rem"}}>{moment(reply?.reply?.createdAt).fromNow()}</span>
                            <div style={ {  'marginTop':index==0 && "1rem"}} class="single-tweet-text fw-light d-flex justify-content-start align-items-center">
                            {
                        reply?.reply?.tweetedBy?.profile_picture ?  <div class="user-profile-img-container">
                        <img src={reply?.reply?.tweetedBy?.profile_picture} alt="" />
                    </div> : <div class="user-profile-img-container">
                        <img src={require('../images/images/blank-profile-picture.webp')} alt="" />
                    </div>
                       }
                        <span className='ms-5'>{reply?.reply?.content}</span>
                       {auth?.user?.userId === reply?.reply?.tweetedBy?._id &&  <div style={{marginRight:"3rem", border:"1px solid blue"}} class="delete-icon-container">
                            <i  class="fa-solid fa-trash-can" onClick={()=>sendDeleteRequestToBackend(reply?.reply?._id)}></i>
                        </div>}
                        <span className='ms-5' style={{border:"1px solid black",borderRadius:"20px", padding:"1rem"}} onClick={()=>showSingleTweet(reply?.reply?._id)}>
                            <i class="fa-solid fa-info" ></i>
                            </span>
                    </div>
                  
                    <div class="tweet-operations  d-flex gap-4">
                            <div class="like-icon-container" 
                            >
                                <a ><i className={`
                                ${
                                    reply?.reply?.likes.map((singleLike)=>{
                                        //    ! when the current user has liked a certain post show a solid heart
                                            if(singleLike.user===auth?.user?.userId){
                                                return `fa-heart fa-solid`
                                            }
                                            else{
                                                return "fa-heart fa-regular"
                                            }
                                        })
                                } ${reply?.reply?.likes?.length===0 &&'fa-regular fa-heart'}
                                `
                               
                                // ! when likes are zero return a regular heart 
                            } onClick={()=>sendLikeRequest(reply?.reply?._id)}></i>
                                        
                                <span>{reply?.reply?.likes?.length}</span></a>
                                        {/* // "fa-solid fa-heart" :"fa-regular fa-heart"                                */}
                            </div>
                            <div class="comment-icon-container" onClick={()=>fetchDetailsOfTweetToCommentOn(reply?.reply?._id)}  >
                                <a  data-bs-toggle="modal" 
                                data-bs-target="#exampleModal2" ><i class="fa-regular fa-comment"></i>
                                <span>{reply?.reply?.replies?.length}</span></a>
        
                            </div>
        
                            <div class="retweet-icon-container" onClick={()=>sendRequestToBackendToReTweeet(reply?.reply?._id)}>
                                <i class="fa-solid fa-retweet"></i>
                                <span>0</span>
                            </div>
                        </div>
                            
                            </div>
                           
                        })
                    }
                    
                </div>
             
             {/* ! to cause a reload when a reply has been added */}
<CreateCommentModal reloadSingleTweet={reloadSingleTweet} setReloadSingleTweet={setReloadSingleTweet}/>
    </div>
  )
}

export default SingleTweetPage