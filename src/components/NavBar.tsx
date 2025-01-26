import { Link } from "react-router-dom";

function NavBar() {
  return (
    <nav className="w-full flex-row flex flex-wrap gap-2 p-2 justify-between lg:justify-start lg:gap-4 lg:p-4 items-center align-bottom">
      <Link to="/" className="text-2xl font-bold">
        🧭 GeoGal
      </Link>
      <Link to={"/"} className="text-lg block hover:text-blue-950">
        Concellos
      </Link>
    </nav>
  );
}

export default NavBar;
