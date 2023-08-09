import React from "react";
import SSHeader from "./SSHeader";
import SSFooter from "./SSFooter";
import SSSideBar from "./SSSideBar";
import { useRouter } from "next/router";

const Layout = ({ children }) => {
  const router = useRouter();
  return (
    <div className="w-full h-full bg-[#FAFAFA] -z-1 xl:z-0">
      {router.pathname.includes("/home") ? (
        <SSSideBar>{children}</SSSideBar>
      ) : (
        <>
          <SSHeader />
          {children}
          <SSFooter />
        </>
      )}
    </div>
  );
};

export default Layout;
