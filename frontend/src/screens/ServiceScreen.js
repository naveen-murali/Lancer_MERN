import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Table, Button, Row, Col, Badge, Image } from 'react-bootstrap';
import { getAsyncServices } from '../features/Services/servicesAction';
import { getServices } from '../features/Services/servicesSlices';

import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

import {
  Meta,
  Message,
  ConfirmBox,
  Portal,
  SearchBox,
  Paginate,
  GoBack,
  Ratings,
} from '../components';

import { LinkContainer } from 'react-router-bootstrap';
import { blockAsyncUser, unblockAsyncUser } from '../features/Users/usersActions';


const ServiceScreen = () => {
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
  const { services, page, pages, error, loading } = useSelector(getServices);

  useEffect(() => {
    dispatch(getAsyncServices({ search, page: pageNumber }));
  }, [dispatch, pageNumber, search]);

  const searchHandle = (search) => {
    if (search)
      redirect(`/services/${search}/page/1`);
    else
      redirect(`/services/page/1`);
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

  useEffect(() => {
    let time;
    if (searchInput !== null)
      time = setTimeout(() => {
        dispatch(getAsyncServices({ search: searchInput }));
      }, 200);

    return () => time && clearTimeout(time);
  }, [searchInput, dispatch]);

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

        {loading && !services.length
          ? <Meta title='Loading... | Lancer' />
          : error
            ? <Meta title='Error | Lancer' />
            : <Meta title='Services | Lancer' />
        }

        <Table bordered hover responsive
          className='table-sm m-0 mt-3'>
          <thead>
            <tr className="table-active border">
              <th>ID</th>
              <th>IMAGE</th>
              <th>TITLE</th>
              <th>DESCRIPTION</th>
              <th><span style={{ whiteSpace: 'nowrap' }}>CREATED AT</span></th>
              <th>RATING</th>
              <th><span style={{ whiteSpace: 'nowrap' }}>IS ACTIVE</span></th>
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
              : services?.map(service => (
                <tr key={service._id} style={{ verticalAlign: 'center !important' }}>
                  <td>{service._id}</td>
                  <td className='text-center'>
                    <Image
                      width={100}
                      src={service.images[0].url}
                      alt={service.images[0]} />
                  </td>
                  <td>{service.title.substring(0, 40)}...</td>
                  <td>{service.description.substring(0, 40)}...</td>
                  <td>
                    <span style={{ whiteSpace: 'nowrap', fontWeight: "600" }}>
                      {moment(service.createdAt).format("MMMM Do, YYYY")}
                    </span>
                  </td>
                  <td>
                    <span style={{ whiteSpace: 'nowrap' }}>
                      <Ratings value={service.rating} />
                    </span>
                  </td>
                  <td>
                    {service.isActive
                      ? <Badge pill bg="success shadow">Active</Badge>
                      : <Badge pill bg="danger shadow">Inactive</Badge>}
                  </td>
                  <td className='text-center'>
                    {service.isBlocked
                      ? (<Badge pill bg="danger">Blocked</Badge>)
                      : (<Badge pill bg="success">Available</Badge>)}
                  </td>
                  <td className='text-center'>
                    <span className='mx-auto' style={{ display: 'inline-flex' }}>
                      <LinkContainer to={`/services/${service._id}`}>
                        <Button
                          variant='light'
                          className='us-edit-btn border'>
                          <RemoveRedEyeIcon className='p-0' />
                        </Button>
                      </LinkContainer>
                      <Button
                        variant={service.isBlocked ? 'success' : 'danger'}
                        className='us-delete-btn border'
                        onClick={() => {
                          setConfirmBox(prev => ({
                            ...prev,
                            show: true,
                            dataHandler: {
                              payload: service._id,
                              action: service.isBlocked ? 'UNBLOCK' : 'BLOCK'
                            },
                            message: `Do you want to ${service.isBlocked ? 'unblock' : 'block'} ${service.title}?`
                          }));
                        }}>
                        {service.isBlocked
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
              ? `/services/${search}`
              : '/services'} />
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

export default ServiceScreen;    