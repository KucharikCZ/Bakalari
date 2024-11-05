import useUser from "@/lib/User";
import {useRouter} from "next/router";
import {useEffect} from "react";
import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import {Dropdown,DropdownTrigger,DropdownMenu,DropdownItem} from "@nextui-org/dropdown";
import {Button} from "@nextui-org/button";

class MenuLink{
    display: string;
    href: string;

    constructor(display:string,href:string){
        this.display = display;
        this.href = href;
    }
}

function RenderMenuLink({link}:{link:MenuLink}){
    const router = useRouter();

    function isLinkActive(path:string):boolean{
        return router.pathname === path;
    }

    return(
        <li className="relative py-2 px-4">
            <Link href={link.href} className={`${isLinkActive(link.href)? "text-theme before:content-[''] before:block before:border-l-solid before:border-l-[5px] before:border-l-theme before:-left-[24px] before:top-0 before:h-full before:absolute before:rounded-r-lg":""}`}>{link.display}</Link>
        </li>
    );
}

function getGreeting():string{
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
        timeZone: "Europe/Prague",
        hour: "numeric",
        hour12: false
    }

    const hourString = new Intl.DateTimeFormat("cs-CZ",options).format(now);
    const hour = parseInt(hourString, 10);
    let greeting = "";

    if(hour >= 1 && hour < 10){
        greeting = "Dobré ráno";
    }else if (hour >= 10 && hour < 12){
        greeting = "Dobré dopoledne";
    }else if (hour >= 13 && hour < 17){
        greeting = "Dobré odpoledne";
    }else if (hour >= 18 && hour < 23){
        greeting = "Dobrý večer";
    }else{
        greeting = "Dobrý večer";
    }

    return greeting;
}

export default function Layout({children}:{children:React.ReactNode}){
    const user = useUser();
    const router = useRouter();
    
    useEffect(() => {
        if(!Cookies.get("auth_token")){
            router.push("/login");
        }
    },[user,router]);

    const menu = [
        new MenuLink("DashBoard","/dashboard"),
        //new MenuLink("Týdenní rozvrh","/dashboard/rozvrh/tydenni"),
        new MenuLink("Stálý rozvrh","/dashboard/rozvrh/staly"),
    ];
    
    return(
        <>
            <aside className="fixed p-3 h-[100vh] w-[250px] bg-secondary shadow-[1px_1px_10px_#00000033]">
                <div className="border-b-gray-400/60 border-b-solid border-b-[1px] pb-2">
                    <Image src="/bakalari_full.png" alt="Bakalari logo" className="w-[150px] block mx-auto mt-4" width={150} height={150}/>
                </div>

                <p className="font-bold mt-6">Hlavní nabídka</p>
                <ul className="p-3">
                    {menu.map(link => (
                        <RenderMenuLink key={link.href} link={link}/>
                    ))}
                </ul>
            </aside>

            <main className="lg:ml-[250px]">
                <nav className="bg-secondary shadow-[1px_1px_10px_#00000033] w-full z-[99] py-2 px-6">
                    <div className="flex justify-end">
                        <Dropdown>
                            <DropdownTrigger>
                                <Button className="flex py-6 px-8">
                                    <div className="flex gap-2">
                                        <img src={`https://avatar.iran.liara.run/username?username=${user.user?.FullUserName}`} alt={user.user?.FullUserName} className="block w-[35px]"/>
                                        <p className="my-auto">{user.user?.FullUserName}</p>
                                    </div>
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu>
                                <DropdownItem key="logout" onClick={() => user.logout()} className="text-danger" color="danger">Odhlásit se</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                </nav>
                <div className="bg-gradient-to-r from-sky-400 to-purple-400 h-[15rem] flex justify-center">
                    <div className="m-auto">
                        <h1 className="text-center text-white text-3xl">
                            {getGreeting()}
                        </h1>
                    </div>
                </div>

                {children}
            </main>
        </>
    );
}