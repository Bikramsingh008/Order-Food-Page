import React from "react";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  if (user && token && user.role === "admin") {
    return children;
  }

  return <Navigate to="/signin" replace />;
};


export default AdminRoute;
