import Header from "@/app_components/Header";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div>
      <div className="grid-background"></div>

      <main className="min-h-screen w-11/12 m-auto">

        <Header />

        <Outlet />

      </main>

      <div className="p-10 text-center bg-gray-800 mt-10">
        Made with 💗 by Somenath Choudhury
      </div>

    </div>
  );
}

export default AppLayout;