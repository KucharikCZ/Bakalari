import Layout from "@/components/Layout";
import useUser from "@/lib/User";
import Head from "next/head";

export default function DashBoardMainPage(){
    const user = useUser();

    return(
        <Layout>
            <Head>
                <title>DashBoard - Bakaláři 2</title>
            </Head>

            {/*<button onClick={() => user.logout()}>Odhlásit se</button>

            <br/>

            {user.user?.FullUserName}*/}
        </Layout>
    );
}