import React, { useContext, useEffect, useRef, useState } from "react";
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
  let [searchQuery, setSearchQuery] = useState("");
  let [searchData, setSearchData] = useState([]);
  let { userData, setUserData, handleGetProfile } = useContext(UserContext);
  let navigate = useNavigate();

  const searchInputRef = useRef();

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

  const handleProfileClick = async () => {
    const success = await handleGetProfile(userData.userName);
    if (success) {
      navigate(`/profile/${userData.userName}`);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        "/api/user/search/?query=" + searchQuery
      );
      setSearchData(response.data.data);
    } catch (error) {
      setSearchData([]);
      console.log(error);
    }
  };

  useEffect(() => {
    if (searchQuery) {
      handleSearch();
    }
  }, [searchQuery]);

  return (
    <div className="w-full h-[80px] bg-white flex md:justify-around justify-between px-[10px] items-center shadow-lg  top-0 left-0 z-[80] fixed">
      <div className="flex items-center justify-center gap-[10px] ">
        <img
          className="size-[50px] cursor-pointer"
          src={logo2}
          alt=""
          onClick={() => {
            setActiveSearch(false);
            navigate("/");
          }}
        />
        {!activeSearch && (
          <IoSearch
            className="size-[23px] text-gray-700 lg:hidden cursor-pointer"
            onClick={() => {
              setActiveSearch(true);
              setTimeout(() => {
                searchInputRef.current?.focus();
              }, 0); // small delay to ensure input is mounted
            }}
          />
        )}

        {searchData?.length > 0 && searchQuery.trim().length > 0 && (
          <>
            {/* Overlay for outside click */}
            <div
              className="fixed top-0 left-0 w-screen h-screen z-10"
              onClick={() => {
                setSearchData([]);
                setActiveSearch(false);
                setSearchQuery("");
                setTimeout(() => {
                  searchInputRef.current?.focus();
                }, 0); //for better ux showng cursor on input
              }}
            ></div>

            {/* Search Result Box */}
            <div className="absolute top-[90px] left-0 lg:left-[20px] w-full lg:w-[700px] bg-white min-h-[100px] shadow-lg flex flex-col gap-5 p-5 max-h-[500px] overflow-auto z-20">
              {searchData.map((search) => (
                <div
                  className="flex gap-5 items-center border-b-1 border-b-gray-300 p-3 hover:bg-gray-50 cursor-pointer rounded-lg"
                  onClick={handleProfileClick}
                  key={search._id}
                >
                  <div className="rounded-full overflow-hidden size-[50px] ">
                    <img
                      src={search.profileImage || dp}
                      alt="dp"
                      className="w-full h-full"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <span className="font-semibold">
                      {search.firstName} {search.lastName}
                    </span>
                    <span className="text-sm text-gray-800">
                      {search.headline}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            ref={searchInputRef}
          />
        </form>
      </div>

      <div className="flex items-center gap-[20px] ">
        {showPopup && (
          <>
            <div className="fixed left-0 top-0 w-full h-screen z-10" onClick={()=>setShowPopup(false)}></div>
            <div className="w-[300px] min-h-[300px] rounded-lg bg-white shadow-lg absolute top-[75px] flex flex-col items-center p-[20px] gap-[20px] right-[20px] lg:right-[100px] z-20 ">
              <div className="rounded-full overflow-hidden size-[50px]">
                <img
                  src={userData.profileImage || dp}
                  alt="dp"
                  className="w-full h-full"
                />
              </div>
              <div className="font-semibold text-md">{`${userData.firstName} ${userData.lastName}`}</div>
              <button
                className="w-full  rounded-full border-2 border-[#2dc0ff] bg-white text-[#2dc0ff] p-[5px] cursor-pointer"
                onClick={handleProfileClick}
              >
                View Profile
              </button>
              <div className="w-full h-[1px] bg-gray-500"></div>
              <div
                className="flex  items-center gap-2 justify-start w-full text-gray-600 cursor-pointer"
                onClick={() => navigate("/network")}
              >
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
          </>
        )}

        <div
          className="lg:flex flex-col items-center justify-center text-gray-600 hidden cursor-pointer"
          onClick={() => navigate("/")}
        >
          <MdHome className="size-[23px] text-gray-600" />
          <span>Home</span>
        </div>
        <div
          className="lg:flex flex-col items-center justify-center text-gray-600 hidden cursor-pointer"
          onClick={() => navigate("/network")}
        >
          <FaUserFriends className="size-[23px] text-gray-600" />
          <span>My networks</span>
        </div>
        <div
          className="flex flex-col items-center justify-center text-gray-600 cursor-pointer"
          onClick={() => navigate("/notification")}
        >
          <MdNotifications className="size-[23px] text-gray-600" />
          <span className="hidden lg:block">notifications</span>
        </div>

        <div
          className="rounded-full overflow-hidden size-[50px] cursor-pointer"
          onClick={() => setShowPopup((prev) => !prev)}
        >
          <img
            src={userData.profileImage || dp}
            alt="dp"
            className="w-full h-full"
          />
        </div>
      </div>
    </div>
  );
};
