import React, { useEffect, useState } from "react";
import Table from 'react-bootstrap/Table';
import { useLocation } from 'react-router-dom';
import axios from "../../axios";
import LoadingSpinner from "../spinner/LoadingSpinner";

const BILLS_URL = "/api/bills/get/specific_bills/";

function PatientBills() {
    const { state } = useLocation();
    const [data, setData] = useState([]);
    const [loadingData, setLoadingData] = useState(true);

    async function fetchData() {
        const FULL_BILL_URL = `${BILLS_URL}${state.id}/`;
        await axios
            .get(FULL_BILL_URL, {
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

    return (
        loadingData ? (<LoadingSpinner />) : (

            <Table responsive bordered style={{ marginBottom: 0 }} hover striped>
                <thead>
                    <tr>
                        <th>Doctor Name</th>
                        <th>Room Charge</th>
                        <th>Doctor Fee</th>
                        <th>Medicine Cost</th>
                        <th>Other Charge</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={index}>
                            <td>{item.doctorName}</td>
                            <td>{item.roomCharge}</td>
                            <td>{item.doctorFee}</td>
                            <td>{item.medicineCost}</td>
                            <td>{item.otherCharge}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>

        ));
}

export default PatientBills;