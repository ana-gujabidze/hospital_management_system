import dateFormat from "dateformat";
import React, { useRef, useState } from 'react';
import { useLocation } from "react-router-dom";
import axios from '../../../axios';
import HomeDashboard from "../../dashboard/HomeDashboard";

const UPDATE_URL = '/api/appointments/appointment_update/';

const AppointmentUpdate = () => {
    const { state } = useLocation();

    const errRef = useRef();

    const [endTime, setEndTime] = useState('');

    const [startTime, setStartTime] = useState('');

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {

            const response = await axios.post( // eslint-disable-line no-unused-vars
                UPDATE_URL,
                JSON.stringify({ appointmentId: state.id, startTime: dateFormat(startTime, "yyyy-mm-ddThh:MM:ss"), endTime: dateFormat(endTime, "yyyy-mm-ddThh:MM:ss") }),
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Token ' + localStorage.getItem("authToken"),
                    },
                }
            );
            setSuccess(true);
            //clear state and controlled inputs
            setEndTime('');
            setStartTime('');
        } catch (err) {
            if (!err.response) {
                setErrMsg('No Server Response');
            } else {
                setErrMsg('Update Failed');
            }
            errRef.current.focus();
        }
    };

    return (
        success ? (
            <HomeDashboard />
        ) : (
            <section >
                <p
                    ref={errRef}
                    className={errMsg ? 'errmsg' : 'offscreen'}
                    aria-live="assertive"
                >
                    {errMsg}
                </p>
                <h1>Update Appointment</h1>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="patient">
                        Patient:
                    </label>
                    <input
                        type="text"
                        id="patient"
                        placeholder={state.patientName}
                        disabled="disabled"
                    />
                    <label htmlFor="doctor">
                        Doctor:
                    </label>
                    <input
                        type="text"
                        id="doctor"
                        placeholder={state.doctorName}
                        disabled="disabled"
                    />
                    <label htmlFor="hospital">
                        Hospital:
                    </label>
                    <input
                        type="text"
                        id="hospital"
                        placeholder={state.hospitalName}
                        disabled="disabled"
                    />
                    <label htmlFor="department">
                        Department:
                    </label>
                    <input
                        type="text"
                        id="department"
                        placeholder={state.department}
                        disabled="disabled"
                    />
                    <label htmlFor="startTime">
                        Start of appointment:
                    </label>
                    <input
                        type="datetime-local"
                        id="startTime"
                        autoComplete="off"
                        onChange={(e) => setStartTime(e.target.value)}
                        value={startTime}
                        aria-describedby="uidnote"
                    />
                    <label htmlFor="endTime">
                        End of appointment:
                    </label>
                    <input
                        type="datetime-local"
                        id="endTime"
                        autoComplete="off"
                        onChange={(e) => setEndTime(e.target.value)}
                        value={endTime}
                        aria-describedby="uidnote"
                    />
                    <button
                        disabled={!startTime && !endTime ? true : false}
                    >
                        Update
                    </button>
                </form>
            </section>
        )
    );
};

export default AppointmentUpdate;