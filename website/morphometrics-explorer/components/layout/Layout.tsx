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
        <Sidebar selectedCell = {props.selectedCell} setSelectedCell = {props.setSelectedCell} city_data = {props.city_data} clusterID = {props.clusterID} setclusterID = {props.setclusterID} selectedVar={props.selectedVar} setSelectedVar={props.setSelectedVar} selectedVarScale={props.selectedVarScale} setSelectedVarScale={props.setSelectedVarScale} selectedCity={props.selectedCity} setSelectedCity={props.setSelectedCity} />
        {props.children}
      </div>
    </div>
  );
};
export default Layout;