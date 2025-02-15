import React from "react";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div>
      <div className="flex">
        <aside className="w-64 bg-gray-800 text-white p-4">Sidebar</aside>
        <main className="flex-1 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
