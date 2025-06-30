import React, { useEffect, useState } from "react";
import { Nav } from "./Nav";
import axios from "axios";
import dp from "../assets/dp.jpeg";
import { FaRegCheckCircle } from "react-icons/fa";
import { RxCrossCircled } from "react-icons/rx";
import { io } from "socket.io-client";

const socket = io(
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
  {
    withCredentials: true,
  }
);

export const Network = () => {
  let [connections, setConnections] = useState([]);
  const handleGetRequests = async () => {
    try {
      const response = await axios.get("/api/connection/requests");
      console.log(response.data.data);
      setConnections(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAcceptConnection = async (acceptId) => {
    try {
      let response = await axios.patch(`/api/connection/${acceptId}/accept`);
      setConnections(connections.filter((con) => con._id !== acceptId));
    } catch (error) {
      console.log(error);
    }
  };

  const handleRejectConnection = async (rejectId) => {
    try {
      let response = await axios.patch(`/api/connection/${rejectId}/reject`);
      setConnections(connections.filter((con) => con._id !== rejectId));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetRequests();
  }, []);
  return (
    <div className="w-full h-screen bg-[#f0efe7] pt-[100px] flex flex-col  items-center gap-3">
      <Nav />
      <div className="w-full h-[100px] bg-white flex items-center p-3 text-5 rounded-lg shadow-lg text-gray-600">
        Invitations {connections.length}
      </div>
      {connections.length > 0 && (
        <div className="w-[90%] shadow-lg rounded-lg flex flex-col gap-10 min-h-[100px] bg-white max-w-[900px] ">
          {connections.map((connection, index) => (
            <div className="w-full flex items-center justify-between  px-10 h-full  ">
              <div className="w-full flex gap-4 items-center   ">
                <div
                  key={index}
                  className="rounded-full overflow-hidden size-[60px] cursor-pointer"
                >
                  <img
                    src={connection.sender.profileImage || dp}
                    alt="dp"
                    className="w-full h-full"
                  />
                </div>
                <div className="text-5 font-semibold text-gray-700">
                  {connection.sender.firstName} {connection.sender.lastName}
                </div>
              </div>
              <div className="flex items-center gap-5">
                <button
                  className="text-[#18c5ff] font-semibold"
                  onClick={() => handleAcceptConnection(connection._id)}
                >
                  <FaRegCheckCircle className="size-7" />
                </button>
                <button
                  className="text-[#ff4218] font-semibold "
                  onClick={() => handleRejectConnection(connection._id)}
                >
                  <RxCrossCircled className="size-7" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
