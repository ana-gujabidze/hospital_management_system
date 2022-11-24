import React, { useEffect, useState } from 'react';
import axios from "../../axios";
import GenericCard from "./GenericCard";



const PatientCard = () => {
    const [count, setCount] = useState();
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
                setCount(response.data.numberOfItems);
                // you tell it that you had the result
                setLoadingData(false);
            });
    };
    useEffect(() => {
        if (loadingData) {
            // if the result is not ready so you make the axios call
            fetchData();
        }
    });
    return (
        <GenericCard
            src="patient.jfif"
            person="Patient"
            count={count}
            link="/patients_list"
        />

    );
};

export default PatientCard;
