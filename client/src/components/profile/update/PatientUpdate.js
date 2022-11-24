import dateFormat from "dateformat";
import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from "react-router-dom";
import axios from '../../../axios';
import HomeDashboard from "../../dashboard/HomeDashboard";

const UPDATE_URL = '/api/multi_user/patient_update/';
const USER_URL = '/api/multi_user/specific_user/'

const PatientUpdate = () => {
    const { state } = useLocation();

    const errRef = useRef();

    const [symptoms, setSymptoms] = useState('');

    const [daysSpent, setDaysSpent] = useState(0);

    const [releaseDate, setReleaseDate] = useState('');

    const [mobile, setMobile] = useState('');

    const [disease, setDisease] = useState('');

    const [user, setUser] = useState({});

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    const getUser = async () => {
        const FULL_USER_URL = `${USER_URL}${state.patientId}/`
        const userResponse = await axios.get(
            FULL_USER_URL,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Token ' + localStorage.getItem("authToken"),
                },
            }
        );
        setUser(userResponse.data.user);
    }

    useEffect(() => {
        getUser();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {

            const updateResponse = await axios.post( // eslint-disable-line no-unused-vars
                UPDATE_URL,
                JSON.stringify({ patientId: state.id, symptoms: symptoms, disease: disease, mobile: mobile, daysSpent: daysSpent, releaseDate: dateFormat(releaseDate, "yyyy-mm-ddThh:MM:ss") }),
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Token ' + localStorage.getItem("authToken"),
                    },
                }
            );
            setSuccess(true);
            //clear state and controlled inputs
            setDisease('');
            setSymptoms('');
            setMobile('');
            setDaysSpent(0);
            setReleaseDate('');
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
                <h1>Update Doctor Profile</h1>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="username">
                        Username:
                    </label>
                    <input
                        type="text"
                        id="username"
                        placeholder={user.username}
                        disabled="disabled"
                    />
                    <label htmlFor="email">
                        Email address:
                    </label>
                    <input
                        type="text"
                        id="email"
                        placeholder={user.email}
                        disabled="disabled"
                    />
                    <label htmlFor="firstName">
                        First Name:
                    </label>
                    <input
                        type="text"
                        id="firstName"
                        placeholder={user.firstName}
                        disabled="disabled"
                    />
                    <label htmlFor="lastName">
                        Last Name:
                    </label>
                    <input
                        type="text"
                        id="lastName"
                        placeholder={user.lastName}
                        disabled="disabled"
                    />
                    <label htmlFor="symptoms">
                        Symptoms:
                    </label>
                    <input
                        type="text"
                        id="symptoms"
                        autoComplete="off"
                        onChange={(e) => setSymptoms(e.target.value)}
                        value={symptoms}
                        aria-describedby="uidnote"
                    />
                    <label htmlFor="daysSpent">
                        Number of days spent:
                    </label>
                    <input
                        type="number"
                        id="daysSpent"
                        autoComplete="off"
                        onChange={(e) => setDaysSpent(e.target.value)}
                        value={daysSpent}
                        aria-describedby="uidnote"
                    />
                    <label htmlFor="releaseDate">
                        Date of release:
                    </label>
                    <input
                        type="datetime-local"
                        id="releaseDate"
                        autoComplete="off"
                        onChange={(e) => setReleaseDate(e.target.value)}
                        value={releaseDate}
                        aria-describedby="uidnote"
                    />
                    <label htmlFor="address">
                        Address:
                    </label>
                    <input
                        type="text"
                        id="address"
                        autoComplete="off"
                        onChange={(e) => setDisease(e.target.value)}
                        value={disease}
                        aria-describedby="uidnote"
                    />

                    <label htmlFor="mobile">
                        Phone Number:
                    </label>
                    <input
                        type="text"
                        id="mobile"
                        autoComplete="off"
                        onChange={(e) => setMobile(e.target.value)}
                        value={mobile}
                        aria-describedby="uidnote"
                    />

                    <button
                        disabled={!disease && !mobile && !symptoms && !daysSpent && !releaseDate ? true : false}
                    >
                        Update
                    </button>
                </form>
            </section>
        )
    );
};

export default PatientUpdate;