import Cookies from "js-cookie";

export default class Api{
    static getToken():string | null{
        const authToken = Cookies.get("auth_token");

        if(!authToken){
            return null;
        }

        this.setToken(authToken);
        return authToken;
    }

    static setToken(token:string){
		Cookies.set("auth_token",token,{
			expires: 14,
            //sameSite: "strict",
            //secure: true,
            path: "/",
            // domain: "localhost",
		});
	}
}