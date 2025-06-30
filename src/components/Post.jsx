import React, { useContext, useEffect, useState } from "react";
import moment from "moment";
import { BiLike } from "react-icons/bi";
import { FaRegCommentDots } from "react-icons/fa6";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import { IoSendSharp } from "react-icons/io5";
import dp from "../assets/dp.jpeg";
import { io } from "socket.io-client";
import { ConnectionButton } from "./ConnectionButton";
import { useNavigate } from "react-router-dom";

const socket = io(
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
  {
    withCredentials: true,
  }
);

export const Post = (props) => {
  const { _id, like, comments, image, description, author, createdAt } = props;

  let { userData, handleGetProfile } = useContext(UserContext);
  let [showMore, setShowMore] = useState(false);
  let [likes, setLikes] = useState(like);
  let [commentContents, setCommentContents] = useState(comments);
  let [frontEndComment, setFrontEndComment] = useState("");
  let [openComment, setOpenComment] = useState(false);
  const navigate = useNavigate();

  const handleLike = async () => {
    try {
      const response = await axios.get(`/api/post/like/${_id}`);
      if (response.status === 200) {
        setLikes(response.data.data.likes);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!frontEndComment.trim()) {
      return;
    }
    try {
      const response = await axios.post(`/api/post/comment/${_id}`, {
        content: frontEndComment,
      });
      setFrontEndComment("");
      if (response.status === 200) {
        setCommentContents(response.data.data.comments);
        console.log("hahaha", commentContents);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleProfileClick = async () => {
    const success = await handleGetProfile(author.userName);
    if (success) {
      navigate(`/profile/${author.userName}`);
    }
  };

  useEffect(() => {
    socket.on("likeUpdated", ({ postId, likes }) => {
      if (postId == _id) {
        setLikes(likes);
      }
    });

    socket.on("commentUpdated", ({ postId, comments }) => {
      if (postId == _id) {
        console.log("the comment osket", comments);
        setCommentContents(comments);
      }
    });

    return () => {
      socket.off("likeUpdated");
      socket.off("commentUpdated");
    };
  }, [_id]);

  return (
    <div className="w-full min-h-[500px] bg-white rounded-lg shadow-lg p-5 flex flex-col gap-5 ">
      <div className="flex justify-between  items-center">
        <div className="flex gap-2 justify-center items-center  ">
          <div
            className="rounded-full overflow-hidden size-[70px] "
            onClick={handleProfileClick}
          >
            <img
              src={author.profileImage || ""}
              alt="dp"
              className="w-full h-full"
            />
          </div>
          <div className="flex flex-col items-start ">
            <span className="font-semibold">
              {author.firstName} {author.lastName}
            </span>
            <span className="text-sm">{author.headline}</span>
            <span className="text-sm">{moment(createdAt).fromNow()}</span>
          </div>
        </div>

        {userData._id != author._id && <ConnectionButton userId={author._id} />}
      </div>

      {/*post content */}
      <div className="w-full px-4 text-gray-800">
        <div
          className={`text-justify transition-all duration-300 ${
            showMore ? "max-h-[none]" : "max-h-[140px] overflow-hidden"
          }`}
        >
          {description}
        </div>

        {description?.length > 200 && (
          <div
            className="text-sm text-blue-500 mt-2 cursor-pointer select-none"
            onClick={() => setShowMore((prev) => !prev)}
          >
            {showMore ? "Show less..." : "Show more..."}
          </div>
        )}

        {/* Post Image (if available) */}
        {image && (
          <div className="w-full px-4  rounded-xl overflow-hidden mt-2 ">
            <img
              src={image}
              alt="post"
              className="w-full max-h-[250px]   object-contain "
            />
          </div>
        )}
      </div>

      {/* footer section */}
      <div>
        <div className="flex justify-between pb-4 border-b-2 border-gray-300">
          <div className="flex items-center gap-2 justify-center">
            <BiLike className="text-blue-300 text-xl" />
            <span>{likes.length}</span>
          </div>
          <div className="space-x-3">
            <span>{commentContents.length}</span>
            <span>comments</span>
          </div>
        </div>
        <div className="flex items-center pt-4 justify-between w-[30%] text-lg ">
          <div className="flex items-center gap-2 justify-center ">
            <BiLike onClick={() => handleLike()} />
            <span>{likes?.includes(userData._id) ? "Liked" : "Like"}</span>
          </div>
          <div className="flex items-center gap-2 justify-center ">
            <FaRegCommentDots onClick={() => setOpenComment((prev) => !prev)} />
            <span>comment</span>
          </div>
        </div>
      </div>
      {openComment && (
        <>
          <form className="border-b-gray-300 w-full flex justify-between border-b-2 items-center p-[10px]">
            <input
              type="text"
              value={frontEndComment}
              onChange={(e) => setFrontEndComment(e.target.value)}
              placeholder="leave a comment "
              className="outline-none border-none"
            />
            <button className="" onClick={handleCommentSubmit}>
              <IoSendSharp className="size-[20px] text-blue-400" />
            </button>
          </form>
          <div className="flex flex-col gap-[10px]">
            {commentContents?.map((com) => (
              <div className="flex flex-col gap-[10px] border-b-2 p-[20px] border-b-gray-300">
                <div className="w-full flex justify-start items-center gap-4">
                  <div className="w-[40px] h-[40px] rounded-full overflow-hidden flex items-center justify-center cursor-pointer">
                    <img
                      src={com.user.profileImage || dp}
                      alt=""
                      className="h-full"
                    />
                  </div>
                  <div className="text-[16px] font-semibold">
                    {`${com.user.firstName} ${com.user.lastName}`}
                  </div>
                  <div className="text-sm">
                    ( {moment(com.createdAt).fromNow()} )
                  </div>
                </div>
                <div className="pl-[57px]">{com.content}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
