import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Row, Col, Badge } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import Avatar from '@mui/material/Avatar';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

import {
    Meta,
    Message,
    ConfirmBox,
    Portal,
    SearchBox,
    Paginate,
    GoBack,
} from '../components';

import { LinkContainer } from 'react-router-bootstrap';
import { blockAsyncUser, getAsyncUsers, unblockAsyncUser } from '../features/Users/usersActions';
import { getUsers } from '../features/Users/usersSlice';


const UsersScreen = () => {
    const dispatch = useDispatch();
    const redirect = useNavigate();
    const [searchInput, setSearchInput] = useState(null);

    const [confirmBox, setConfirmBox] = useState({
        show: false,
        dataHandler: {
            payload: '',
            action: ''
        },
        message: ''
    });


    const { search, pageNumber = 1 } = useParams();
    const { users, page, pages, error, loading } = useSelector(getUsers);


    useEffect(() => {
        dispatch(getAsyncUsers({ search, page: pageNumber }));
    }, [dispatch, pageNumber, search]);

    useEffect(() => {
        let time;
        if (searchInput !== null)
            time = setTimeout(() => {
                dispatch(getAsyncUsers({ search: searchInput }));
            }, 200);

        return () => time && clearTimeout(time);
    }, [searchInput, dispatch]);

    const searchHandle = (search) => {
        if (search)
            redirect(`/users/${search}/page/1`);
        else
            redirect(`/users/page/1`);
    };

    const confirmBoxConfirmAction = () => {
        setConfirmBox((prev) => ({ ...prev, show: false }));
        const { payload, action } = confirmBox.dataHandler;

        if (action === 'UNBLOCK')
            return dispatch(unblockAsyncUser(payload));

        if (action === 'BLOCK')
            return dispatch(blockAsyncUser(payload));
    };

    const confirmBoxCancelAction = () => {
        setConfirmBox((prev) => ({ ...prev, show: false }));
    };

    const searchInputsHandler = (input) => {
        setSearchInput(input);
    };

    return (
        <>
            <GoBack />
            <Container className="bg-white p-3 rounded-2 shadow">
                <div className="col-12 conainer-fluid">
                    <Row className='gy-2'>
                        <Col lg={6} xs={12} className='d-flex align-items-center'>
                            <h3 className='letter-spacing-1 m-0' style={{ fontSize: '24px' }}>
                                Category List
                            </h3>
                        </Col>
                        <Col lg={6} xs={12} className='d-flex align-items-center justify-content-end'>
                            <SearchBox
                                searchInputs={searchInputsHandler}
                                initialValue={''}
                                enterKeyword={searchHandle} />
                        </Col>
                    </Row>
                </div>

                {loading && !users.length
                    ? <Meta title='Loading... | Lancer' />
                    : error
                        ? <Meta title='Error | Lancer' />
                        : <Meta title='Users | Lancer' />
                }

                <Table bordered hover responsive
                    className='table-sm m-0 mt-3'>
                    <thead>
                        <tr className="table-active border">
                            <th>ID</th>
                            <th>IMAGE</th>
                            <th>NAME</th>
                            <th>EMAIL</th>
                            <th>PHONE</th>
                            <th>ROLE</th>
                            <th><span style={{ whiteSpace: 'nowrap' }}>IS Blocked</span></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {error
                            ? <tr>
                                <td colSpan={6} className='p-0 mt-0'>
                                    <Message variant='danger' className='my-1'>{error}</Message>
                                </td>
                            </tr>
                            : users?.map(user => (
                                <tr key={user._id} style={{ verticalAlign: 'center !important' }}>
                                    <td>{user._id}</td>
                                    <td className='text-center'>
                                        {(user && user.image)
                                            ? <Avatar src={user.image.url} imgProps={{ referrerPolicy: "no-referrer" }} className='m-0' />
                                            : <Avatar className='shadow m-0'>{user.name.substring(0, 1).toUpperCase()}</Avatar>}
                                    </td>
                                    <td>
                                        <span style={{ whiteSpace: 'nowrap' }}>{user.name}</span>
                                    </td>
                                    <td>
                                        {user.email} <br />
                                        {user.isEmailVarified
                                            ? <Badge pill bg="success shadow">Verified</Badge>
                                            : <Badge pill bg="danger shadow">Not Verified</Badge>}
                                    </td>
                                    <td>
                                        {user.phone} <br />
                                        {user.isPhoneVerified
                                            ? <Badge pill bg="success shadow">Verified</Badge>
                                            : <Badge pill bg="danger shadow">Not Verified</Badge>}
                                    </td>
                                    <td className='text-center'>
                                        {user.role.map((role, index) =>
                                            <p key={`${user.id}${index}`}
                                                className='text-dark letter-spacing-0 m-0 p-0'
                                                style={{ textTransform: 'uppercase' }}>
                                                {role}
                                            </p>)}
                                    </td>
                                    <td className='text-center'>
                                        {user.isBlocked
                                            ? (<Badge pill bg="danger">Blocked</Badge>)
                                            : (<Badge pill bg="success">Available</Badge>)}
                                    </td>
                                    <td className='text-center'>
                                        <span className='mx-auto' style={{ display: 'inline-flex' }}>
                                            <LinkContainer to={`/users/${user._id}`}>
                                                <Button
                                                    variant='light'
                                                    className='us-edit-btn border'>
                                                    <RemoveRedEyeIcon className='p-0' />
                                                </Button>
                                            </LinkContainer>
                                            <Button
                                                variant={user.isBlocked ? 'success' : 'danger'}
                                                className='us-delete-btn border'
                                                onClick={() => {
                                                    setConfirmBox(prev => ({
                                                        ...prev,
                                                        show: true,
                                                        dataHandler: {
                                                            payload: user._id,
                                                            action: user.isBlocked ? 'UNBLOCK' : 'BLOCK'
                                                        },
                                                        message: `Do you want to ${user.isBlocked ? 'unblock' : 'block'} ${user.title}?`
                                                    }));
                                                }}>
                                                {user.isBlocked
                                                    ? <i className='fas fa-check'></i>
                                                    : <i className="fa-solid fa-ban"></i>}
                                            </Button>
                                        </span>
                                    </td>
                                </tr>))}
                    </tbody>
                </Table>

                <Col
                    xs={12}
                    style={{ height: 'fit-content !important' }}
                    className='d-flex justify-content-end mt-3'>
                    <Paginate
                        page={page}
                        pages={pages}
                        path={search
                            ? `/users/${search}`
                            : '/users'} />
                </Col>

                <Portal id='category-confirmBox'>
                    <ConfirmBox
                        show={confirmBox.show}
                        cancelAction={confirmBoxCancelAction}
                        confirmAction={confirmBoxConfirmAction}
                        message={confirmBox.message} />
                </Portal>
            </Container>
        </>
    );
};

export default UsersScreen;