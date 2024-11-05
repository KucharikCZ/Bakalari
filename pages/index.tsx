import Cookies from "js-cookie";
import {useRouter} from "next/router";
import {useEffect} from "react";

export default function HomePage(){
  const router = useRouter();

  useEffect(() => {
    if(Cookies.get("auth_token")){
      router.push("/dashboard");
    }else{
      router.push("/login");
    }
  },[Cookies,router]);
}