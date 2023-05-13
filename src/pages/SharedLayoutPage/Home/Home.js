import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../../context/auth/AuthContext';
import { useTweetContext } from '../../../context/auth/TweetContext';
import CreateCommentModal from '../Tweet/Comment/CreateCommentModal';
import CreateTweetModal from '../Tweet/CreateTweetModal';
import moment from 'moment'
import './Home.css'
const Home = () => {

    const [auth,setAuth] = useAuth();

    const {setTweetToAddACommentOn,tweetToAddACommentOn} = useTweetContext()
    const [showAllTweets,setShowAllTweets] = useState(true)
    const [reloadSingleTweet,setReloadSingleTweet] = useState(false)
    const ref = useRef(null);
    // ! tweetBool is changed after every create tweet
    // ! this causes a re-render and in turn calls getAllTweets to populate the Posts
// const [allTweets,setAllTweets] = useState([])

const {tweetBool,setTweetBool,allTweets,getAllTweets,getLoggedInUser,tweetsFromFollowingUsers} = useTweetContext()

const scrollToTop = () => {
    ref.current.scroll({
      top: 0,
    //   behavior: "smooth"
    });
  };

    console.log(tweetsFromFollowingUsers,'from home component')

    const followingTweetIds = tweetsFromFollowingUsers?.map((tweet)=>{
        return tweet?.tweetedBy?._id;
    })

    // console.log(followingTweetIds,'tweet IDs')

   
    const navigate = useNavigate()

    // const getAllTweets = async () => {
    //     try {
    //         const { data } = await axios.get('/tweet/getAllTweets', {
    //             // headers:{
    //             //     'Authorization':`Bearer ${auth?.token}`
    //             // }
    //         });
    //         if (data?.error) {
    //             toast.error(toast?.error, {
    //                 toastId: 'get All tweets'
    //             })
    //         } else {
    //             setAllTweets(data?.tweets);
    //         }
    //         console.log(data)

    //     } catch (error) {
    //         toast.error(error)
    //     }
    // }

    const sendRequestToBackendToReTweeet=async(id)=>{
        const {data} = await axios.post(`/tweet/createReTweet/${id}`)
        console.log(data)
        if(data?.error){
            toast.error(data?.error)
        }
        else if(data?.createNewTweetAsRetweet){
            toast.success('retweeted Successfully')
           
           
            // navigate('/')
        }
        // scrollToTop()
        getAllTweets()

    }


    const sendDeleteRequestToBackend = async(id)=>{
        // ! delete request
        const {data} = await axios.delete(`/tweet/deleteTweet/${id}`)
        
        if(data?.error){
            toast.error(data?.error)
        }else{
            if(data?.deletedReplies){
                toast.success(`Tweet deleted successfully along with ${data?.deletedReplies} nested reply(ies)`)
            }
            toast.success('Tweet Deleted Successfully');
            // ! load all tweets after the certain
            getAllTweets();
        }
     
    }

    const showSingleTweet = (id)=>{
        navigate(`/tweet/${id}`)
    }


    const fetchDetailsOfTweetToCommentOn = async(IDOftweetToCommentOn)=>{
        setTweetToAddACommentOn(IDOftweetToCommentOn)
        const {data} = await axios.get(`/tweet/getSingleTweet/${IDOftweetToCommentOn}`)  
    }
    console.log(tweetToAddACommentOn,'from fetch tweet details in home.js')

    const fetchUserDetails = async(userId)=>{
        navigate(`/profile/${userId}`)
    }

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
            getAllTweets()
        }
    }

   
   

    useEffect(()=>{
        getAllTweets();
    },[])
   

   
  return (
    <>

    
   
    <div class="feed " ref={ref}  style={{"minWidth":"40rem"}}>
        
        
            <div class="feed-header d-flex justify-content-between align-items-center">
                <h2>Home</h2>
                <button type="button" class="btn btn-primary tweet-btn" data-bs-toggle="modal"
                    data-bs-target="#exampleModal">
                    Tweet
                </button>
            </div>

            {allTweets.length===0 && <h1 style={{"textAlign":"center"}}>No Tweets</h1>}

            {
                allTweets &&
                allTweets.map((singleTweet,index)=>{
                    if(index===1){
                        console.log(singleTweet)
                    }
                    // ! to hide all replies from the home feed
                    // ! there is a property I attached in the Tweet Schema to make a check for this
                    if(singleTweet?.isAReply){
                        return;
                    }
                    // ! show all tweets of the following users along with the creator of a tweet(which is the logged In User who created the tweet)
                    // if(followingTweetIds.includes((singleTweet?.tweetedBy?._id) )  || (auth?.user?.userId)===(singleTweet?.tweetedBy?._id))
                    return <div class="single-feed">
                        {singleTweet?.isARetweet &&  <p style={{color:"blue",fontStyle:"italic"}}>ReTweeted By : @{singleTweet?.thisTweetIsRetweetedBy?.username}</p>}
                    <div class="tweet-header d-flex ">
                        <div class="user-profile-img-container">
                            {singleTweet?.tweetedBy?.profile_picture ? <img src={singleTweet?.tweetedBy?.profile_picture} style={{width:"100%"}} alt="" /> : <img src={require('../images/images/blank-profile-picture.webp')}/> }
                        </div>
    
    
                        <div className="username-container" onClick={()=>fetchUserDetails(singleTweet?.tweetedBy._id)}>
                            <span className="username">@{singleTweet?.tweetedBy?.username}</span>
                        </div>
                        <div class="date-container">
                            <span class="date">
                                
                               {moment(singleTweet?.createdAt).fromNow()}
                            </span>
                        </div>
    
                        <div class="delete-icon-container d-flex justify-content-between align-items-center"
                            style={{"marginRight":"2rem","width":"5rem",}}
                        >
                            {/* ! show the delete icon only when the logged in user id is equal to the tweetedBy Id
                                
                            */}
                            {/* ! if the retweet is created by the logged in user, then show the delete icon */}
                            {singleTweet?.thisTweetIsRetweetedBy?._id===auth?.user?.userId && <i onClick={()=>sendDeleteRequestToBackend(singleTweet._id)} class="fa-solid fa-trash-can"></i>}

                            {/* ! two delete icons were showing, so I added this condition to check
                                if the singleTweet is not a retweet, then only the the second delete icon.
                                now if I create a retweet then I can delete it.
                                And also it I create a tweet then I can delete it.
                                This makes sense.
                                When I added the retweet functionality, there was a problem because
                                the tweetedById was not matching the auth?.user?.userId (coming from authContext)
                            */}
                           {auth?.user?.userId === singleTweet?.tweetedBy?._id && !singleTweet?.isARetweet && 
                           <i onClick={()=>sendDeleteRequestToBackend(singleTweet._id)} class="fa-solid fa-trash-can"></i>  } 


                           <div  onClick={()=>showSingleTweet(singleTweet._id)}>
                            <i class='fa-solid fa-info' style={{"border":"1px solid black","padding":"1rem","borderRadius":"50%"}}></i>
                        </div>
                        </div>
                        

    
                    </div>
                    <div class="single-tweet-text">
                        <span>{singleTweet.content}</span>
                    </div>
                    {/* ! conditional logic to show/hide picture based on whether
                        there is an image in a tweet or not
                    */}
                    {singleTweet?.image ? 
                    <div class="single-tweet-img-container">
                        <img src={singleTweet?.image} alt="" />
                    </div> : 
                    null}
                    {/* <div class="single-tweet-img-container">
                        {singleTweet.image && <img src={singleTweet.image} alt="" />}
                    </div> */}
                    <div class="tweet-operations  d-flex gap-4">
                        <div class="like-icon-container" onClick={()=> sendLikeRequest(singleTweet._id)}>
                            <a ><i className={`${
                                singleTweet.likes.map((singleLike)=>{
                                //    ! when the current user has liked a certain post show a solid heart
                                    if(singleLike.user===auth?.user?.userId){
                                        return `fa-heart fa-solid`
                                    }
                                    else{
                                        return "fa-heart fa-regular"
                                    }
                                })
                                // ! when likes are zero return a regular heart 
                            } ${singleTweet?.likes?.length===0 &&'fa-regular fa-heart'}`}></i>
                                    
                            <span>{singleTweet?.likes?.length}</span></a>

                                    {/* // "fa-solid fa-heart" :"fa-regular fa-heart"                                */}
                        </div>
                        <div class="comment-icon-container" onClick={()=>fetchDetailsOfTweetToCommentOn(singleTweet._id)} >
                            <a  data-bs-toggle="modal" 
                            data-bs-target="#exampleModal2" ><i class="fa-regular fa-comment"></i>
                            <span>{singleTweet?.replies?.length}</span></a>
    
                        </div>
    
                        <div class="retweet-icon-container" onClick={()=>sendRequestToBackendToReTweeet(singleTweet._id)}>
                            <i class="fa-solid fa-retweet"></i>
                            <span>{singleTweet?.reTweetedBy?.length}</span>
                        </div>
                    </div>
                    
                </div>
                } ) 
            }
            









        </div>
        <CreateTweetModal />
        <CreateCommentModal reloadSingleTweet={reloadSingleTweet} setReloadSingleTweet={setReloadSingleTweet}/>
        </>
  )
}

export default Home