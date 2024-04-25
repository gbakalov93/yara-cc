import { Outlet } from "react-router-dom";

import { TopNav } from "@/components";

import "./MainLayout.css";

const MainLayout = () => {
  return (
    <div id="main-wrapper" className="flex-col">
      <TopNav />

      <div id="main">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;