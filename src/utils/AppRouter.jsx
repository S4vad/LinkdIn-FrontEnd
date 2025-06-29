// AppRouter.jsx
import { useContext } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { Home } from "../pages/Home";
import { Login } from "../pages/Login";
import { SignUp } from "../pages/SignUp";
import { ScaleLoader } from "react-spinners";
import { Network } from "../components/Network";

export const AppRouter = () => {
  const { userData, loading } = useContext(UserContext);
  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <ScaleLoader color="#93c5fd" speedMultiplier={0.5} />
      </div>
    );
  }

  const router = createBrowserRouter([
    {
      path: "/",
      element: userData ? <Home /> : <Navigate to="/login" />,
    },
    {
      path: "/login",
      element: userData ? <Navigate to="/" /> : <Login />,
    },
    {
      path: "/signup",
      element: userData ? <Navigate to="/" /> : <SignUp />,
    },
    {
      path: "/network",
      element: userData ? <Network /> : <Login />,
    },
  ]);

  return <RouterProvider router={router} />;
};
