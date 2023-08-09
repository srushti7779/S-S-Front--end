import Loading from "@/components/Loading";
import SSModal from "@/components/form/SSModal";
import Layout from "@/components/layouts/Layout";
import { store } from "@/redux/store";
import "@/styles/globals.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Router, useRouter } from "next/router";
import { useState } from "react";
import { Toaster } from "react-hot-toast";
import { Provider, useDispatch } from "react-redux";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  Router.events.on("routeChangeStart", () => setIsLoading(true));
  Router.events.on("routeChangeComplete", () => setIsLoading(false));
  return (
    <GoogleOAuthProvider clientId="277059566822-bhavsugv21mrv1no82ke0kf2m971thec.apps.googleusercontent.com">
      <Provider store={store}>
        <Toaster />
        {isLoading && (
          <SSModal isOpen={true} isLoader onClose={() => {}}>
            <div className="absolute top-0 left-0 flex bg-[#00000090] backdrop-blur-sm justify-center items-center w-full opacity-95 h-screen">
              <Loading width="w-[100px]" height="h-[100px]" className="" />
            </div>
          </SSModal>
        )}
        {router.pathname === "/completion" || router.pathname === "/cancle" ? (
          <Component {...pageProps} />
        ) : (
          <Layout>
            <Component {...pageProps} />
          </Layout>
        )}
      </Provider>
    </GoogleOAuthProvider>
  );
}
