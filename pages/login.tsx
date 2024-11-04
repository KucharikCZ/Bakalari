import {AlertMessage} from "@/components/AlertMessage";
import Api from "@/lib/Api";
import useUser from "@/lib/User";
import axios from "axios";
import Image from "next/image";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import Cookies from "js-cookie";
import Head from "next/head";

export default function Login(){
    const [username,setUsername] = useState("");
    const [password,setPassword] = useState("");
    const user = useUser();
    const router = useRouter();

    useEffect(() => {
        if(Cookies.get("auth_token")){
            router.push("/dashboard");
        }
    });
    
    async function submitLogin(e:React.FormEvent){
        e.preventDefault();

        if(username.length === 0 || password.length === 0){
            AlertMessage("error","Musíte vyplnit všechna pole!");
            return;
        }

        const res = await axios.post("https://bakalari.uhlarka.cz/api/login",{username,password,client_id: "ANDR",grant_type: "password"},{
            headers:{
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });

        if(res.status === 200 && res.data.access_token){
            Api.setToken(res.data.access_token);
            //console.log(res.data.access_token);
            AlertMessage("success",`Byl(a) jste přihlášen(a).`);
            router.push("/dashboard");
        }
    }

    return(
        <>
            <Head>
                <title>Přihlášení • Bakaláři 2</title>
            </Head>

            <div className="flex min-h-screen flex-col items-center bg-gray-100 pt-6 sm:justify-center sm:pt-0">
                <Image src="/logo.png" alt="Logo Bakalaru" width={150} height={150} className="w-[80px]"/>
                
                <div className="mt-6 w-full overflow-hidden bg-white px-6 py-4 shadow-md sm:max-w-md sm:rounded-lg">
                    <form onSubmit={submitLogin}>
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Uživatelské jméno</label>
                            <input type="text" name="username" placeholder="Uživatelské jméno" value={username} onChange={(e) => setUsername(e.target.value)} className="text-slate-700 py-2 px-4 rounded-md border-gray-300 border-[1.5px] border-solid shadow-sm mt-1 block w-full focus:outline-none focus:border-theme focus:ring-theme"/>
                        </div>
                        
                        <div className="mt-4">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Uživatelské heslo</label>
                            <input type="password" name="password" placeholder="Uživatelské heslo" value={password} onChange={(e) => setPassword(e.target.value)} className="text-slate-700 py-2 px-4 rounded-md border-gray-300 border-[1.5px] border-solid shadow-sm mt-1 block w-full focus:outline-none focus:border-theme focus:ring-theme"/>
                        </div>

                        <div className="mt-4 flex items-center justify-end">
                            <button className="inline-flex items-center rounded-md border border-transparent bg-gray-800 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition duration-150 ease-in-out select-none hover:bg-gray-700 focus:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:bg-gray-900 false ms-4">Přihlásit se</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}