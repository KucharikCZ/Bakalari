import Cookies from "js-cookie";
import {useRouter} from "next/router";

export default function HomePage(){
  const router = useRouter();

  if(Cookies.get("auth_token")){
    router.push("/dashboard");
  }else{
    router.push("/login");
  }
}