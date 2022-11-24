import React, { useEffect, useState } from "react";
import Table from 'react-bootstrap/Table';
import axios from "../../axios";

function DoctorTable() {
    const [data, setData] = useState([]);
    const [loadingData, setLoadingData] = useState(true);

    async function fetchData() {
        await axios
            .get("/api/multi_user/last_doctors_list/", {
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

    return (
        <Table responsive bordered style={{ marginBottom: 0 }} hover striped>
            <thead>
                <tr>
                    <th>Full Name</th>
                    <th>Mobile</th>
                    <th>Address</th>
                    <th>Department</th>
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
                    </tr>
                ))}
            </tbody>
        </Table>
    );
}

export default DoctorTable;