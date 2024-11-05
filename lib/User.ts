import {useState, useEffect} from "react";
import Cookies from "js-cookie";
import Api from "./Api"; 
import axios from "axios";
import { AlertMessage } from "@/components/AlertMessage";

type User = {
  id: string;
  username: string;
  FullUserName: string;
  email: string;
  role: string;
  credits: number;
  email_verified: boolean;
  avatar?: string;
  identifier: string;
}

export default function useUser(){
  const [user, setUser] = useState<User | undefined>(undefined);
  const [userLoading, setUserLoading] = useState(false);
  let invalidation = Date.now();

  async function fetchUser(){
    const requestTime = Date.now();
    const token = Api.getToken();
  
    if(!token){
      setUser(undefined);
      return;
    }
  
    setUserLoading(true);

    try{
      const res = await axios.get("https://bakalari.uhlarka.cz/api/3/user",{
        headers:{
            "Authorization": `Bearer ${token}`
        }
      });

      if(requestTime < invalidation){
        setUserLoading(false);
        return;
      }

      setUserLoading(false);

      if(res.status === 200){
        setUser(res.data);
      }else{
        logout();
      }
    }catch(e){
        setUserLoading(false);
        if(e){
          logout();
        }else{
          AlertMessage("error", "Něco se pokazilo při načítání uživatele...");
        }
    }
  }

  function logout(){
    invalidation = Date.now();
    Cookies.remove("auth_token");
    setUser(undefined);
    const url = new URL("/login", window.location.origin);
    window.location.href = url.toString();
    AlertMessage("success","Byl(a) jste odhlášen(a).");
  }

  useEffect(() => {
    if(Api.getToken() !== null){
      fetchUser();
    }
  },[]);

  return{user,setUser,userLoading,fetchUser,logout}
}
