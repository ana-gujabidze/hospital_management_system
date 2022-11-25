import {
    faCheck, faInfoCircle, faTimes
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useRef, useState } from 'react';
import axios from '../../axios';
import Login from "../login/Login";

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const REGISTER_URL = '/api/multi_user/registration/doctor/';

const DoctorRegister = () => {

    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [validName, setValidName] = useState(false);
    const [userFocus, setUserFocus] = useState(false);

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [email, setEmail] = useState('');

    const [department, setDepartment] = useState('');

    const [mobile, setMobile] = useState('');

    const [address, setAddress] = useState('');

    const [firstName, setFirstName] = useState('');

    const [lastName, setLastName] = useState('');

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        userRef.current.focus();
    }, []);

    useEffect(() => {
        setValidName(USER_REGEX.test(user));
    }, [user]);


    useEffect(() => {
        setValidPwd(PWD_REGEX.test(pwd));
        setValidMatch(pwd === matchPwd);
    }, [pwd, matchPwd]);


    useEffect(() => {
        setErrMsg('');
    }, [user, pwd, matchPwd]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // if button enabled with JS hack
        const v1 = USER_REGEX.test(user);
        const v2 = PWD_REGEX.test(pwd);
        if (!v1 || !v2) {
            setErrMsg('Invalid Entry');
            return;
        }
        try {
            const response = await axios.post( // eslint-disable-line no-unused-vars
                REGISTER_URL,
                JSON.stringify({ username: user, password: pwd, matchPassword: matchPwd, email: email, firstName: firstName, lastName: lastName, department: department, address: address, mobile: mobile }),
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            );
            setSuccess(true);
            //clear state and controlled inputs
            setUser('');
            setPwd('');
            setMatchPwd('');
            setAddress('');
            setDepartment('');
            setMobile('');
            setFirstName('');
            setLastName('');
            setEmail('');
        } catch (err) {
            if (!err.response) {
                setErrMsg('No Server Response');
            } else if (err.response.status === 409) {
                setErrMsg('Username Taken');
            } else {
                setErrMsg('Registration Failed');
            }
            errRef.current.focus();
        }
    };

    return (
        success && localStorage.getItem("authToken") ? (
            <Login />
        ) : (
            <section >
                <p
                    ref={errRef}
                    className={errMsg ? 'errmsg' : 'offscreen'}
                    aria-live="assertive"
                >
                    {errMsg}
                </p>
                <h1>Doctor Register</h1>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="username">
                        Username:
                        <FontAwesomeIcon
                            icon={faCheck}
                            className={validName ? 'valid' : 'hide'}
                        />
                        <FontAwesomeIcon
                            icon={faTimes}
                            className={validName || !user ? 'hide' : 'invalid'}
                        />
                    </label>
                    <input
                        type="text"
                        id="username"
                        ref={userRef}
                        autoComplete="off"
                        onChange={(e) => setUser(e.target.value)}
                        value={user}
                        required
                        aria-invalid={validName ? 'false' : 'true'}
                        aria-describedby="uidnote"
                        onFocus={() => setUserFocus(true)}
                        onBlur={() => setUserFocus(false)}
                    />
                    <p
                        id="uidnote"
                        className={
                            userFocus && user && !validName ? 'instructions' : 'offscreen'
                        }
                    >
                        <FontAwesomeIcon icon={faInfoCircle} />
                        4 to 24 characters.
                        <br />
                        Must begin with a letter.
                        <br />
                        Letters, numbers, underscores, hyphens allowed.
                    </p>
                    <label htmlFor="email">
                        Email address:
                    </label>
                    <input
                        type="text"
                        id="email"
                        autoComplete="off"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        required
                        aria-describedby="uidnote"
                    />
                    <label htmlFor="firstName">
                        First Name:
                    </label>
                    <input
                        type="text"
                        id="firstName"
                        autoComplete="off"
                        onChange={(e) => setFirstName(e.target.value)}
                        value={firstName}
                        required
                        aria-invalid={validName ? 'false' : 'true'}
                        aria-describedby="uidnote"
                    />
                    <label htmlFor="lastName">
                        Last Name:
                    </label>
                    <input
                        type="text"
                        id="lastName"
                        autoComplete="off"
                        onChange={(e) => setLastName(e.target.value)}
                        value={lastName}
                        required
                        aria-invalid={validName ? 'false' : 'true'}
                        aria-describedby="uidnote"
                    />

                    <label htmlFor="password">
                        Password:
                        <FontAwesomeIcon
                            icon={faCheck}
                            className={validPwd ? 'valid' : 'hide'}
                        />
                        <FontAwesomeIcon
                            icon={faTimes}
                            className={validPwd || !pwd ? 'hide' : 'invalid'}
                        />
                    </label>
                    <input
                        type="password"
                        id="password"
                        onChange={(e) => setPwd(e.target.value)}
                        value={pwd}
                        required
                        aria-invalid={validPwd ? 'false' : 'true'}
                        aria-describedby="pwdnote"
                        onFocus={() => setPwdFocus(true)}
                        onBlur={() => setPwdFocus(false)}
                    />
                    <p
                        id="pwdnote"
                        className={pwdFocus && !validPwd ? 'instructions' : 'offscreen'}
                    >
                        <FontAwesomeIcon icon={faInfoCircle} />
                        8 to 24 characters.
                        <br />
                        Must include uppercase and lowercase letters, a number and a
                        special character.
                        <br />
                        Allowed special characters:{' '}
                        <span aria-label="exclamation mark">!</span>{' '}
                        <span aria-label="at symbol">@</span>{' '}
                        <span aria-label="hashtag">#</span>{' '}
                        <span aria-label="dollar sign">$</span>{' '}
                        <span aria-label="percent">%</span>
                    </p>

                    <label htmlFor="confirm_pwd">
                        Confirm Password:
                        <FontAwesomeIcon
                            icon={faCheck}
                            className={validMatch && matchPwd ? 'valid' : 'hide'}
                        />
                        <FontAwesomeIcon
                            icon={faTimes}
                            className={validMatch || !matchPwd ? 'hide' : 'invalid'}
                        />
                    </label>
                    <input
                        type="password"
                        id="confirm_pwd"
                        onChange={(e) => setMatchPwd(e.target.value)}
                        value={matchPwd}
                        required
                        aria-invalid={validMatch ? 'false' : 'true'}
                        aria-describedby="confirmnote"
                        onFocus={() => setMatchFocus(true)}
                        onBlur={() => setMatchFocus(false)}
                    />
                    <p
                        id="confirmnote"
                        className={
                            matchFocus && !validMatch ? 'instructions' : 'offscreen'
                        }
                    >
                        <FontAwesomeIcon icon={faInfoCircle} />
                        Must match the first password input field.
                    </p>

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
                        required
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
                        required
                        aria-describedby="uidnote"
                    />

                    <button
                        disabled={!validName || !validPwd || !validMatch ? true : false}
                    >
                        Sign Up
                    </button>
                </form>
                <p>
                    Already registered?
                    <br />
                    <span className="line">
                        <a href="/login">Sign In</a>
                    </span>
                </p>
            </section>
        )
    );
};

export default DoctorRegister;