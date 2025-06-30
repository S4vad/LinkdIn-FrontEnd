import axios from "axios";
import React, { useEffect, useState } from "react";
import { createContext } from "react";
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState(false);
  const [postData, setPostData] = useState([]);
  const [profileData, setProfileData] = useState([]);

  const fetchData = async () => {
    try {
      const result = await axios.get("/api/user/currentuser");
      setUserData(result.data);
    
    } catch (error) {
      setUserData(null);
      console.log("error fetching user data", error);
    } finally {
      setLoading(false);
    }
  };

  const getPost = async () => {
    try {
      const response = await axios("/api/post/getpost");
      if (response.status === 200) {
        setPostData(response.data.data);
      }
    } catch (error) {
      console.log("error fetching posts", error.message);
    }
  };

  const handleGetProfile = async (userName) => {
    try {
      const result = await axios.get(`/api/user/profile/${userName}`);
      setProfileData(result.data);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  useEffect(() => {
    fetchData();
    getPost();
  }, []);

  const value = {
    userData,
    setUserData,
    loading,
    edit,
    setEdit,
    postData,
    setPostData,
    profileData,
    setProfileData,
    handleGetProfile
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
