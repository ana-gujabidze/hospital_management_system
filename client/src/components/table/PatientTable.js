import React, { useEffect, useState } from "react";
import Table from 'react-bootstrap/Table';
import axios from "../../axios";

function PatientTable() {
    const [data, setData] = useState([]);
    const [loadingData, setLoadingData] = useState(true);

    async function fetchData() {
        await axios
            .get("/api/multi_user/last_patients_list/", {
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
                    <th>Disease</th>
                    <th>Symptoms</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                {data.map((item, index) => (
                    <tr key={index}>
                        <td>{item.fullName}</td>
                        <td>{item.mobile}</td>
                        <td>{item.address}</td>
                        <td>{item.disease}</td>
                        <td>{item.symptoms}</td>
                        <td>{item.status ? "Discharged" : "Admitted"}</td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
}

export default PatientTable;