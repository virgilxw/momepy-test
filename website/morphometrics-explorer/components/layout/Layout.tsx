import React, { PropsWithChildren, useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Layout = (props: PropsWithChildren) => {

  return (
    <div className="grid min-h-screen grid-rows-header bg-zinc-100">
      <div className="bg-white shadow-sm z-10">
        <Navbar />
      </div>

      <div className="grid md:grid-cols-sidebar ">
        <Sidebar selectedCell = {props.children.props.selectedCell} setSelectedCell = {props.children.props.setSelectedCell} />
        {props.children}
      </div>
    </div>
  );
};
export default Layout;