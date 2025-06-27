import React, { useContext, useRef, useState } from "react";
import { Nav } from "../components/Nav";
import dp from "../assets/dp.jpeg";
import { FaPlus } from "react-icons/fa6";
import { FaCamera } from "react-icons/fa";
import { UserContext } from "../context/UserContext";
import { IoPencil } from "react-icons/io5";
import { EditProfile } from "../components/EditProfile";
import { RxCross1 } from "react-icons/rx";
import { BsImage } from "react-icons/bs";
import axios from "axios";

export const Home = () => {
  let { userData, edit, setEdit } = useContext(UserContext);
  let [frontEndImage, setFrontEndImage] = useState(null);
  let [backEndImage, setBackEndImage] = useState(null);
  let [description, setDescription] = useState("");
  let [loading, setLoading] = useState(false);
  let [showPost, setShowPost] = useState(false);

  let image = useRef();

  const handleImage = (e) => {
    let file = e.target.files[0];
    setFrontEndImage(URL.createObjectURL(file));
    setBackEndImage(file);
  };

  const handlePost = async () => {
    setLoading(true);
    try {
      let data = new FormData();
      data.append("description", description);
      if (backEndImage) {
        data.append("image", backEndImage);
      }
      console.log(data);

      const response = await axios.post("/api/post/create", data);
      if (response.status == 200) {
        setDescription("");
        setFrontEndImage(null);
        setBackEndImage(null);
        setShowPost(false);
        console.log("post created successfully!");
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#f0efe7] pt-[100px]  flex flex-col  lg:flex-row items-start  justify-center gap-[20px] px-10 relative ">
      {edit && <EditProfile />}
      <Nav />

      <div className="w-full lg:w-[25%] min-h-[300px] bg-white shadow-lg p-4 rounded-lg relative">
        <div className="bg-gray-300 w-full h-[100px] rounded size-[25px] text-gray-800 ">
          <img
            src={userData.coverImage || ""}
            alt=""
            className="h-full w-full object-cover "
          />
          <FaCamera
            className="absolute right-5 top-5 cursor-pointer text-white"
            onClick={() => setEdit(true)}
          />
        </div>

        <div className="rounded-full overflow-hidden size-[63px]  absolute top-[70px] left-[35px] cursor-pointer">
          <img
            src={userData.profileImage || dp}
            alt="dp"
            className="h-full w-full object-cover"
          />
        </div>
        <div
          className="absolute top-[105px] left-[85px] rounded-full bg-[#17c1ff] size-[18px] flex items-center justify-center"
          onClick={() => setEdit(true)}
        >
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

      {showPost && (
        <div className="w-full h-full fixed top-0 left-0 z-[100] flex items-center justify-center">
          <div className="absolute w-full h-full bg-black opacity-[0.5]"></div>
       <div className="relative w-[90%] max-w-[500px] h-[600px] bg-white shadow-lg z-[200] p-[20px] flex flex-col items-start justify-start gap-5">
            <div
              className="absolute top-[20px] right-[20px] cursor-pointer"
              onClick={() => setShowPost(false)}
            >
              <RxCross1 className="size-[20px] text-gray-800 font-bold" />
            </div>
            <div className="flex  items-center gap-6">
              <div className="rounded-full overflow-hidden size-[66px]  cursor-pointer ">
                <img
                  src={userData.profileImage || dp}
                  alt="dp"
                  className="h-full w-full object-cover "
                />
              </div>
              <div className="text-lg">{`${userData.firstName} ${userData.lastName}`}</div>
            </div>
            <textarea
              name="description"
              value={description}
              className={`w-full ${
                frontEndImage ? "h-[200px]" : "h-[550px]"
              } outline-none border-none p-3 resize-none text-[19px]`}
              placeholder="what do you want to talk about...?"
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
            {frontEndImage && (
              <img className="size-[350px] rounded-lg" src={frontEndImage || ""} />
            )}

            <div className="w-full">
              <div className="p-[15px] border-b-2 w-full ">
                <BsImage
                  className="text-gray-500 size-[25px] cursor-pointer"
                  onClick={() => image.current.click()}
                />
              </div>
              <input
                type="file"
                hidden
                accept="image/*"
                ref={image}
                onChange={handleImage}
              />

              <div className="flex justify-end">
                <button
                  className="w-[80px] h-[35px] rounded-full bg-[#24b2ff] mt-[20px] text-white cursor-pointer text-lg p-2 flex  items-center justify-center  "
                  onClick={handlePost}
                  disabled={loading}
                >
                  {loading ? "Posting...." : "Post"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="w-full lg:w-[50%] min-h-screen  bg-[#f0efe7] ">
        <div className="w-full h-[100px] bg-white shadow-lg rounded-lg  flex items-center justify-center gap-5 sm:gap-10 sm:px-10">
          <div className="rounded-full overflow-hidden size-[66px]  cursor-pointer ">
            <img
              src={userData.profileImage || dp}
              alt="dp"
              className="h-full w-full object-cover "
            />
          </div>
          <button
            className=" rounded-full h-[60%] border-2  w-[50%] sm:w-[70%] text-md sm:text-lg flex justify-start items-center px-10 hover:bg-gray-100"
            onClick={() => setShowPost(true)}
          >
            start a post
          </button>
        </div>
      </div>
      <div className="w-full lg:w-[25%] min-h-[200px] bg-white shadow-lg"></div>
    </div>
  );
};
