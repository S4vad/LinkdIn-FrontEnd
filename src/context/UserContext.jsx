import axios from "axios";
import React, { useEffect, useState } from "react";
import { createContext } from "react";
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const result = await axios.get("/api/user/currentuser");
      console.log('the result form tcon',result)
      setUserData(result.data);
    } catch (error) {
      setUserData(null); 
      console.log("error fetching user data",error);
    }finally{
      setLoading(false)
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const value = { userData, setUserData ,loading};

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
