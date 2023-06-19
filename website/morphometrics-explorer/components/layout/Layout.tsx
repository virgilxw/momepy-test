import React, { PropsWithChildren, useState } from "react";
import Navbar from "./Navbar";
const Layout = (props: PropsWithChildren) => {
  const [showSidebar, setShowSidebar] = useState(false);
  return (
    <div className="grid min-h-screen grid-rows-header bg-zinc-100">
      <div className="bg-white shadow-sm z-10">
        <Navbar onMenuButtonClick={() => setShowSidebar((prev) => !prev)} />
      </div>

      <div className="grid md:grid-cols-sidebar ">
        <div className="shadow-md bg-zinc-50">Sidebar</div>
        {props.children}
      </div>
    </div>
  );
};
export default Layout;