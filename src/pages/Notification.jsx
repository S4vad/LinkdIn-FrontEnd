import React, { useEffect, useState } from "react";
import { Nav } from "../components/Nav";
import axios from "axios";
import dp from "../assets/dp.jpeg";
import { RxCross1 } from "react-icons/rx";
import moment from "moment";
const Notification = () => {
  const [notifications, setNotification] = useState([]);

  const handleGetNotification = async () => {
    try {
      const response = await axios.get("/api/notification/");
      setNotification(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleMessage = (type) => {
    const messages = {
      like: "liked your post",
      comment: "commented on your post",
      connectionAccepted: "accepted your connection request",
      default: "sent you a notification",
    };

    return messages[type] || messages.default;
  };

  const deleteNotification = async (id) => {
    try {
      await axios.delete("/api/notification/delete/" + id);
      setNotification((prev) =>
        prev.filter((notification) => notification._id != id)
      );
    } catch (error) {
      console.log(error);
    }
  };

  const clearAllNotifications = async () => {
    try {
      await axios.delete("/api/notification/clear");
      setNotification([]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetNotification();
  }, []);
  return (
    <div className="w-full min-h-screen pb-50 bg-[#f0efe7] pt-[100px] flex flex-col  items-center gap-3">
      <Nav />
      <div className="w-[90%] max-w-[900px] h-[100px] bg-white flex items-center px-10 text-5 rounded-lg shadow-lg text-gray-600 lg:text-xl">
        Notifications {notifications.length}
      </div>
      {notifications.length > 0 ? (
        <div className="w-[90%] shadow-lg rounded-lg flex flex-col gap-4 min-h-[100px] bg-white max-w-[900px] pt-2">
          <div className="flex justify-end p-2 border-b-1 border-gray-200 ">
            <button
              className=" px-4 py-2  border-red-400 text-red-400 border-1 rounded-full hover:bg-gray-100"
              onClick={clearAllNotifications}
            >
              Clear All
            </button>
          </div>
          {notifications.map((notification, index) => (
            <div
              className="w-full flex  flex-col  justify-center  px-10 h-full border-b-1 py-5 border-b-gray-200 relative "
              key={notification._id}
            >
              <div className="w-full flex gap-4  ">
                <div
                  key={index}
                  className="rounded-full overflow-hidden size-[45px] cursor-pointer"
                >
                  <img
                    src={notification.relatedUser.profileImage || dp}
                    alt="dp"
                    className="w-full h-full"
                  />
                </div>
                <div className=" font-semibold  text-gray-700">
                  {notification.relatedUser.firstName}{" "}
                  {notification.relatedUser.lastName}
                </div>
                <div className="  text-gray-700 text-md md:text-lg">
                  {handleMessage(notification.type)}
                </div>
              </div>
              <div>
                {notification?.relatedPost && (
                  <div className="flex items-center gap-3 md:ml-[80px] w-full h-[100px] overflow-hiddern">
                    {notification.relatedPost.image && (
                      <div className="w-[100px] h-[80px] overflow-hidden">
                        <img
                          src={notification.relatedPost.image }
                          alt="related post"
                          className="h-full w-full object-contain"
                        />
                      </div>
                    )}

                    <div className="md:w-[420px] h-[80px] w-full sm:w-[240px] overflow-hidden text-sm">
                      {notification.relatedPost.description}.....
                    </div>
                  </div>
                )}
              </div>
              <div
                className="absolute top-3 right-3"
                onClick={() => deleteNotification(notification._id)}
              >
                <RxCross1 />
              </div>
              <div className="absolute bottom-3 right-3 text-sm">
                {moment(notification.createdAt).isSame(moment(), "day")
                  ? moment(notification.createdAt).format("h:mm a")
                  : moment(notification.createdAt).format(
                      "MMMM Do YYYY, h:mm a"
                    )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-xl text-gray-800 p-8 font-semibold">
          No notification found!
        </div>
      )}
    </div>
  );
};

export default Notification;
