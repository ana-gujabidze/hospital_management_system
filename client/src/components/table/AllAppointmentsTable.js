import { faArrowDown, faFileInvoiceDollar, faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import Container from "react-bootstrap/Container";
import Table from 'react-bootstrap/Table';
import { useNavigate } from 'react-router-dom';
import axios from "../../axios";
import LoadingSpinner from "../spinner/LoadingSpinner";

const fileDownload = require('js-file-download');


function AllAppointmentsTable() {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [loadingData, setLoadingData] = useState(true);

    async function fetchData() {
        await axios
            .get("/api/appointments/appointments_list/", {
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

    // here we will redirect user and send your data into state
    const navigateToUpdate = (item) => {
        navigate('/appointment_update/', { state: item });
    };
    const navigateToInvoice = (item) => {
        navigate('/appointment_invoice/', { state: item });
    };
    async function deleteObject(appointmentId) {
        await axios
            .delete("/api/appointments/specific_appointment/" + appointmentId + "/", {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Token ' + localStorage.getItem("authToken"),
                },
            })
            .then((response) => {
                // check if the data is populated
                console.log(response.data);
                setLoadingData(false);
            });
    };

    const handleClick = (e, appointmentId) => {
        e.preventDefault();
        console.log('The link was clicked.');
        deleteObject(appointmentId);
        window.location.reload();
    };

    async function donwloadCSV() {
        await axios
            .get("/api/appointments/download_all_appointments/", {
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

    return (
        loadingData ? (<LoadingSpinner />) : (
            <Container>
                <Table responsive bordered style={{ marginBottom: 0 }} hover striped>
                    <thead>
                        <tr>
                            <th>Patient Name</th>
                            <th>Doctor Name</th>
                            <th>Hospital</th>
                            <th>Department</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Update</th>
                            <th>Invoice</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr key={index}>
                                <td>{item.patientName}</td>
                                <td>{item.doctorName}</td>
                                <td>{item.hospitalName}</td>
                                <td>{item.department}</td>
                                <td>{item.startTime}</td>
                                <td>{item.endTime}</td>
                                <td>
                                    <a href="/appointment_update/" onClick={() => navigateToUpdate(item)}>
                                        <FontAwesomeIcon
                                            icon={faPenToSquare}
                                        /></a>
                                </td>
                                <td>
                                    <a href="/appointment_invoice/" onClick={() => navigateToInvoice(item)}>
                                        <FontAwesomeIcon
                                            icon={faFileInvoiceDollar}
                                        /></a>
                                </td>
                                <td><a onClick={e => handleClick(e, item.id)}> {/* eslint-disable-line jsx-a11y/anchor-is-valid */}
                                    <FontAwesomeIcon
                                        icon={faTrashCan}
                                    /></a>
                                </td>
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

export default AllAppointmentsTable;