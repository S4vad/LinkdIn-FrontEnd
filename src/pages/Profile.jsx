import React, { useContext, useEffect, useState } from "react";
import { Nav } from "../components/Nav";
import { UserContext } from "../context/UserContext";
import { FaPlus } from "react-icons/fa6";
import { FaCamera } from "react-icons/fa";
import { IoPencil } from "react-icons/io5";
import { EditProfile } from "../components/EditProfile";
import dp from "../assets/dp.jpeg";
import { Post } from "../components/Post";
import { ConnectionButton } from "../components/ConnectionButton";
import { ScaleLoader } from "react-spinners";

export const Profile = () => {
  const { setEdit, edit, postData, profileData, userData, handleGetProfile } =
    useContext(UserContext);
  let [profilePost, setProfilePost] = useState([]);
  const [loading, setLoading] = useState(false);


  

  useEffect(() => {
    setProfilePost(
      postData.filter((post) => post.author._id === profileData._id)
    );
  }, [postData, profileData]);
   

  // for handling refresh of page
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!profileData?._id) {
        try {
          setLoading(true);
          await handleGetProfile(profileData.userName || userData.userName);
        } catch (error) {
          console.error("Error fetching profile data:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchProfileData();
  }, []);





  if (loading || !profileData?._id) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <ScaleLoader color="#93c5fd" speedMultiplier={0.5} />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#f0efe7] flex flex-col items-center py-[100px] ">
      <Nav />
      {edit && <EditProfile />}
      <div className="w-full max-w-[900px] min-h-[100vh-10vh] gap-[10px] flex flex-col ">
        <div className="relative bg-white pb-[40px] shadow-lg">
          <div className="bg-gray-300 w-full h-[180px] rounded size-[25px] text-gray-800 ">
            <img
              src={profileData.coverImage || dp}
              alt=""
              className="h-full w-full object-cover "
            />
            <FaCamera
              className="absolute right-5 top-5 cursor-pointer text-white"
              onClick={() => setEdit(true)}
            />
          </div>

          <div className="rounded-full overflow-hidden size-[93px]  absolute top-[123px] left-[35px] cursor-pointer">
            <img
              src={profileData.profileImage || dp}
              alt="dp"
              className="h-full w-full object-cover"
            />
          </div>
          <div
            className="absolute top-[175px] left-[107px] rounded-full bg-[#17c1ff] size-[22px] flex items-center justify-center"
            onClick={() => setEdit(true)}
          >
            <FaPlus className="size-[16px] cursor-pointer text-white" />
          </div>
          <div className="mt-[50px] pl-10 text-5 font-semibold text-gray-700">
            <div>{`${profileData.firstName} ${profileData.lastName}`}</div>
            <div className="text-5 font-semibold text-gray-700">
              {profileData.headline || ""}
            </div>
            <div className="text-4 text-gray-500">{profileData.location}</div>
            <div className="text-4 text-gray-500">
              {" "}
              {profileData?.connections?.length || 0} connections
            </div>
          </div>
          {profileData._id === userData._id && (
            <button
              className="min-w-[150px] my-5 h-[40px] mx-9 rounded-full border-2 border-[#2dc0ff] bg-white text-[#2dc0ff]   cursor-pointer flex items-center justify-center gap-2"
              onClick={() => setEdit(true)}
            >
              Edit Profile
              <IoPencil />
            </button>
          )}
          {profileData._id !== userData._id && (
            <div className="ml-9 mt-5">
              <ConnectionButton userId={profileData._id} />
            </div>
          )}
        </div>

        {/* //post */}
        <div className="w-full h-[100px] text-gray-600 font-semibold p-5 text-6 flex items-center shadow-lg rounded-lg bg-white">
          {`Post ${profilePost?.length}`}
        </div>
        {profilePost?.map((post) => (
          <Post key={post._id} {...post} />
        ))}

        {/* //skills */}
        {profileData.skills?.length > 0 && (
          <div className="relative w-full shadow-lg rounded-lg bg-white p-7">
            <div className="text-gray-600 font-semibold text-6 mb-9">
              {`Skills (${profileData.skills.length})`}
            </div>
            <div className="flex flex-wrap gap-2">
              {profileData.skills.map((skill, index) => (
                <div
                  key={index}
                  className="px-5 py-2 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {skill}
                </div>
              ))}
            </div>
            {profileData._id === userData._id && (
              <button
                className="absolute top-3 right-3"
                onClick={() => setEdit(true)}
              >
                <FaPlus className="text-xl cursor-pointer text-gray-400 hover:text-gray-800 " />
              </button>
            )}
          </div>
        )}

        {/* //Education */}
        {profileData.education?.length > 0 && (
          <div className="relative w-full  f;shadow-lg rounded-lg bg-white p-7">
            <div className="text-gray-600 font-semibold text-6 mb-3">
              {`Education (${profileData.education.length})`}
            </div>
            <div className="flex flex-col items-start gap-5 ">
              {profileData.education.map((edu) => (
                <div
                  key={edu._id}
                  className=" py-5  text-gray-800 text-md flex flex-col gap-2 border-b-1 border-b-gray-400  "
                >
                  <span>
                    Collage:{" "}
                    <span className="text-gray-500">{edu.collage}</span>
                  </span>
                  <span>Degree : {edu.degree}</span>
                  <span>field of study: {edu.fieldOfStudy}</span>
                </div>
              ))}
            </div>
            {profileData._id === userData._id && (
              <button
                className="absolute top-3 right-3"
                onClick={() => setEdit(true)}
              >
                <FaPlus className="text-xl cursor-pointer text-gray-400 hover:text-gray-800 " />
              </button>
            )}
          </div>
        )}

        {/* //Experience */}
        {profileData.experience?.length > 0 && (
          <div className="relative w-full  f;shadow-lg rounded-lg bg-white p-7">
            <div className="text-gray-600 font-semibold text-6 mb-3">
              {`Experience (${profileData.experience.length})`}
            </div>
            <div className="flex flex-col items-start gap-5 ">
              {profileData.experience.map((exp) => (
                <div
                  key={exp._id}
                  className=" py-5  text-gray-800 text-md flex flex-col gap-2 border-b-1 border-b-gray-400  "
                >
                  <span>
                    Title: <span className="text-gray-500">{exp.title}</span>
                  </span>
                  <span>Company : {exp.company}</span>
                  <span>Description: {exp.desciption}</span>
                </div>
              ))}
            </div>
            {profileData._id === userData._id && (
              <button
                className="absolute top-3 right-3"
                onClick={() => setEdit(true)}
              >
                <FaPlus className="text-xl cursor-pointer text-gray-400 hover:text-gray-800 " />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
