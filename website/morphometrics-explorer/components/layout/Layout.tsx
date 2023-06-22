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
        <Sidebar selectedCell = {props.selectedCell} setSelectedCell = {props.setSelectedCell} city_data = {props.city_data}/>
        {props.children}
      </div>
    </div>
  );
};
export default Layout;