import React, { useState } from "react";
import logo2 from "../assets/logo2.png";
import { IoSearch } from "react-icons/io5";
import { MdHome } from "react-icons/md";
import { FaUserFriends } from "react-icons/fa";
import { MdNotifications } from "react-icons/md";
import dp from "../assets/dp.jpeg";

export const Nav = () => {
  let [activeSearch, setActiveSearch] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div className="w-full h-[80px] bg-white flex md:justify-around justify-between px-[10px] items-center shadow-lg fixed top-0">
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
          <div className="w-[300px] h-[300px] rounded-lg bg-white shadow-lg absolute top-[75px] flex flex-col items-center p-[20px] gap-[20px]">
            <div className="rounded-full overflow-hidden size-[50px]">
              <img src={dp} alt="dp" className="w-full h-full" />
            </div>
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
