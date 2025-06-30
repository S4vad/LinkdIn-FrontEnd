import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const socket = io(
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
  {
    withCredentials: true,
  }
);

export const ConnectionButton = ({ userId }) => {
  let { userData, setUserData } = useContext(UserContext);
  let [status, setStatus] = useState("");
  let navigate = useNavigate();

  const handleSendConnection = async () => {
    try {
      const response = await axios.post(`/api/connection/send/${userId}`);
      setStatus("pending");

      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetStatus = async () => {
    if (!userId) return;
    try {
      const response = await axios.get(`/api/connection/status/${userId}`);
      console.log("getConnectionStatus response:", response);
      if (response) {
        setStatus(response.data.status);
      }
    } catch (error) {
      console.log("handleGetStatus error:", error);
    }
  };

  const handleRemoveConnection = async () => {
    try {
      const response = await axios.delete(`/api/connection/${userId}`);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClick = async () => {
    if (status === "disconnect") {
      await handleRemoveConnection();
    } else if (status == "received") {
      navigate("/network");
    } else {
      await handleSendConnection();
    }
  };

  useEffect(() => {
    if (!userId || !userData?._id) return;

    socket.emit("register", userData._id);
    handleGetStatus();

    socket.on("statusUpdate", ({ updatedUserId, newStatus }) => {
      if (updatedUserId === userId) {
        setStatus(newStatus);
      }
    });

    return () => {
      socket.off("statusUpdate");
    };
  }, [userId]);

  if (!userId) return null;

  return (
    <div>
      <button
        className=" rounded-full border-2 h-[45px] min-w-[100px] border-[#2dc0ff] bg-white text-[#2dc0ff] cursor-pointer flex items-center justify-center "
        onClick={handleClick}
        disabled={status == "pending"}
      >
        {status}
      </button>
    </div>
  );
};
