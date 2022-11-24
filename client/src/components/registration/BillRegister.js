import React, { useRef, useState } from 'react';
import { useLocation } from "react-router-dom";
import axios from '../../axios';
import AllPatientsCard from '../card/AllPatientsCard';


const REGISTER_URL = '/api/bills/registration/bill/';

const BillRegister = () => {
    const { state } = useLocation();

    const errRef = useRef();

    const [roomCharge, setRoomCharge] = useState('');
    const [doctorFee, setDoctorFee] = useState('');


    const [medicineCost, setMedicineCost] = useState('');
    const [otherCharge, setOtherCharge] = useState('');

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const FULL_BILL_URL = `${REGISTER_URL}${state.id}/`
        try {
            const response = await axios.post( // eslint-disable-line no-unused-vars
                FULL_BILL_URL,
                JSON.stringify({ medicineCost: medicineCost, otherCharge: otherCharge, roomCharge: roomCharge, doctorFee: doctorFee }),
                {
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Token ' + localStorage.getItem("authToken"), },
                }
            );
            setSuccess(true);
            console.log(response.data);
            //clear state and controlled inputs
            setDoctorFee('');
            setRoomCharge('');
            setOtherCharge('');
            setMedicineCost('');
        } catch (err) {
            if (!err.response) {
                setErrMsg('No Server Response');
            } else {
                setErrMsg('Bill Submition Failed');
            }
            errRef.current.focus();
        }
    };

    return (
        success ? (
            <AllPatientsCard />
        ) : (
            <section>
                <p
                    ref={errRef}
                    className={errMsg ? 'errmsg' : 'offscreen'}
                    aria-live="assertive"
                >
                    {errMsg}
                </p>
                <h1>Bill Submittion</h1>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="doctor">
                        Doctor:
                    </label>
                    <input
                        type="text"
                        id="doctor"
                        placeholder={state.doctorName}
                        disabled="disabled"
                    />
                    <label htmlFor="patient">
                        Patient:
                    </label>
                    <input
                        type="text"
                        id="patient"
                        placeholder={state.patientName}
                        disabled="disabled"
                    />

                    <label htmlFor="doctorFee">
                        Doctor Fee:
                    </label>
                    <input
                        type="text"
                        id="doctorFee"
                        autoComplete="off"
                        onChange={(e) => setDoctorFee(e.target.value)}
                        value={doctorFee}
                        required
                        aria-describedby="uidnote"
                    />

                    <label htmlFor="roomCharge">
                        Room Charge:
                    </label>
                    <input
                        type="text"
                        id="roomCharge"
                        autoComplete="off"
                        onChange={(e) => setRoomCharge(e.target.value)}
                        value={roomCharge}
                        required
                        aria-describedby="uidnote"
                    />
                    <label htmlFor="medicineCost">
                        Medicine Cost:
                    </label>
                    <input
                        type="text"
                        id="medicineCost"
                        autoComplete="off"
                        onChange={(e) => setMedicineCost(e.target.value)}
                        value={medicineCost}
                        aria-describedby="uidnote"
                    />
                    <label htmlFor="otherCharge">
                        Other Charge:
                    </label>
                    <input
                        type="text"
                        id="otherCharge"
                        autoComplete="off"
                        onChange={(e) => setOtherCharge(e.target.value)}
                        value={otherCharge}
                        aria-describedby="uidnote"
                    />
                    <button
                        disabled={!medicineCost && !otherCharge && !roomCharge && !doctorFee ? true : false}
                    >
                        Submit
                    </button>
                </form>
            </section>
        )
    );
};

export default BillRegister;