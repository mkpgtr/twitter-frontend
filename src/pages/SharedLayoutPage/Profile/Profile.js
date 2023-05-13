import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useAuth } from '../../../context/auth/AuthContext';
import { useTweetContext } from '../../../context/auth/TweetContext';
import '../SharedLayoutPage.css'
import {ProfileImage} from '../images/images/blank-profile-picture.webp'
import EditProfileModal from './EditProfileModal';
import './Profile.css'
import CreateCommentModal from '../Tweet/Comment/CreateCommentModal';
import EditProfileDetailsModal from './EditProfileDetailsModal';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

const Profile = () => {

    
   const [auth,setAuth] = useAuth()
    const {authDetails,getSingleUserDetails,singleUserPageDetails,showSingleTweet,sendDeleteRequestToBackend,sendLikeRequest,fetchDetailsOfTweetToCommentOn,sendRequestToBackendToReTweeet,allTweets} = useTweetContext();
    const [loggedInUser,setLoggedInUser] = useState()
    const [reloadSingleTweet,setReloadSingleTweet] = useState(false)
    const[renderBool,setRenderBool] = useState(false)
    
    console.log(authDetails,'from profile js')
    

    console.log(singleUserPageDetails)

    const fetchSingleUserDetails = async(id)=>{
        const {data} = await axios.get(`/user/getSingleUser/${id}`)
        if(data?.user){
            setLoggedInUser(data?.user)
        }
    }

    const fetchUserDetails = async(userId)=>{
        navigate(`/profile/${userId}`)
    }

   
    const navigate = useNavigate()
    
    if(!loggedInUser){
        fetchSingleUserDetails(auth?.user?.userId)
    }
    
    useEffect(()=>{
        getSingleUserDetails()

    //    ! added allTweets to the dependence array because when I delete a tweet I want to cause a re-render
    // ! when it was not added I was not able to see my new list of updated tweets after I deleted one tweet.
    },[allTweets,loggedInUser,renderBool])


    console.log(loggedInUser,'profile page single user')
    const date = new Date(auth?.user?.joiningDate);


// ! jsx
  return (
    <div class="profile">
            <div class="feed-header d-flex justify-content-between align-items-center">
                <h2>Profile</h2>
                
            </div>

            <div class="profile-details border border-white">
                {/* <!--justify-content-between align-items-center for button floating on right end side --> */}
                <div class="profile-followbtn d-flex justify-content-between align-items-center">
                    <div class="profile-information">
                        <center>
                            <div class="profile-information-img ">
                        <img src={loggedInUser?.profile_picture ? loggedInUser?.profile_picture : require('../images/images/blank-profile-picture.webp')} alt=""/>
                    </div>
                    </center>
                    <div class="profile-name">
                        <h2>{auth?.user?.name}</h2>
                        <span>@{auth?.user?.username}</span>
                    </div>
                        <div class="profile-username">
                            
                        </div>
                    
                    </div>
                    <button  type="button" class="btn btn-dark user-profile-photo-upload " data-bs-toggle="modal"
                    data-bs-target="#exampleModal3">
                        <span >Update Profile Photo</span>
                    </button>
                    <button type="button" class="btn btn-dark user-profile-edit" data-bs-toggle="modal"
                    data-bs-target="#exampleModal4">
                    <span>Edit</span>
                </button>
                    </div>
              <div class="other-details">
                <div class="birthday-location d-flex">
                    <div class="birthday">
                    <i class="fa-solid fa-cake-candles"></i>
                    <span>Date Of Birth:</span><span id="dob">{(new Date(auth?.user?.DateOfBirth).toDateString())}</span>
                </div>
                <div class="location">
                    <i class="fa-solid fa-location-dot"></i>
                    <span>Location:</span><span id="location">{auth?.user?.location || loggedInUser?.location}</span>
                </div>
                </div>
                <div class="joining-date">
                    <i class="fa-regular fa-calendar"></i>
                    <span>Joined:</span><span id="joining">{date.toDateString()}</span>
                </div>
               
              </div>
              <div class="followers-n-following d-flex">
                <div class="following">
                    <span id="Following">{loggedInUser?.following?.length}</span><span>Following</span>
                </div>
                <div class="followers">
                    <span  id="Followers">{loggedInUser?.followers?.length}</span><span>Followers</span>
                </div>
                     
                </div>

                <div class="heading-tweet-profile"><center><h4>Tweets and Replies</h4></center></div>
               {/* <!--singletweety--> */}
               {
                singleUserPageDetails && singleUserPageDetails?.tweets?.map((tweet)=>{
                    return<div class="single-feed">
                {/* <!-- ! four flex items --> */}
                {/* <!-- ! user-profile picture, username, date aur last me delete icon --> */}
                <div class="tweet-header d-flex ">
                    {/* <!-- ! profile image container --> */}
                    <div class="user-profile-img-container">
                {loggedInUser?.profile_picture ?  <img src={loggedInUser?.profile_picture} alt="" /> :
                <img src={require('../images/images/blank-profile-picture.webp')} alt="" />    
            }
            </div>

                    {/* <!-- ! username container --> */}

                    <div class="username-container">
                        <span  onClick={()=>fetchUserDetails(auth?.user?.userId)} class="username">@{tweet?.tweetedBy?.username} -</span>
                    </div>
                    <div class="date-container">
                        <span class="date">
                            {moment(tweet?.createdAt).fromNow()}
                        </span>
                    </div>
                    

                   {auth?.user?.userId===tweet?.tweetedBy?._id &&  <div class="delete-icon-container" onClick={()=>sendDeleteRequestToBackend(tweet._id)}>
                        <i class="fa-solid fa-trash-can"></i>
                    </div>}
                    <div  onClick={()=>showSingleTweet(tweet._id)}>
                            <i class='fa-solid fa-info' style={{"border":"1px solid black","padding":"1rem","borderRadius":"50%"}}></i></div>

                </div>
                <div class="single-tweet-text">
                    <span>{tweet?.content}</span>
                    
                </div>

                {tweet?.image ? <div class="single-tweet-img-container">
                    <img src={tweet?.image} alt="" />
                </div>:null}
                <div class="tweet-operations  d-flex gap-4">
                    <div class="like-icon-container" onClick={()=>sendLikeRequest(tweet._id)}>
                        <i class={`${
                                tweet.likes.map((singleLike)=>{
                                //    ! when the current user has liked a certain post show a solid heart
                                    if(singleLike.user===auth?.user?.userId){
                                        return `fa-heart fa-solid`
                                    }
                                    else{
                                        return "fa-heart fa-regular"
                                    }
                                })
                                // ! when likes are zero return a regular heart 
                            } ${tweet?.likes?.length===0 &&'fa-regular fa-heart'}`}></i>
                        <span>{tweet?.likes?.length}</span>
                    </div>
                    <div class="comment-icon-container" onClick={()=>fetchDetailsOfTweetToCommentOn(tweet._id)}>
                        <a href="#" data-bs-toggle="modal"
                        data-bs-target="#exampleModal2"><i class="fa-regular fa-comment"></i>
                        <span>{tweet?.replies?.length}</span></a>

                    </div>

                    <div class="retweet-icon-container" onClick={()=>sendRequestToBackendToReTweeet(tweet._id)}>
                        <i class="fa-solid fa-retweet"></i>
                        <span>{tweet?.reTweetedBy?.length}</span>
                    </div>
                </div>
            </div>
                }) 
               } {singleUserPageDetails?.tweets?.length===0 && <h1 style={{"textAlign":"center",border:"1px solid black"}}>No Tweets & Replies To Show</h1>} 
               {/* <!--singletweety-->/ */}
              
               {/* <!--singletweety--> */}
            </div>
           
           

<EditProfileModal/>
<CreateCommentModal reloadSingleTweet={reloadSingleTweet} setReloadSingleTweet={setReloadSingleTweet}/>
<EditProfileDetailsModal currentUser={auth} />

        </div>
  )
}

export default Profile