import axios from 'axios';
import {useState,createContext,useContext,useEffect} from 'react'



const AuthContext = createContext();


const AuthProvider = ({children})=>{
    const [auth,setAuth] = useState({
        user: null,
        token : ""  
    });

    axios.defaults.baseURL= 'http://localhost:5000/'
    axios.defaults.headers.common = {'Authorization': `Bearer ${auth?.token}`};

    // ! after every render of the App, this useEffect will run
    useEffect(()=>{
        // ! get the auth details from localstorage
        const data = localStorage.getItem("auth");
        if(data){
            const parsed = JSON.parse(data);
            setAuth({...auth,user : parsed.user,token:parsed.token})
        }
    },[])
    
    return (

        <AuthContext.Provider value={[auth,setAuth,]}>
            {children}
        </AuthContext.Provider>
    )
}

const useAuth = ()=> useContext(AuthContext);



export {AuthProvider,useAuth}
