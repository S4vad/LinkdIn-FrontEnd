import React, { useContext, useEffect, useRef, useState } from "react";
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
import { Post } from "../components/Post";
import { useNavigate } from "react-router-dom";
import { ConnectionButton } from "../components/ConnectionButton";

export const Home = () => {
  let { userData, edit, setEdit, postData, setPostData, handleGetProfile } =
    useContext(UserContext);
  let [frontEndImage, setFrontEndImage] = useState(null);
  let [backEndImage, setBackEndImage] = useState(null);
  let [description, setDescription] = useState("");
  let [loading, setLoading] = useState(false);
  let [showAddPost, setShowAddPost] = useState(false);
  let [suggestedUser, setSuggestedUser] = useState([]);
  let navigate = useNavigate();

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
        setPostData((prev) => [response.data.data, ...prev]);
        setDescription("");
        setFrontEndImage(null);
        setBackEndImage(null);
        setShowAddPost(false);
        console.log("post created successfully!");
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestedUser = async () => {
    try {
      const response = await axios.get("/api/user/suggested-user");
      setSuggestedUser(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleProfileClick = async () => {
    const success = await handleGetProfile(userData.userName);
    if (success) {
      navigate(`/profile/${userData.userName}`);
    }
  };

  const handleClosePost = () => {
    setShowAddPost(false);
    setDescription(""); // clear text
    setFrontEndImage(null); // clear preview
    setBackEndImage(null); // clear file
  };

  useEffect(() => {
    handleSuggestedUser();
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#f0efe7] pt-[100px]  flex flex-col  lg:flex-row items-start  justify-center gap-[20px] md:px-10 relative ">
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
      

      {/* post add popup */}
      {showAddPost && (
        <div className="w-full h-full fixed top-0 left-0 z-[100] flex items-center justify-center">
          <div className="absolute w-full h-full bg-black opacity-[0.5]" onClick={()=>setShowAddPost(false)}></div>
          <div className="relative w-[90%] max-w-[500px] h-[600px] bg-white shadow-lg z-[200] p-[20px] flex flex-col items-start justify-start gap-5">
            <div
              className="absolute top-[20px] right-[20px] cursor-pointer"
              onClick={handleClosePost}
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
              } outline-none border-none p-3 resize-none `}
              placeholder="what do you want to talk about...?"
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
            {frontEndImage && (
              <div className="relative max-w-[400px] max-h-[300px] overflow-auto rounded-lg">
                {" "}
                <img
                  className="w-full h-auto object-contain"
                  src={frontEndImage || ""}
                />
                <RxCross1
                  className="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-full p-1 cursor-pointer"
                  onClick={() => setFrontEndImage(null)}
                />
              </div>
            )}

            <div className="w-full">
              <div className="pb-2 border-b-2 w-full ">
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
                  className="w-[80px] h-[35px] rounded-full bg-[#24b2ff] mt-[20px] text-white cursor-pointer  p-2 flex  items-center justify-center  "
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

      {/* posts */}
      <div className="w-full lg:w-[50%] min-h-screen  bg-[#f0efe7] space-y-5">
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
            onClick={() => setShowAddPost(true)}
          >
            start a post
          </button>
        </div>
        {postData.map((post) => (
          <Post key={post._id} {...post} />
        ))}
      </div>


      {/* suggested users */}
      {suggestedUser?.length > 0 ? (
        <div className="w-full lg:w-[25%] min-h-[100px] bg-white shadow-lg hidden lg:flex flex-col  ">
        <div className=" text-lg text-gray-500 px-4 py-3"> Suggested users</div>
          {suggestedUser.map((user) => (
            <div
              className="flex gap-5 items-center border-b-1 border-b-gray-300 p-3 hover:bg-gray-50 cursor-pointer rounded-lg"
              onClick={handleProfileClick}
              key={user._id}
            >
              <div className="rounded-full overflow-hidden size-[50px] ">
                <img
                  src={user.profileImage || dp}
                  alt="dp"
                  className="w-full h-full"
                />
              </div>
              <div className="flex flex-col justify-center">
                <span className="font-semibold">
                  {user.firstName} {user.lastName}
                </span>
                <span className="text-sm text-gray-800">{user.h8eadline}</span>
              </div>
               {userData._id != user._id && <ConnectionButton userId={user._id} />}
            </div>
          ))}
        </div>
      ):(
        <div className="text-lg p-6 text-gray-800 "> No suggested user found</div>
      )}
    </div>
  );
};
