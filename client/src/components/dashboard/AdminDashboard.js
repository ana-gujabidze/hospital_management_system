import React from 'react';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import AppointmentCard from "../card/AppointmentCard";
import DoctorCard from "../card/DoctorCard";
import PatientCard from "../card/PatientCard";
import DoctorTable from '../table/DoctorTable';
import PatientTable from "../table/PatientTable";


const AdminDashboard = () => {
    return (
        <Container>
            <div>
                <Row xs={1} md={2} lg={3} className="g-4">
                    <Col className="d-flex">
                        <DoctorCard />
                    </Col>
                    <Col className="d-flex">
                        <PatientCard />
                    </Col>
                    <Col className="d-flex">
                        <AppointmentCard />
                    </Col>
                </Row>
            </div>

            <Row xs={1} md={4} lg={3} className="g-4">
                <Col>
                    <Card style={{ minHeight: "200px", minWidth: "200px" }}>
                        <Card.Header className="table-header" style={{ fontWeight: "bold" }}>Recent Doctors</Card.Header>
                        <Card.Body style={{ maxHeight: "80%" }}>
                            <Container fluid className="doctor-table-container" style={{ minHeight: "100px", minWidth: "100px" }}>
                                <DoctorTable />
                            </Container>
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card style={{ minHeight: "200px", minWidth: "200px" }}>
                        <Card.Header className="table-header" style={{ fontWeight: "bold" }}>Recent Patients</Card.Header>
                        <Card.Body style={{ maxHeight: "80%" }}>
                            <Container fluid className="patient-table-container" style={{ minHeight: "100px", minWidth: "100px" }}>
                                <PatientTable />
                            </Container>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>

    );
};

export default AdminDashboard;
