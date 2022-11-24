import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import axios from "./axios";
import About from './components/about/About';
import AllAppointmentsCard from './components/card/AllAppointmentsCard';
import AllDoctorsCard from "./components/card/AllDoctorsCard";
import AllPatientsCard from './components/card/AllPatientsCard';
import PatientBillsCard from './components/card/PatientBillsCard';
import AdminDashboard from './components/dashboard/AdminDashboard';
import HomeDashboard from './components/dashboard/HomeDashboard';
import Invoice from './components/invoice/Invoice';
import Login from './components/login/Login';
import AppointmentUpdate from './components/profile/update/AppointmentUpdate';
import DoctorUpdate from './components/profile/update/DoctorUpdate';
import PatientUpdate from './components/profile/update/PatientUpdate';
import AdminRegister from './components/registration/AdminRegister';
import AppointmentRegister from './components/registration/AppointmentRegister';
import BillRegister from './components/registration/BillRegister';
import DoctorRegister from './components/registration/DoctorRegister';
import PatientRegister from './components/registration/PatientRegister';
import AdminGuard from './components/router/AdminGuard';
import AuthGuard from './components/router/AuthGuard';

function App() {
  async function logout(token) {
    await axios
      .post("/api/multi_user/logout/", {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Token ' + token,
        },
      })
      .then((response) => { // eslint-disable-line no-unused-vars
        console.log(response);
      });
  };

  const handleLogout = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('authToken');
    localStorage.removeItem('authToken');
    localStorage.removeItem("user");
    console.log("Got clicked!");
    try {
      logout(token);
      window.location.reload();
    }
    catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <Navbar expand="md">
        <Container fluid>
          <Navbar.Brand href={"/"}>Hospital Management</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar" />
          <Navbar.Collapse id="navbar">
            <Nav className="ml-auto">
              {!localStorage.getItem('authToken') && (
                <Nav.Link href={"/login"}>Login</Nav.Link>
              )}
              {localStorage.getItem('authToken') && JSON.parse(localStorage.getItem("user")).user_type === "administrator" && (
                <Nav.Link href={"/appointment_register"}>Create Appointment</Nav.Link>
              )}
              <NavDropdown
                id="nav-dropdown"
                title={localStorage.getItem("authToken") ? JSON.parse(localStorage.getItem("user")).full_name : "Anonymous"}

              >
                <NavDropdown.Item href={"/about_us"}>About Us</NavDropdown.Item>
                {localStorage.getItem('authToken') && (
                  <div>
                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={e => handleLogout(e)}>Logout</NavDropdown.Item>
                  </div>
                )}
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <main className="App">
        <Router>
          <Routes>
            <Route path="/about_us" element=<About /> />
            <Route
              path="/doctor_register"
              element={
                <AuthGuard>
                  <DoctorRegister />
                </AuthGuard>
              }
            />
            <Route
              path="/patient_register"
              element={
                <AuthGuard>
                  <PatientRegister />
                </AuthGuard>
              }
            />
            <Route
              path="/admin_register"
              element={
                <AuthGuard>
                  <AdminRegister />
                </AuthGuard>
              }
            />
            <Route
              path="/login"
              element={
                <AuthGuard>
                  <Login />
                </AuthGuard>
              }
            />
            <Route path="/" element={<HomeDashboard />} />
            <Route path="/admin_dashboard" element={<AdminGuard><AdminDashboard /></AdminGuard>} />
            <Route path="/doctors_list" element={<AdminGuard><AllDoctorsCard /></AdminGuard>} />
            <Route path="/doctor_profile" element={<AdminGuard><DoctorUpdate /></AdminGuard>} />
            <Route path="/patients_list" element={<AdminGuard><AllPatientsCard /></AdminGuard>} />
            <Route path="/patient_profile" element={<AdminGuard><PatientUpdate /></AdminGuard>} />
            <Route path="/appointment_register" element={<AdminGuard><AppointmentRegister /></AdminGuard>} />
            <Route path="/appointments_list" element={<AdminGuard><AllAppointmentsCard /></AdminGuard>} />
            <Route path="/appointment_update" element={<AdminGuard><AppointmentUpdate /></AdminGuard>} />
            <Route path="/appointment_invoice" element={<AdminGuard><BillRegister /></AdminGuard>} />
            <Route path="/patient_bills" element={<AdminGuard><PatientBillsCard /></AdminGuard>} />
            <Route path="/patient_discharge" element={<AdminGuard><Invoice /></AdminGuard>} />
          </Routes>
        </Router>
      </main>
    </div>

  );
};

export default App;