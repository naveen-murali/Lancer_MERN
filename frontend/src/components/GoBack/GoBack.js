import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export const GoBack = ({ fluid }) => {
    const redirect = useNavigate();

    return (
        <Container fluid={fluid} className={fluid ? "px-3" : "p-0"}>
            <Button
                onClick={() => redirect(-1)}
                style={{ fontSize: "16px" }}
                className="d-flex justify-content-center align-items-center p-0 m-0 bg-transparent text-dark mb-3">
                <img src='/assets/arrowBack.svg' alt="arrowBack.svg" width={16} /> back
            </Button>
        </Container>
    );
};

GoBack.defaultProps = {
    fluid: false
};

