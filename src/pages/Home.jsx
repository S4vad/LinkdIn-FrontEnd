import React, { useContext } from "react";
import { Nav } from "../components/Nav";
import dp from "../assets/dp.jpeg";
import { FaPlus } from "react-icons/fa6";
import { FaCamera } from "react-icons/fa";
import { UserContext } from "../context/UserContext";
import { IoPencil } from "react-icons/io5";
import { EditProfile } from "../components/EditProfile";

export const Home = () => {
  let { userData, edit, setEdit } = useContext(UserContext);
  return (
    <div className="w-full min-h-screen bg-[#f0efe7] pt-[100px]  flex flex-col  lg:flex-row items-start  justify-center gap-[20px] px-10 ">
      {edit && <EditProfile />}
      <Nav />

      <div className="w-full lg:w-[25%] min-h-[300px] bg-white shadow-lg p-4 rounded-lg relative">
        <div className="bg-gray-300 w-full h-[100px] rounded size-[25px] text-gray-800 ">
          <img src={userData.coverImage} alt="" className="h-full w-full object-cover " />
          <FaCamera
            className="absolute right-5 top-5 cursor-pointer"
            onClick={() => setEdit(true)}
          />
        </div>

        <div className="rounded-full overflow-hidden size-[63px]  absolute top-[70px] left-[35px] cursor-pointer">
          <img src={userData.profileImage || dp} alt="dp" className="h-full w-full object-cover" />
        </div>
        <div className="absolute top-[105px] left-[85px] rounded-full bg-[#17c1ff] size-[18px] flex items-center justify-center"  onClick={()=>setEdit(true)}>
          <FaPlus className="size-[12px] cursor-pointer text-white" />
        </div>
        <div className="mt-[30px] pl-5 text-5 font-semibold text-gray-700">
          <div>{`${userData.firstName} ${userData.lastName}`}</div>
          <div className="text-5 font-semibold text-gray-700">
            {userData.headline || ""}
          </div>
          <div className="text-4 text-gray-500">{userData.location}</div>
        </div>
        <button
          className="w-full h-[40px] rounded-full border-2 border-[#2dc0ff] bg-white text-[#2dc0ff]  my-[20px] cursor-pointer flex items-center justify-center gap-2"
          onClick={() => setEdit(true)}
        >
          Edit Profile
          <IoPencil />
        </button>
      </div>
      <div className="w-full lg:w-[50%] min-h-[200px] bg-white shadow-lg"></div>
      <div className="w-full lg:w-[25%] min-h-[200px] bg-white shadow-lg"></div>
    </div>
  );
};
