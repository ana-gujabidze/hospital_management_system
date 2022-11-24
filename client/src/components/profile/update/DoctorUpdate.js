import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from "react-router-dom";
import axios from '../../../axios';
import HomeDashboard from "../../dashboard/HomeDashboard";

const UPDATE_URL = '/api/multi_user/doctor_update/';
const USER_URL = '/api/multi_user/specific_user/'

const DoctorUpdate = () => {
    const { state } = useLocation();

    const errRef = useRef();

    const [department, setDepartment] = useState('');

    const [mobile, setMobile] = useState('');

    const [address, setAddress] = useState('');

    const [user, setUser] = useState({});

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    const getUser = async () => {
        const FULL_USER_URL = `${USER_URL}${state.doctorId}/`
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
                JSON.stringify({ doctorId: state.id, department: department, address: address, mobile: mobile }),
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Token ' + localStorage.getItem("authToken"),
                    },
                }
            );
            setSuccess(true);
            console.log(updateResponse.data);
            //clear state and controlled inputs
            setAddress('');
            setDepartment('');
            setMobile('');
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
                    <label htmlFor="department">
                        Department:
                    </label>
                    <select onChange={(e) => setDepartment(e.target.value)} autoComplete="off">
                        <option defaultValue disabled>
                            Select Department
                        </option>
                        <option value="dentistry">Dentistry</option>
                        <option value="cardiology">Cardiology</option>
                        <option value="astrology">Astrology</option>
                        <option value="neuroanatomy">Neuroanatomy</option>
                        <option value="ophthalmogoly">Ophthalmogoly</option>
                        <option value="gynecology">Gynecology</option>
                    </select>

                    <label htmlFor="address">
                        Address:
                    </label>
                    <input
                        type="text"
                        id="address"
                        autoComplete="off"
                        onChange={(e) => setAddress(e.target.value)}
                        value={address}
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
                        disabled={!address && !mobile && !department ? true : false}
                    >
                        Update
                    </button>
                </form>
            </section>
        )
    );
};

export default DoctorUpdate;