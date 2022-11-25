import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminGuard = ({ children }) => {
    const authToken = localStorage.getItem("authToken");
    const user = JSON.parse(localStorage.getItem("user"));
    return authToken && user.user_type === "administrator" && user.is_staff === true ? children : <Navigate to="/admin_register" />;

};

export default AdminGuard;