import React from 'react';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import PatientBills from '../table/PatientBills';


const PatientBillsCard = () => {
    return (
        <Container>
            <Card style={{ minHeight: "200px", minWidth: "200px" }}>
                <Card.Header className="table-header" style={{ fontWeight: "bold" }}>Patient's Bills</Card.Header>
                <Card.Body style={{ maxHeight: "80%" }}>
                    <Container fluid className="patient-table-container" style={{ minHeight: "100px", minWidth: "100px" }}>
                        <PatientBills />
                    </Container>
                </Card.Body>
            </Card>

        </Container>

    );
};

export default PatientBillsCard;
