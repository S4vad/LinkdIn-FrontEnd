import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import logo from "../assets/logo.svg"

export const Login = () => {
 let [show, setShow] = useState(false);
  let [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  let [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  let navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await axios.post("/api/auth/login", formData);
      console.log(result);
      setError("");

      setFormData({
        email: "",
        password: "",
      });
    } catch (error) {
      setError(error.response.data.message);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="w-full h-screen flex flex-col items-center justify-start ">
      <div className="p-[30px] lg:p-[35px] w-full">
        <img className="w-28 " src={logo} alt="" />
      </div>

      <form
        className="w-[90%] max-w-[400px] h-[600px] md:shadow-xl flex flex-col justify-center gap-[10px] p-[15px]"
        onSubmit={handleSubmit}
      >
        <h1 className="text-gray-800 text-[30px] font-semibold mb-[30px]">
          Sign In
        </h1>

      
        <input
          type="email"
          name="email"
          placeholder="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-[100%] h-[50px] border-2 border-gray-600 text-gray-800 text-[18px] px-[20px] py-[10px] rounded-md"
        />

        <div className="w-[100%] h-[50px] border-2 border-gray-600 text-gray-800 text-[18px] rounded-md relative">
          <input
            type={show ? "text" : "password"}
            placeholder="password"
            onChange={handleChange}
            value={formData.password}
            name="password"
            autoComplete="new-password"
            required
            className="w-full h-full border-none text-gray-800 text-[18px] px-[20px] py-[10px] rounded-md"
          />
          <span
            className="absolute right-[20px] top-[10px] text-[#24b2ff] cursor-pointer font-semibold"
            onClick={() => setShow((prev) => !prev)}
          >
            {show ? "hidden" : "show"}
          </span>
        </div>
        <p className="text-red-500 text-md">{error}</p>

        <button
          disabled={loading}
          className="w-[100%] h-[50px] rounded-full bg-[#24b2ff] mt-[40px] text-white"
        >
          {loading ? "Sign In...." : "Sign In"}
        </button>

        <p
          className="text-center cursor-pointer"
          onClick={() => navigate("/signup")}
        >
          Want to create a new account?{" "}
          <span className="text-[#2a9bd8]">Sign In</span>
        </p>
      </form>
    </div>
  );
}
