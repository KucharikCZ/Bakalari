import "@/styles/main.scss";
import type { AppProps } from "next/app";
import {AnimatePresence, motion} from "framer-motion";

export default function App({Component,pageProps,router}:AppProps){
  return(
    <AnimatePresence mode="wait">
      <motion.div
        key={router.route}
        initial={{
          opacity: 0 
        }}
        animate={{
          opacity: 1 
        }}
        exit={{ 
          opacity: 0 
        }}
        transition={{ 
          duration: 0.75 
        }}
      >
        <Component {...pageProps}/>
      </motion.div>
    </AnimatePresence>
  );
}
