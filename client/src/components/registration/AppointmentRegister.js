import dateFormat from "dateformat";
import React, { useEffect, useRef, useState } from 'react';
import axios from '../../axios';
import AdminDashboard from "../dashboard/AdminDashboard";

const REGISTER_URL = '/api/appointments/registration/appointment/';

const AppointmentRegister = () => {

    const errRef = useRef();

    const [doctorList, setDoctorList] = useState([]);
    const [patientList, setPatientList] = useState([]);

    const [patient, setPatient] = useState("");
    const [doctor, setDoctor] = useState("");


    const [department, setDepartment] = useState('');


    const [hospital, setHospital] = useState('');

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    async function fetchDoctorList() {
        await axios
            .get("/api/multi_user/doctor_list/", {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Token ' + localStorage.getItem("authToken"),
                },
            })
            .then((response) => {
                // check if the data is populated
                setDoctorList(response.data.queryset);
            });
    };

    async function fetchPatientList() {
        await axios
            .get("/api/multi_user/patient_list/", {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Token ' + localStorage.getItem("authToken"),
                },
            })
            .then((response) => {
                // check if the data is populated
                setPatientList(response.data.queryset);
            });
    };

    useEffect(() => {
        fetchDoctorList();
    }, []);

    useEffect(() => {
        fetchPatientList();
    }, []);

    let doctorItems = doctorList.map((item) =>
        <option key={item.id} value={item.id}>{item.fullName}</option>
    );
    let patientItems = patientList.map((item) =>
        <option key={item.id} value={item.id}>{item.fullName}</option>
    );
    const handleSubmit = async (e) => {
        e.preventDefault();
        const FULL_USER_URL = `${REGISTER_URL}${patient}/${doctor}/`
        try {
            const response = await axios.post( // eslint-disable-line no-unused-vars
                FULL_USER_URL,
                JSON.stringify({ startTime: dateFormat(startDate, "yyyy-mm-ddThh:MM:ss"), endTime: dateFormat(endDate, "yyyy-mm-ddThh:MM:ss"), hospitalName: hospital, department: department }),
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            );
            setSuccess(true);
            console.log(response.data);
            //clear state and controlled inputs
            setDepartment('');
            setDoctor('');
            setPatient('');
            setDoctorList([]);
            setPatientList([]);
            setHospital('');
            setEndDate(null);
            setStartDate(null);
        } catch (err) {
            if (!err.response) {
                setErrMsg('No Server Response');
            } else {
                setErrMsg('Appoinmtent Registration Failed');
            }
            errRef.current.focus();
        }
    };

    return (
        success ? (
            <AdminDashboard />
        ) : (
            <section>
                <p
                    ref={errRef}
                    className={errMsg ? 'errmsg' : 'offscreen'}
                    aria-live="assertive"
                >
                    {errMsg}
                </p>
                <h1>Appointment Register</h1>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="doctor">
                        Doctor:
                    </label>
                    <select onChange={(e) => setDoctor(e.target.value)} autoComplete="off" required>
                        <option defaultValue disabled>
                            Select Doctor
                        </option>
                        {doctorItems}
                    </select>
                    <label htmlFor="patient">
                        Patient:
                    </label>
                    <select onChange={(e) => setPatient(e.target.value)} autoComplete="off" required>
                        <option defaultValue disabled>
                            Select Patient
                        </option>
                        {patientItems}
                    </select>

                    <label htmlFor="department">
                        Department:
                    </label>
                    <select onChange={(e) => setDepartment(e.target.value)} autoComplete="off" required>
                        <option defaultValue disabled>
                            Select Department
                        </option>
                        <option value="Dentistry">Dentistry</option>
                        <option value="Cardiology">Cardiology</option>
                        <option value="Astrology">Astrology</option>
                        <option value="Neuroanatomy">Neuroanatomy</option>
                        <option value="Ophthalmogoly">Ophthalmogoly</option>
                        <option value="Gynecology">Gynecology</option>
                    </select>

                    <label htmlFor="hospital">
                        Hospital:
                    </label>
                    <input
                        type="text"
                        id="hospital"
                        autoComplete="off"
                        onChange={(e) => setHospital(e.target.value)}
                        value={hospital}
                        required
                        aria-describedby="uidnote"
                    />
                    <label htmlFor="startDate">
                        Start of appointment:
                    </label>
                    <input
                        type="datetime-local"
                        id="startDate"
                        autoComplete="off"
                        onChange={(e) => setStartDate(e.target.value)}
                        value={startDate}
                        aria-describedby="uidnote"
                    />
                    <label htmlFor="endDate">
                        End of appointment:
                    </label>
                    <input
                        type="datetime-local"
                        id="endDate"
                        autoComplete="off"
                        onChange={(e) => setEndDate(e.target.value)}
                        value={endDate}
                        aria-describedby="uidnote"
                    />
                    <button
                        disabled={!doctor && !patient && !department && !startDate && !endDate && !hospital ? true : false}
                    >
                        Register Appointment
                    </button>
                </form>
            </section>
        )
    );
};

export default AppointmentRegister;