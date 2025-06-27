import React, { useContext, useState } from "react";
import logo2 from "../assets/logo2.png";
import { IoSearch } from "react-icons/io5";
import { MdHome } from "react-icons/md";
import { FaUserFriends } from "react-icons/fa";
import { MdNotifications } from "react-icons/md";
import dp from "../assets/dp.jpeg";
import { UserContext } from "../context/UserContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Nav = () => {
  let [activeSearch, setActiveSearch] = useState(false);
  let [showPopup, setShowPopup] = useState(false);
  let { userData, setUserData } = useContext(UserContext);
  let navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      const response = await axios.get("api/auth/logout");
      setUserData(null);
      navigate("/login");
      console.log(response);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="w-full h-[80px] bg-white flex md:justify-around justify-between px-[10px] items-center shadow-lg fixed top-0 left-0 z-[80]">
      <div className="flex items-center justify-center gap-[10px]">
        <img
          className="size-[50px]"
          src={logo2}
          alt=""
          onClick={() => setActiveSearch(false)}
        />
        {!activeSearch && (
          <IoSearch
            className="size-[23px] text-gray-700 lg:hidden"
            onClick={() => setActiveSearch(true)}
          />
        )}

        <form
          className={`bg-[#f0efe7] rounded-full w-[190px] lg:w-[350px] h-[40px] lg:flex items-center gap-[10px] px-[10px]  ${
            !activeSearch ? "hidden" : "flex"
          } `}
        >
          <div>
            <IoSearch className="size-[23px] text-gray-600" />
          </div>
          <input
            type="text"
            className="w-[80%] h-full bg-transparent outline-none border-0"
            placeholder="search users..."
          />
        </form>
      </div>

      <div className="flex items-center gap-[20px] relative">
        {showPopup && (
          <div className="w-[300px] min-h-[300px] rounded-lg bg-white shadow-lg absolute top-[75px] flex flex-col items-center p-[20px] gap-[20px]">
            <div className="rounded-full overflow-hidden size-[50px]">
              <img src={dp} alt="dp" className="w-full h-full" />
            </div>
            <div className="font-semibold text-md">{`${userData.firstName} ${userData.lastName}`}</div>
            <button className="w-full  rounded-full border-2 border-[#2dc0ff] bg-white text-[#2dc0ff] p-[5px] cursor-pointer">
              View Profile
            </button>
            <div className="w-full h-[1px] bg-gray-500"></div>
            <div className="flex  items-center gap-2 justify-start w-full text-gray-600 ">
              <FaUserFriends className="size-[23px] text-gray-600" />
              <span>My networks</span>
            </div>
            <button
              className="w-full  rounded-full border-2 p-[5px] border-red-400 bg-white text-red-400 cursor-pointer"
              onClick={handleSignOut}
            >
              Sign Out
            </button>
          </div>
        )}

        <div className="lg:flex flex-col items-center justify-center text-gray-600 hidden">
          <MdHome className="size-[23px] text-gray-600" />
          <span>Home</span>
        </div>
        <div className="lg:flex flex-col items-center justify-center text-gray-600 hidden">
          <FaUserFriends className="size-[23px] text-gray-600" />
          <span>My networks</span>
        </div>
        <div className="flex flex-col items-center justify-center text-gray-600 ">
          <MdNotifications className="size-[23px] text-gray-600" />
          <span className="hidden lg:block">notifications</span>
        </div>

        <div
          className="rounded-full overflow-hidden size-[50px] cursor-pointer"
          onClick={() => setShowPopup((prev) => !prev)}
        >
          <img src={dp} alt="dp" className="w-full h-full" />
        </div>
      </div>
    </div>
  );
};
