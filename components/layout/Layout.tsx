import React, { PropsWithChildren, useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

interface CityData {
  [key: string]: {
    [key: string]: string[];
  };
}

interface LayoutProps extends PropsWithChildren {
  selectedCity: string;
  setSelectedCity: React.Dispatch<React.SetStateAction<string>>;
  citiesList: string[];
  setCitiesList: React.Dispatch<React.SetStateAction<string[]>>;
  selectedCell: { [key: string]: string };
  setSelectedCell: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
  city_data: CityData
  clusterID:  {
    clusterID: number;
    uID: number;
  };
  setclusterID: React.Dispatch<React.SetStateAction<number>>;
  selectedVar: string;
  setSelectedVar: React.Dispatch<React.SetStateAction<string>>;
  selectedVarScale: [number, string][] | null;
  setSelectedVarScale: React.Dispatch<React.SetStateAction<string[]>>;
}

const Layout = (props: LayoutProps) => {

  return (
    <div className="grid min-h-screen grid-rows-header bg-zinc-100">
      <div className="bg-white shadow-sm z-10">
        <Navbar selectedCity={props.selectedCity} setSelectedCity={props.setSelectedCity} citiesList={props.citiesList} setCitiesList={props.setCitiesList} />
      </div>

      <div className="grid md:grid-cols-sidebar ">
        <Sidebar selectedCell={props.selectedCell} setSelectedCell={props.setSelectedCell} city_data={props.city_data} clusterID={props.clusterID} setclusterID={props.setclusterID} selectedVar={props.selectedVar} setSelectedVar={props.setSelectedVar} selectedVarScale={props.selectedVarScale} setSelectedVarScale={props.setSelectedVarScale} selectedCity={props.selectedCity} setSelectedCity={props.setSelectedCity} />
        {props.children}
      </div>
    </div>
  );
};
export default Layout;