import axios from 'axios'

import { useState, createContext, useContext, useEffect } from 'react'
import { useNavigate,Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from './AuthContext';
import  { getLoggedInUser, getTweetsFromFollowingUsers } from './tweet-utils/getTweetsFromFollowingUser';

const TweetContext = createContext();


const TweetProvider = ({ children }) => {
    
    const navigate = useNavigate()
    const [allTweets, setAllTweets] = useState([]);
    const [auth, setAuth] = useAuth();
    // ! to store the tweets & replies from the single user page
    const [singleUserPageDetails,setSingleUserPageDetails] = useState()
    const [tweetsFromFollowingUsers,setTweetsFromFollowingUsers] = useState([])
    const [authDetails,setAuthDetails] = useState()
    
    const [tweetBool, setTweetBool] = useState(false);
    const [tweetToAddACommentOn,setTweetToAddACommentOn] = useState(null)
    // console.log(auth,'auth context from tweetProvider')

    // console.log(authDetails,'ultimate source of truth')

    
    
// ! correcting my past mistake of not globally writing functions inside tweetContext
// ! this sendLikeRequest function is being used by Profile.js & also SingleUserPage.js
    const sendLikeRequest = async(tweetToLike)=>{
        const {data} = await axios.put(`/tweet/likeTweet/${tweetToLike}`)
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
            getSingleUserDetails()
            getAllTweets()
        }
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
        // ! i shifted the browser router and routes component from the app.js
        // ! to the index.js file because this navigate function was not working. 
        navigate(`/tweet/${id}`);
    }

    // ! globally defining this in TweetContext so that Profile & SingleUserPage can access it
    // ! I anxiously started building this twitter-clone imagining all the things that could go wrong and so my planning was not good while I started this.
    // ! I regretted not planning it before when things started working out and I built the like/unlike system.
    // ! I now know that planning is important and that components should derive their state of reality from a single source
    

    const fetchDetailsOfTweetToCommentOn = async(IDOftweetToCommentOn)=>{
        setTweetToAddACommentOn(IDOftweetToCommentOn)
        const {data} = await axios.get(`/tweet/getSingleTweet/${IDOftweetToCommentOn}`)  
    }
   

    const sendRequestToBackendToReTweeet=async(id)=>{
        const {data} = await axios.post(`/tweet/createReTweet/${id}`)
        console.log(data)
        if(data?.error){
            toast.error(data?.error)
        }
        else{
            toast.success('retweeted Successfully')
            
            navigate('/')
        }
        
        // ! this get all tweets is here to assure me that I update the state after retweeting.
        // ! but there are other better ways of doing it
        getAllTweets()

    }
   
    

    async function getLoggedInDetails(){

        const loggedInUser = await getLoggedInUser();
        console.log(loggedInUser)
        const following = await getTweetsFromFollowingUsers(loggedInUser);

        console.log(following)
        setTweetsFromFollowingUsers(following?.tweets)
        
        return loggedInUser;
    }

    const getSingleUserDetails = async()=>{
        const {data} = await axios.get(`/user/getSingleUser`);
        if(data?.error){
            toast?.error(data?.error)
        }else{
            setSingleUserPageDetails(data)
        }


    }

    // ! to ensure that we always have some data in the SingleUserPageDetails 
    if(!singleUserPageDetails){
        getSingleUserDetails();
    }
    console.log(singleUserPageDetails)

    // ! my tweets were not loading after logged in from the frontend
    // ! this saved my life
    if(!tweetsFromFollowingUsers){
        getLoggedInDetails()
    }

    console.log(tweetsFromFollowingUsers)
  

    
    





    




    


    // const tweets = getTweetsFromFollowingUsers(loggedInUser)

    // console.log(tweets)

  
   
    
    const getAllTweets = async()=>{
        try {
            const authData = localStorage.getItem("auth");
        if(authData){
            var authDataToUse = JSON.parse(authData);
            const {data} = await axios.get('/tweet/getAllTweets',{
                headers:{
                    Authorization:`Bearer ${authDataToUse?.token}`
                }
            });
           if(data?.tweets){

               setAllTweets(data?.tweets)

           }
          
           
        }
            
        } catch (error) {
            console.log(error)
        }
    }

    
    


    if(tweetsFromFollowingUsers){
        console.log(tweetsFromFollowingUsers)
    }
    


    
   
   
    // ! create tweet Modal

    useEffect(()=>{
        const authData = localStorage.getItem("auth");
        if(authData){
            const parsed = JSON.parse(authData);
            setAuthDetails({...authDetails,user : parsed.user,token:parsed.token})
        }
        getAllTweets()
        getLoggedInDetails()

    },[])

    
   







    return (

        <TweetContext.Provider value={{showSingleTweet,sendDeleteRequestToBackend,sendRequestToBackendToReTweeet,fetchDetailsOfTweetToCommentOn,getSingleUserDetails,sendLikeRequest,auth,tweetToAddACommentOn,setAuthDetails,setTweetToAddACommentOn, tweetBool,setTweetBool,tweetsFromFollowingUsers,allTweets,getAllTweets,authDetails,setAuthDetails,singleUserPageDetails }}>
            {children}
        </TweetContext.Provider>
    )
}

const useTweetContext = () => useContext(TweetContext)

export { useTweetContext, TweetProvider }