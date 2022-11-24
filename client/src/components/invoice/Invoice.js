import React, { useEffect, useState } from "react";
// import Table from 'react-bootstrap/Table';
import Container from "react-bootstrap/Container";
import { useLocation } from 'react-router-dom';
import axios from "../../axios";
import LoadingSpinner from "../spinner/LoadingSpinner";

const SPECIFIC_PATIENT_BILLS = "/api/bills/get/specific_bills/";

function Invoice() {
    const { state } = useLocation();
    const [data, setData] = useState([]);
    const [numberOfItems, setNumberOfItems] = useState(0);
    const [amountDue, setAmountDue] = useState(0);
    const [loadingData, setLoadingData] = useState(true);
    const now = new Date().toLocaleDateString();

    async function fetchData() {
        const FULL_BILL_URL = `${SPECIFIC_PATIENT_BILLS}${state.id}/`;
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
                setNumberOfItems(response.data.numberOfItems);
                setAmountDue(response.data.amountDue);
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

            <Container className="invoice">
                <header className="invoice-header">
                    <h1 className="invoice-heading">Invoice</h1>
                    <address>
                        <p>{state.fullName}</p>
                        <p>{state.address}</p>
                        <p>{state.mobile}</p>
                    </address>
                </header>
                <article>
                    <h1>Recipient</h1>
                    <address contenteditable>
                        <p>{state.fullName}</p>
                    </address>
                    <table className="meta">
                        <tr>
                            <th><span>Invoice #</span></th>
                            <td><span>{state.id}</span></td>
                        </tr>
                        <tr>
                            <th><span>Date</span></th>
                            <td><span>{now}</span></td>
                        </tr>
                        <tr>
                            <th><span>Amount Due</span></th>
                            <td><span id="prefix">$</span><span>{amountDue}</span></td>
                        </tr>
                    </table>
                    <table className="inventory">
                        <thead>
                            <tr>
                                <th><span contenteditable>Room Charge</span></th>
                                <th><span contenteditable>Doctor Fee</span></th>
                                <th><span contenteditable>Medicine Cost</span></th>
                                <th><span contenteditable>Other Charge</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.roomCharge}</td>
                                    <td>{item.doctorFee}</td>
                                    <td>{item.medicineCost}</td>
                                    <td>{item.otherCharge}</td>
                                </tr>
                            ))}

                        </tbody>
                    </table>
                    <table className="balance">
                        <tr>
                            <th><span contenteditable>Total</span></th>
                            <td>${amountDue}</td>
                        </tr>
                    </table>
                </article>
                <aside>
                    <h1 className="invoice-heading"><span contenteditable>Additional Notes</span></h1>
                    <div contenteditable>
                        <p>A finance charge of 1.5% will be made on unpaid balances after 30 days.</p>
                    </div>
                </aside>
            </Container>
        ));
}

export default Invoice;