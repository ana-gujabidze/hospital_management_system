import React from 'react';
import { Navigate } from 'react-router-dom';

const DoctgorGuard = ({ children }) => {
    const authToken = localStorage.getItem("authToken");
    const user = JSON.parse(localStorage.getItem("user"));
    return authToken && user.user_type === "doctor" ? children : <Navigate to="/doctor_register" />;

};

export default DoctgorGuard;