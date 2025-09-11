import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import { LocalStorageService } from "../../services/localStorage/localStorage";
import logo from "../../assets/Img/logo.svg";

import { CircleUser, HousePlus, LogOut, Users } from "lucide-react";

export const Header = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [admin, setAdmin] = useState(false)

  const localStorageService = new LocalStorageService();
  const userlogged = localStorageService.getLoggedUser();

  const handleLogOut = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname.startsWith(path);

    useEffect(() =>{
        if ( userlogged?.role === 'admin' ) {
            setAdmin(true)
        }
    },[userlogged])

  return (
    <div className="flex flex-col-reverse items-center justify-center w-full h-fit sm:w-fit sm:h-full text-gray-800 bg-gray-100 sm:flex-row">
      <div className="flex items-center justify-around w-full h-16 flex-shrink-0 overflow-hidden text-gray-600 bg-gray-100 shadow-lg sm:flex-col sm:pt-4 sm:w-16 sm:h-full">
        
        {/* Logo */}
        <Link
          to="/"
          className="items-center justify-center w-10 h-10 bg-purple-100 rounded-full sm:flex hover:bg-purple-200"
        >
          <img src={logo} alt="logo" />
        </Link>

        {/* New Flat */}
        <Link
          to="/new-flat"
          className="relative flex items-center justify-center w-12 h-12 rounded sm:w-full sm:rounded-none sm:mt-12 hover:text-orange-400 hover:bg-purple-100"
        >
          <HousePlus />
          {isActive("/new-flat") && (
            <div className="absolute top-0 w-2 h-3 sm:mt-0 -mt-3 bg-[#F47B3E] rounded sm:w-2 sm:h-full sm:left-0 sm:-ml-1"></div>
          )}
        </Link>

        {/* Profile */}
        <Link
          to="/profile"
          className="relative flex items-center justify-center w-12 h-12 rounded sm:w-full sm:rounded-none hover:text-orange-400 hover:bg-purple-100"
        >
          <CircleUser />
          {isActive("/profile") && (
            <div className="absolute top-0 w-2 h-3 sm:mt-0 -mt-3 bg-[#F47B3E] rounded sm:w-2 sm:h-full sm:left-0 sm:-ml-1"></div>
          )}
        </Link>

        {/* allUsers */}
        {admin && (
            <Link
                to="/allusers"
                className="relative flex items-center justify-center w-12 h-12 rounded sm:w-full sm:rounded-none hover:text-orange-400 hover:bg-purple-100"
            >
                <Users />
                {isActive("/allusers") && (
                <div className="absolute top-0 w-2 h-3 sm:mt-0 -mt-3 bg-[#F47B3E] rounded sm:w-2 sm:h-full sm:left-0 sm:-ml-1"></div>
                )}
            </Link>
        )}

        {/* Logout */}
        <button
          onClick={handleLogOut}
          className="relative flex items-center justify-center w-12 h-12 rounded sm:mt-auto sm:w-full sm:rounded-none hover:text-orange-400 hover:bg-purple-100"
        >
          <LogOut />
        </button>
      </div>
    </div>
  );
};
