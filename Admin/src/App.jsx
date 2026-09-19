import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import SideBar from "./components/SideBar";
import { Routes, Route } from "react-router-dom";
import Add from "./pages/Add";
import List from "./pages/List";
import Orders from "./pages/Orders";
import Login from "./components/Login";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const getBackendUrl = () => {
  const envUrl = import.meta.env.VITE_BACKEND_URL;

  // Detect if running in live browser production (e.g. Render, Vercel, Netlify)
  if (
    typeof window !== "undefined" &&
    window.location.hostname !== "localhost" &&
    window.location.hostname !== "127.0.0.1"
  ) {
    if (
      envUrl &&
      envUrl.startsWith("http") &&
      !envUrl.includes("localhost") &&
      !envUrl.includes("127.0.0.1")
    ) {
      return envUrl.replace(/['"]/g, "").replace(/\/+$/, "");
    }
    return window.location.origin;
  }

  if (envUrl && envUrl.trim() !== "") {
    return envUrl.replace(/['"]/g, "").replace(/\/+$/, "");
  }

  return "http://localhost:4000";
};

export const backendUrl = getBackendUrl();
export const currency = '₹';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token'):'');
  
  useEffect(() =>{
    localStorage.setItem('token', token)
  },[token])

  return (
    <div className="bg-gray-50 min-h-screen">
      <ToastContainer />
      {token === "" ? (
        <Login  setToken={setToken}/>
      ) : (
        <>
          <Navbar setToken={setToken}/>
          <hr />
          <div className="flex flex-col md:flex-row w-full">
            <SideBar />
            <div className="w-full md:w-[75%] px-4 sm:px-6 md:px-8 my-6 text-gray-600 text-base">
              <Routes>
                <Route path="/add" element={<Add setToken={token}/>} />
                <Route path="/list" element={<List setToken={token}/>} />
                <Route path="/orders" element={<Orders setToken={token}/>} />
              </Routes>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
