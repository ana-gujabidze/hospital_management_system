import React from 'react';
import { Navigate } from 'react-router-dom';

const PatientGuard = ({ children }) => {
    const authToken = localStorage.getItem("authToken");
    const user = JSON.parse(localStorage.getItem("user"));
    return authToken && user.user_type === "patient" ? children : <Navigate to="/patient_register" />;

};

export default PatientGuard;