import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

const HomeDashboard = () => {
    return (
        <Container>
            <Row xs={1} md={2} lg={3} className="g-4">
                <Col>
                    <Card className="text-center">
                        <Card.Img variant="top" src="patient.jfif" />
                        <Card.Body>
                            <Card.Title>Patient</Card.Title>
                            <Button className="dashboard-card-btn" variant="warning" href="/patients_list">View</Button>
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card className="text-center">
                        <Card.Img variant="top" src="doctor.jfif" />
                        <Card.Body>
                            <Card.Title>Doctor</Card.Title>
                            <Button className="dashboard-card-btn" variant="warning" href="/doctor_register">View</Button>
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card className="text-center">
                        <Card.Img variant="top" src="admin.jfif" />
                        <Card.Body>
                            <Card.Title>Admin</Card.Title>
                            <Button className="dashboard-card-btn" variant="warning" href="/admin_dashboard">View</Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>

    );
};

export default HomeDashboard;
