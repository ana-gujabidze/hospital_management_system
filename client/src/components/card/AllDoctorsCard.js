import React from 'react';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import AllDoctorsTable from "../table/AllDoctorsTable";


const AllDoctorsCard = () => {
    return (
        <Container>
            <Card style={{ minHeight: "200px", minWidth: "200px" }}>
                <Card.Header className="table-header" style={{ fontWeight: "bold" }}>Doctors</Card.Header>
                <Card.Body style={{ maxHeight: "80%" }}>
                    <Container fluid className="patient-table-container" style={{ minHeight: "100px", minWidth: "100px" }}>
                        <AllDoctorsTable />
                    </Container>
                </Card.Body>
            </Card>

        </Container>

    );
};

export default AllDoctorsCard;
