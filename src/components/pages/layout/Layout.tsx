import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footers from "./Footers";

const Layout = () => {
  return (
    <>
      <div className="d-flex flex-column vh-100">
        <header className="sticky-top z-3 bg-white shadow-sm">
          <Navbar />
        </header>
        <main className="flex-grow-1 overflow-auto">
          <Outlet />
        </main>
        <footer>
          {/* <Footers /> */}
        </footer>
      </div>
    </>
  );
};

export default Layout;
