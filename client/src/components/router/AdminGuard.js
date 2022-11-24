import React from 'react';
import { Navigate } from 'react-router-dom';

const AuthGuard = ({ children }) => {
    const authToken = localStorage.getItem("authToken");
    const user = JSON.parse(localStorage.getItem("user"));
    return authToken && user.user_type === "administrator" ? children : <Navigate to="/" />;

};

export default AuthGuard;