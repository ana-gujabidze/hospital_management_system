import { faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from "react";
import Table from 'react-bootstrap/Table';
import { useNavigate } from 'react-router-dom';
import axios from "../../axios";

function AllDoctorsTable() {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [loadingData, setLoadingData] = useState(true);

    async function fetchData() {
        await axios
            .get("/api/multi_user/doctor_list/", {
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
    };

    useEffect(() => {
        if (loadingData) {
            // if the result is not ready so you make the axios call
            fetchData();
        }
    }, []);

    async function deleteObject(doctorId) {
        await axios
            .delete("/api/multi_user/specific_user/" + doctorId + "/", {
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

    const handleClick = (e, doctorId) => {
        e.preventDefault();
        console.log('The link was clicked.');
        deleteObject(doctorId);
        window.location.reload();
    };

    const navigateToConfirmed = (item) => {
        navigate('/doctor_profile/', { state: item }); // here we will redirect user and send data into state
    }

    return (
        <Table responsive bordered style={{ marginBottom: 0 }} hover striped>
            <thead>
                <tr>
                    <th>Full Name</th>
                    <th>Mobile</th>
                    <th>Address</th>
                    <th>Department</th>
                    <th>Update</th>
                    <th>Delete</th>
                    <th style={{ display: "none" }}>Doctor ID</th>
                </tr>
            </thead>
            <tbody>
                {data.map((item, index) => (
                    <tr key={index}>
                        <td>{item.fullName}</td>
                        <td>{item.mobile}</td>
                        <td>{item.address}</td>
                        <td>{item.department}</td>
                        <td style={{ display: "none" }}>{item.doctorId}</td>
                        <td>
                            <a href="/doctor_profile/" onClick={() => navigateToConfirmed(item)}>
                                <FontAwesomeIcon
                                    icon={faPenToSquare}
                                /></a>
                        </td>
                        <td><a onClick={e => handleClick(e, item.doctorId)}> {/* eslint-disable-line jsx-a11y/anchor-is-valid */}
                            <FontAwesomeIcon
                                icon={faTrashCan}
                            /></a></td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
}

export default AllDoctorsTable;