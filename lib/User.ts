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

  const fetchUser = async () => {
    const requestTime = Date.now();
    const token = Api.getToken();
  
    if(!token){
      setUser(undefined);
      return;
    }
  
    setUserLoading(true);
    const res = await axios.get("https://bakalari.uhlarka.cz/api/3/user", {
      headers: {
        "Authorization": `Bearer ${Api.getToken()}`
      }
    });
  
    if(requestTime < invalidation){
      setUserLoading(false);
      return;
    }
  
    setUserLoading(false);
  
    if(res.status !== 200){
      setUser(undefined);
      AlertMessage("error","Nepodařilo se načíst uživatele...");
      return;
    }
  
    setUser(res.data);
  }

  const logout = () => {
    invalidation = Date.now();
    Cookies.remove("auth_token");
    setUser(undefined);
    new URL("/login", window.location.origin);
    AlertMessage("success","Byl(a) jste odhlášen(a).");
  }

  useEffect(() => {
    if(Api.getToken() !== null){
      fetchUser();
    }
  },[]);

  return {user,setUser,userLoading,fetchUser,logout}
}
