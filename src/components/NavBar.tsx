import { Link } from "react-router-dom";

function NavBar() {
  return (
    <nav className="w-full flex-col md:flex-row flex flex-wrap gap-1 md:gap-2 items-center">
      <h1 className="text-2xl font-bold p-2 md:p-4">🧭 GeoGal</h1>
      <div className="flex gap-4 mb-4 md:mb-0">
        <Link to="/" className="block hover:text-blue-950">
          O xogo
        </Link>
        <Link to="/concellos" className="block hover:text-blue-950">
          Lista de concellos
        </Link>
      </div>
    </nav>
  );
}

export default NavBar;
