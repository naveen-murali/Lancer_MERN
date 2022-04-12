import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Row, Col, Badge, Form, Image } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

import {
  Meta,
  Message,
  ConfirmBox,
  Portal,
  SearchBox,
  Paginate,
  FloatItem,
  CropImage,
  GoBack
} from '../components';

import {
  getAsyncCategories,
  asyncBlockCategory,
  asyncUnblockCategory,
  createAsyncCategory,
  editAsyncCategory,
} from '../features/Category/categoryActions';

import {
  getCategories,
  getCreateCategory,
  getEditCategory
} from '../features/Category/categorySlice';
import { showErrorAlert } from '../features/MainAlert/mainAlertSlice';
import { LinkContainer } from 'react-router-bootstrap';


const CategoryScreen = () => {
  const dispatch = useDispatch();
  const redirect = useNavigate();
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [changeCategory, setChangeCategory] = useState({ show: false, action: "", payload: '' });
  const [cropImage, setCropImage] = useState({
    croppingImge: null,
    croppedImge: null
  });
  const [confirmBox, setConfirmBox] = useState({
    show: false,
    dataHandler: {
      payload: '',
      action: ''
    },
    message: ''
  });


  const { search, pageNumber = 1 } = useParams();
  const { category, page, pages, error, loading } = useSelector(getCategories);
  const { loading: createLoading, success: createSuccess } = useSelector(getCreateCategory);
  const { loading: editLoading, success: editSuccess } = useSelector(getEditCategory);


  useEffect(() => {
    dispatch(getAsyncCategories({ search, page: pageNumber }));
  }, [dispatch, pageNumber, search]);

  useEffect(() => {
    if (createSuccess || editSuccess) {
      setChangeCategory({ show: false, action: "" });
      setTimeout(() => {
        setCropImage({ croppedImge: null, croppingImge: null });
        setFormData({ title: '', description: null });
      }, 1000);
    }
  }, [createSuccess, editSuccess]);


  const searchHandle = (search) => {
    if (search)
      redirect(`/categories/${search}/page/1`);
    else
      redirect(`/categories/page/1`);
  };

  const confirmBoxConfirmAction = () => {
    setConfirmBox((prev) => ({ ...prev, show: false }));
    const { payload, action } = confirmBox.dataHandler;

    if (action === 'UNBLOCK')
      return dispatch(asyncUnblockCategory(payload));;

    if (action === 'BLOCK')
      return dispatch(asyncBlockCategory(payload));
  };

  const confirmBoxCancelAction = () => {
    setConfirmBox((prev) => ({ ...prev, show: false }));
  };

  const floatCloseActionHandler = () => {
    setChangeCategory(prev => ({ ...prev, show: false }));
  };

  const croperCloseHandler = () => {
    setCropImage(prev => ({ ...prev, croppingImge: null }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { action, payload } = changeCategory;

    const { title, description } = formData;
    const { croppedImge: image } = cropImage;

    if (action === "ADD" && (!title || !description || !image))
      return dispatch(showErrorAlert('Please enter all the credentials'));

    if (action === "ADD")
      return dispatch(createAsyncCategory({ title, description, image }));

    if (action === "EDIT")
      return dispatch(editAsyncCategory({ id: payload, title, description, image }));
  };

  return (
    <>
      <GoBack />
      <Container className="bg-white p-3 rounded-2 shadow">
        <div className="col-12 conainer-fluid">
          <Row className='gy-2'>
            <Col lg={4} xs={12} className='d-flex align-items-center'>
              <h3 className='letter-spacing-1 m-0' style={{ fontSize: '24px' }}>
                Category List
              </h3>
            </Col>
            <Col lg={4} xs={12} className='d-flex align-items-center justify-content-center'>
              <SearchBox
                initialValue={''}
                enterKeyword={searchHandle} />
            </Col>
            <Col lg={4} xs={12} className='text-end'>
              <Box sx={{ '& > :not(style)': { m: 1 } }} >
                <Fab
                  onClick={() => {
                    setFormData({
                      title: '',
                      description: '',
                      image: ''
                    });
                    setChangeCategory(prev => ({
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
          </Row>
        </div>

        {loading && !category
          ? <Meta title='Loading... | Lancer' />
          : error
            ? <Meta title='Error | Lancer' />
            : <Meta title='Categories | Lancer' />
        }

        <Table bordered hover responsive
          className='table-sm m-0 mt-3'>
          <thead>
            <tr className="table-active border">
              <th>ID</th>
              <th>TITLE</th>
              <th>DESCRIPTION</th>
              <th>IMAGE</th>
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
              : category?.map(cate => (
                <tr key={cate._id} style={{ verticalAlign: 'center !important' }}>
                  <td>{cate._id}</td>
                  <td><span style={{ whiteSpace: 'nowrap' }}>{cate.title}</span></td>
                  <td><span style={{ whiteSpace: 'nowrap' }}>{cate.description}</span></td>
                  <td className='text-center'>
                    <img style={{ width: '5rem' }} src={cate.image.url} alt={cate.image.url} />
                  </td>
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
                            image: cate.image.url
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
                      <LinkContainer to={`/categories/${cate._id}`}>
                        <Button
                          variant='light'
                          className='us-edit-btn border'>
                          <RemoveRedEyeIcon className='p-0' />
                        </Button>
                      </LinkContainer>
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

        <Col
          xs={12}
          style={{ height: 'fit-content !important' }}
          className='d-flex justify-content-end mt-3'>
          <Paginate
            page={page}
            pages={pages}
            path={search
              ? `/categories/${search}`
              : '/categories'} />
        </Col>

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

                <Form.Group
                  controlId="image">
                  <Form.Label>Image</Form.Label>

                  {(cropImage.croppedImge || formData.image) &&
                    <div className='mb-2'>
                      <Image width='200px'
                        src={cropImage.croppedImge
                          ? URL.createObjectURL(cropImage.croppedImge)
                          : formData.image ? formData.image : ""} />
                    </div>}

                  <Form.Control
                    type="file"
                    name='image'
                    onChange={(e) =>
                      setCropImage(prev => ({ ...prev, croppingImge: e.target.files[0] }))}
                    className='rounded-2 border'
                    accept=".jpg,.jpeg,.png" />
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

        <Portal id='category-confirmBox'>
          <ConfirmBox
            show={confirmBox.show}
            cancelAction={confirmBoxCancelAction}
            confirmAction={confirmBoxConfirmAction}
            message={confirmBox.message} />
        </Portal>

        {cropImage.croppingImge && <Portal id='category-imageCrop'>
          <CropImage
            src={cropImage.croppingImge}
            imageCallback={(img) => setCropImage({ croppingImge: null, croppedImge: img })}
            closeHander={croperCloseHandler} />
        </Portal>}
      </Container>
    </>
  );
};

export default CategoryScreen;