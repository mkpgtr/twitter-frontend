import axios from "axios";





const getTweetsFromFollowingUsers = async(loggedInUser)=>{


   
   try {
    const authData = localStorage.getItem("auth");
    const authDataToUse = JSON.parse(authData);

   const {data} = await axios.post(`/tweet/getAllTweets`,{loggedInUser},{
    headers:{
        Authorization:`Bearer ${authDataToUse?.token}`
    }
   })
   return data
   } catch (error) {
    console.log(error)
   }
   
}


const getLoggedInUser = async()=>{
    
   try {
    const authData = localStorage.getItem("auth");
    const authDataToUse = JSON.parse(authData);
    const {data} = await axios.get(`/user/getLoggedInUserDetails`,{
        headers:{
            Authorization:`Bearer ${authDataToUse?.token}`
        }
    })

    return data
   } catch (error) {
    console.log(error)
   }
    

}

export {getTweetsFromFollowingUsers,getLoggedInUser}