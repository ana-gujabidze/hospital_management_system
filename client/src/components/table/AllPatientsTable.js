import { faArrowDown, faHouseMedicalCircleCheck, faPenToSquare, faRectangleList, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import Container from "react-bootstrap/Container";
import Table from 'react-bootstrap/Table';
import { useNavigate } from 'react-router-dom';
import axios from "../../axios";
import LoadingSpinner from "../spinner/LoadingSpinner";


const UPDATE_URL = '/api/multi_user/patient_update/';
const fileDownload = require('js-file-download');


function AllPatientsTable() {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [loadingData, setLoadingData] = useState(true);

    async function fetchData() {
        await axios
            .get("/api/multi_user/patient_list/", {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Token ' + localStorage.getItem("authToken"),
                },
            })
            .then((response) => {
                // check if the data is populated
                setData(response.data.queryset);
                // you tell it that you had the result
                setLoadingData(false);
            });
    }

    useEffect(() => {
        if (loadingData) {
            // if the result is not ready so you make the axios call
            fetchData();
        }
    }, []);

    async function updateResponse(patientId) {
        await axios.post( // eslint-disable-line no-unused-vars
            UPDATE_URL,
            JSON.stringify({ patientId: patientId, state: true }),
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Token ' + localStorage.getItem("authToken"),
                },
            }
        )
    };

    async function deleteObject(patientId) {
        await axios
            .delete("/api/multi_user/specific_user/" + patientId + "/", {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Token ' + localStorage.getItem("authToken"),
                },
            })
            .then((response) => {
                // check if the data is populated
                console.log(response.data);
            });
    };

    async function donwloadCSV() {
        await axios
            .get("/api/multi_user/download_all_patients/", {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Token ' + localStorage.getItem("authToken"),
                },
            })
            .then((response) => {
                // check if the data is populated
                const contentDisposition = response.headers.get('Content-Disposition');
                const filename = contentDisposition.split('filename=')[1].split(';')[0];
                fileDownload(response.data, filename + ".csv");
            });
    };


    const handleClick = (e, patientId) => {
        e.preventDefault();
        console.log('The link was clicked.');
        deleteObject(patientId);
        window.location.reload();
    }

    const navigateToProfile = (item) => {
        navigate('/patient_profile', { state: item }); // here we will redirect user and send your data into state
    };

    const navigateToBills = (item) => {
        navigate('/patient_bills', { state: item }); // here we will redirect user and send your data into state
    };

    const navigateToDischarge = (item) => {
        updateResponse(item.id);
        navigate('/patient_discharge', { state: item });
    };

    return (
        loadingData ? (<LoadingSpinner />) : (
            <Container>
                <Table responsive bordered style={{ marginBottom: 0 }} hover striped>
                    <thead>
                        <tr>
                            <th>Full Name</th>
                            <th>Mobile</th>
                            <th>Disease</th>
                            <th>Symptoms</th>
                            <th>Status</th>
                            <th>Update</th>
                            <th>Bills</th>
                            <th>Discharge</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr key={index}>
                                <td>{item.fullName}</td>
                                <td>{item.mobile}</td>
                                <td>{item.disease}</td>
                                <td>{item.symptoms}</td>
                                <td>{item.status ? "Discharged" : "Admitted"}</td>
                                <td>
                                    <a href="/patient_profile" onClick={() => navigateToProfile(item)}>
                                        <FontAwesomeIcon
                                            icon={faPenToSquare}
                                        /></a>
                                </td>
                                <td>
                                    <a href="/patient_bills" onClick={() => navigateToBills(item)}>
                                        <FontAwesomeIcon
                                            icon={faRectangleList}
                                        /></a>
                                </td>
                                {item.status ? <td></td> : (<td><a onClick={() => navigateToDischarge(item)}> {/* eslint-disable-line jsx-a11y/anchor-is-valid */}
                                    <FontAwesomeIcon
                                        icon={faHouseMedicalCircleCheck}
                                    /></a></td>)}
                                <td><a onClick={e => handleClick(e, item.patientId)}> {/* eslint-disable-line jsx-a11y/anchor-is-valid */}
                                    <FontAwesomeIcon
                                        icon={faTrashCan}
                                    /></a></td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <Button variant="dark" onClick={() => donwloadCSV()}>Download CSV <FontAwesomeIcon
                    icon={faArrowDown}
                /></Button>
            </Container>
        ));
}

export default AllPatientsTable;