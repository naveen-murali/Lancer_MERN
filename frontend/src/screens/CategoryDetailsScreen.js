import React, { useEffect, useState } from 'react';
import { Badge, Button, Col, Container, Form, Image, Row, Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { ConfirmBox, FloatItem, GoBack, Message, Meta, Portal } from '../components';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Skeleton from '@mui/material/Skeleton';

import {
    asyncBlockSubcategory,
    asyncUnblockSubcategory,
    createAsyncSubcategory,
    eidtAsyncSubcategory,
    getAsyncCatogoryDetails
} from '../features/Category/categoryActions';
import {
    clearCategotyDetails,
    getCategoryDetails,
    getCreateSubcategory,
    getEditSubcategory
} from '../features/Category/categorySlice';
import { showErrorAlert } from '../features/MainAlert/mainAlertSlice';


const CategoryDetailsScreen = () => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const [changeCategory, setChangeCategory] = useState({
        show: false,
        action: "",
        payload: ''
    });
    const [formData, setFormData] = useState({ title: '', description: '' });
    const [confirmBox, setConfirmBox] = useState({
        show: false,
        dataHandler: {
            payload: '',
            action: ''
        },
        message: ''
    });

    const { category, loading, error } = useSelector(getCategoryDetails);
    const { title, _id: catId, description, image, subcategory, isBlocked } = category;

    const { loading: createLoading, success: createSuccess } = useSelector(getCreateSubcategory);
    const { loading: editLoading, success: editSuccess } = useSelector(getEditSubcategory);

    const confirmBoxConfirmAction = () => {
        setConfirmBox((prev) => ({ ...prev, show: false }));
        const { payload, action } = confirmBox.dataHandler;

        if (action === 'UNBLOCK')
            return dispatch(asyncUnblockSubcategory(payload));

        if (action === 'BLOCK')
            return dispatch(asyncBlockSubcategory(payload));
    };

    const confirmBoxCancelAction = () => {
        setConfirmBox((prev) => ({ ...prev, show: false }));
    };

    const floatCloseActionHandler = () => {
        setChangeCategory(prev => ({ ...prev, show: false }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const { action, payload } = changeCategory;

        const { title, description } = formData;

        if (action === "ADD" && (!title || !description))
            return dispatch(showErrorAlert('Please enter all the credentials'));

        if (action === "ADD")
            return dispatch(createAsyncSubcategory({ category: id, title, description }));

        if (action === "EDIT")
            return dispatch(eidtAsyncSubcategory({
                id: payload,
                subcategory: { title, description }
            }));
    };


    useEffect(() => {
        dispatch(getAsyncCatogoryDetails(id));

        return () =>
            dispatch(clearCategotyDetails());
    }, [dispatch, id]);

    useEffect(() => {
        let time;
        if (createSuccess || editSuccess) {
            setChangeCategory({ show: false, action: "" });
            time = setTimeout(() => {
                setFormData({ title: '', description: null });
            }, 1000);
        }
        return () => clearTimeout(time);
    }, [createSuccess, editSuccess]);


    if (loading && !catId)
        return <DetailsLoading />;
    else
        return (
            <>
                {error
                    ? <Meta title='Error | Lancer' />
                    : <Meta title={`${category.title} | Lancer`} />
                }
                <GoBack fluid />
                <Container fluid className="mt-2">
                    <Row className='gy-2 justify-content-center px-md-5'>
                        <Col xl={3} md={6} xs={12} className="p-0">
                            <Col md={11} xs={12} className='d-flex flex-column align-items-center bg-white p-3 rounded-2 shadow'>

                                <h4 className='align-self-start letter-spacing-1 m-0 mb-2' style={{ fontSize: '24px' }}>
                                    Category Details
                                </h4>
                                {image?.url &&
                                    <div>
                                        <Image fluid src={image.url} />
                                    </div>}

                                <Col xs={12} className='d-flex flex-column mt-3 justify-content-center' >
                                    <p className='p-0 m-0'>
                                        <strong className='bold'>Category Id: </strong>{' '}
                                        {catId}
                                    </p>
                                    <p className='p-0 m-0 mt-1'>
                                        <strong className='bold'>Title: </strong>{' '}
                                        {title}
                                    </p>
                                    <p className='p-0 m-0 mt-1'>
                                        <strong className='bold'>Description: </strong>{' '}
                                        {description}
                                    </p>
                                    <p className='p-0 m-0 text-end'>
                                        {isBlocked
                                            ? <Badge pill bg="danger">Blocked</Badge>
                                            : <Badge pill bg="success">Available</Badge>}
                                    </p>
                                </Col>
                            </Col>
                        </Col>

                        <Col lg={9} className='gy-2 p-3 bg-white shadow rounded-2'>
                            <Col xs={12} className='d-flex m-0 align-items-center justify-content-between'>
                                <h4 className='letter-spacing-1 m-0' style={{ fontSize: '24px' }}>
                                    Subcategories
                                </h4>
                                {/* </Col>
                            <Col lg={6} xs={12} className='text-end'> */}
                                <Box sx={{ '& > :not(style)': { m: 1 } }} >
                                    <Fab
                                        onClick={() => {
                                            setFormData({
                                                title: '',
                                                description: '',
                                            });
                                            setChangeCategory(prev =>
                                            ({
                                                ...prev,
                                                show: true,
                                                action: "ADD"
                                            }));
                                        }}
                                        size="small"
                                        color="success"
                                        className='shadow'
                                        aria-label="add">
                                        <AddIcon />
                                    </Fab>
                                </Box>
                            </Col>

                            <Col xs={12}>
                                <Table bordered hover responsive
                                    className='table-sm m-0'>
                                    <thead>
                                        <tr className="table-active border">
                                            <th>ID</th>
                                            <th>TITLE</th>
                                            <th>DESCRIPTION</th>
                                            <th>IS Blocked</th>
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
                                            : (!subcategory || !subcategory.length)
                                                ? <tr>
                                                    <td colSpan={5}>
                                                        <Message variant='danger' className='m-0'>No Subcatagory yet</Message>
                                                    </td>
                                                </tr>
                                                : subcategory.map(cate => (
                                                    <tr key={cate._id} style={{ verticalAlign: 'center !important' }}>
                                                        <td>{cate._id}</td>
                                                        <td><span style={{ whiteSpace: 'nowrap' }}>{cate.title}</span></td>
                                                        <td><span style={{ whiteSpace: 'nowrap' }}>{cate.description}</span></td>

                                                        <td className='text-center'>
                                                            {cate.isBlocked
                                                                ? (<Badge pill bg="danger">Blocked</Badge>)
                                                                : (<Badge pill bg="success">Available</Badge>)}
                                                        </td>
                                                        <td className='text-center'>
                                                            <span className='mx-auto' style={{ display: 'inline-flex' }}>
                                                                <Button
                                                                    variant='light'
                                                                    onClick={() => {
                                                                        setFormData({
                                                                            title: cate.title,
                                                                            description: cate.description,
                                                                        });
                                                                        setChangeCategory({
                                                                            action: "EDIT",
                                                                            show: true,
                                                                            payload: cate._id
                                                                        });
                                                                    }}
                                                                    className='us-edit-btn border'>
                                                                    <i className='fas fa-edit'></i>
                                                                </Button>
                                                                <Button
                                                                    variant={cate.isBlocked ? 'success' : 'danger'}
                                                                    className='us-delete-btn border'
                                                                    onClick={() => {
                                                                        setConfirmBox(prev => ({
                                                                            ...prev,
                                                                            show: true,
                                                                            dataHandler: {
                                                                                payload: cate._id,
                                                                                action: cate.isBlocked ? 'UNBLOCK' : 'BLOCK'
                                                                            },
                                                                            message: `Do you want to ${cate.isBlocked ? 'unblock' : 'block'} ${cate.title}?`
                                                                        }));
                                                                    }}>
                                                                    {cate.isBlocked
                                                                        ? <i className='fas fa-check'></i>
                                                                        : <i className="fa-solid fa-ban"></i>}
                                                                </Button>
                                                            </span>
                                                        </td>
                                                    </tr>))}
                                    </tbody>
                                </Table>
                            </Col>

                        </Col>
                    </Row>

                    <FloatItem show={changeCategory.show} closeAction={floatCloseActionHandler}>
                        <Form onSubmit={handleSubmit}>

                            <Container fluid>
                                <h4 className='letter-spacing-0 m-0 my-2' style={{ fontSize: '24px' }}>
                                    {changeCategory.action === "ADD" ? <>Add Category</> : <>Edit Category</>}
                                </h4>
                                <Row>
                                    <Form.Group controlId='title' className='mb-2'>
                                        <Form.Label>Title</Form.Label>
                                        <Form.Control type='text' placeholder='Enter a title'
                                            onChange={(e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                                            value={formData.title ? formData.title : ""}
                                            name='title'
                                            className='border rounded-2' />
                                    </Form.Group>

                                    <Form.Group className='mb-2' controlId="description">
                                        <Form.Label>Description</Form.Label>
                                        <Form.Control
                                            name='description'
                                            as="textarea"
                                            rows={4}
                                            onChange={(e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                                            value={formData.description ? formData.description : ""}
                                            className='border rounded-2' />
                                    </Form.Group>



                                    <Col md={4}></Col><Col md={4}></Col>

                                    <Col md={4} className='justify-self-end'>
                                        <Button type='submit' variant='dark'
                                            className='us-btn-outline mt-2 p-1'
                                            disabled={createLoading || editLoading}>
                                            {changeCategory.action === 'ADD'
                                                ? createLoading ? <>Creating...</> : <>Create</>
                                                : editLoading ? <>Update...</> : <>Update</>}
                                        </Button>
                                    </Col>
                                </Row>
                            </Container>
                        </Form>
                    </FloatItem>
                </Container>

                <Portal id='category-confirmBox'>
                    <ConfirmBox
                        show={confirmBox.show}
                        cancelAction={confirmBoxCancelAction}
                        confirmAction={confirmBoxConfirmAction}
                        message={confirmBox.message} />
                </Portal>
            </>
        );
};

const DetailsLoading = () => {
    return <>
        <Meta title='Loading... | Lancer' />
        <Container fluid className="mt-2">
            <Row className='gy-2 justify-content-center px-md-5'>
                <Col lg={3} md={6} xs={12} className="p-0">
                    <Col md={11} xs={12} className='d-flex flex-column align-items-center bg-white p-3 rounded-2 shadow'>
                        {/* <Col xs={12}> */}
                        <h4 className='align-self-start letter-spacing-1 m-0' style={{ fontSize: '24px' }}>
                            Category Details
                        </h4>
                        {/* </Col> */}
                        {/* <Col xs={12} className='d-flex flex-column    justify-content-center' > */}
                        <Skeleton variant="rectangular" className='w-100' height={200} />
                        <Skeleton width="75%" />
                        <Skeleton width="65%" />
                        <Skeleton width="85%" />
                        <div className='d-flex justify-content-end'>
                            <Skeleton width="20%" />
                        </div>
                        {/* </Col> */}
                    </Col>
                </Col>

                <Col lg={9} className='gy-2 p-3 bg-white shadow rounded-2'>
                    <Col xs={12} className='d-flex m-0 align-items-center justify-content-between'>
                        <h4 className='letter-spacing-1 m-0' style={{ fontSize: '24px' }}>
                            Subcategories
                        </h4>
                        {/* </Col>
                    <Col lg={6} xs={12} className='text-end'> */}
                        <Box sx={{ '& > :not(style)': { m: 1 } }} >
                            <Fab
                                size="small"
                                color="success"
                                className='shadow'
                                aria-label="add">
                                <AddIcon />
                            </Fab>
                        </Box>
                    </Col>
                    <Col xs={12}>
                        <Table bordered hover responsive
                            className='table-sm m-0'>
                            <thead>
                                <tr className="table-active border">
                                    <th>ID</th>
                                    <th>TITLE</th>
                                    <th>DESCRIPTION</th>
                                    <th>IS Blocked</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className='p-1 py-0' colSpan={5}><Skeleton height={50} animation="wave" /></td>
                                </tr>
                                <tr>
                                    <td className='p-1 py-0' colSpan={5}><Skeleton height={50} animation="wave" /></td>
                                </tr>
                                <tr>
                                    <td className='p-1 py-0' colSpan={5}><Skeleton height={50} animation="wave" /></td>
                                </tr>
                                <tr>
                                    <td className='p-1 py-0' colSpan={5}><Skeleton height={50} animation="wave" /></td>
                                </tr>
                            </tbody>
                        </Table>
                    </Col>
                </Col>
            </Row>
        </Container>
    </>;
};

export default CategoryDetailsScreen;