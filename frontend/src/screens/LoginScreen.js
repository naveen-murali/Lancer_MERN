import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';

import TextField from '@mui/material/TextField';
import Collapse from '@mui/material/Collapse';
import Alert from '@mui/material/Alert';

import { EMAIL_CONFIG, PASSWORD_CONFIG } from '../utils/validationConstants';
import { Meta } from '../components';
import { getAdminInfo, asyncLogin } from '../features/Admin/adminSlice';


const LoginScreen = () => {
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();
    const redirect = useNavigate();
    const { adminInfo, loading, error } = useSelector(getAdminInfo);

    const { register, handleSubmit, formState: { errors } } = useForm({
        mode: 'onSubmit',
        reValidateMode: 'onChange'
    });
    const { email, password } = errors;

    const onSubmit = data => {
        const { email, password } = data;
        dispatch(asyncLogin({ email, password }));
    };

    useEffect(() => {
        if (adminInfo)
            redirect('/');
    }, [adminInfo, redirect]);

    useEffect(() => {
        if (error)
            setOpen(true);
    }, [error]);

    return (
        <div style={{ width: '100vw', minHeight: "100vh", backgroundColor: "#1A2038" }}>
            <Meta title='Login | Lancer Admin' />
            <Container
                style={{ minHeight: '100vh' }}>
                <Row
                    className="justify-content-center"
                    style={{ padding: "15rem 0.5rem" }}>
                    <Col md={7} lg={6}
                        className='bg-white shadow rounded-3 px-4 py-3 d-flex'>
                        <div className='d-flex flex-md-row flex-column align-items-center'>
                            <Col md={6} xs={6}
                                className="d-flex align-items-center p-4">
                                <img style={{ width: "100%" }}
                                    src="/assets/dreamer.svg"
                                    alt="dreamer"
                                />
                            </Col>

                            <Col md={6} xs={12}>
                                <h2 className='letter-spacing-1 d-flex' style={{ fontSize: '24px' }}>
                                    Sign In
                                </h2>
                                <Collapse in={open}>
                                    <Alert severity="error" onClose={() => setOpen(false)}>
                                        {error}
                                    </Alert>
                                </Collapse>

                                <Form onSubmit={handleSubmit(onSubmit)}>
                                    <div className='mt-3'>
                                        <TextField
                                            type='text'
                                            label="Email"
                                            id="email"
                                            size="small"
                                            className='text-danger'
                                            fullWidth={true}
                                            {...register("email", EMAIL_CONFIG)} error={email ? true : false}
                                        />
                                        {email && <em className='text-danger letter-spacing-0' style={{ fontSize: '14px', fontWeight: '600', }}>
                                            Please enter a valid email address
                                        </em>}
                                    </div>
                                    <div className='mt-3'>
                                        <TextField
                                            type='password'
                                            label="Password"
                                            id="password"
                                            size="small"
                                            fullWidth={true}
                                            {...register("password", PASSWORD_CONFIG)} error={password ? true : false}
                                        />
                                        {password && <em className='text-danger letter-spacing-0' style={{ fontSize: '14px', fontWeight: '600', lineHeight: 'auto' }}>
                                            Password should contain at least 8 characters in length with at least 1 number or special characters
                                        </em>}
                                    </div>

                                    <Button
                                        disabled={loading}
                                        type='submit'
                                        variant='dark'
                                        className='us-btn-outline mt-3 p-1 d-felx aligin-items-center jsutif-content-center' style={{ width: '7rem' }}>
                                        {!loading ? 'Login' : <>LOADING...</>}
                                    </Button>
                                </Form>
                            </Col>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default LoginScreen;
