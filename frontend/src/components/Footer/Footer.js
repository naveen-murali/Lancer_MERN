import React from 'react';
import { Col } from 'react-bootstrap';

export const Footer = () => {
    return (
        <footer>
            <Col className='text-center text-white p-2'>
                Copyright &copy; Lancer - Developed by{' '}
                <a
                    href='https://naveen-murali.github.io/personal-website/'
                    className='text-info'
                    target='_blank' rel="noreferrer">
                    Naveen Murali
                </a>
            </Col>
        </footer>
    );
};