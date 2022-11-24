import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';



const GenericCard = (props) => {
    return (
        <Card style={{ cursor: "pointer" }} className="flex-fill text-center">
            <Card.Img variant="top" src={props.src} />
            <Card.Body>
                <Card.Title>Total {props.person}s</Card.Title>
                <Card.Text>{props.count}</Card.Text>
                <Button className="dashboard-card-btn" variant="warning" href={props.link}>View</Button>
            </Card.Body>
        </Card>

    );
};

export default GenericCard;
