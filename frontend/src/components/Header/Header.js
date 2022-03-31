import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Navbar, Nav, Container, DropdownButton, Dropdown } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getAdminInfo, logout } from '../../features/Admin/adminSlice';

import Avatar from '@mui/material/Avatar';
import { red } from '@mui/material/colors';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import { getLoadingState } from '../../features/Loading/loadingSlice';


export const Header = () => {
  const dispatch = useDispatch();
  const redirect = useNavigate();

  const { adminInfo } = useSelector(getAdminInfo);
  const loading = useSelector(getLoadingState);

  const logoutHandler = () => {
    dispatch(logout());
    redirect('/login');
  };

  return (
    <header className='bg-white'>
      <Navbar bg='white' variant='' expand='md' collapseOnSelect
        className="shadow py-0 px-4">
        <Container fluid>
          <LinkContainer to="/">
            <Navbar.Brand className="brand-text">
              <span>L</span>ancer
            </Navbar.Brand>
          </LinkContainer>

          <Navbar.Toggle
            aria-controls='basic-navbar-nav'
            className='p-1 rounded-1'>
            <i className="fas fa-bars us-navToggler"></i>
          </Navbar.Toggle>

          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className="justify-content-end w-100">
              <Nav.Item>
                <LinkContainer to='/'>
                  <Nav.Link>Dashboard</Nav.Link>
                </LinkContainer>
              </Nav.Item>
              <Nav.Item>
                <LinkContainer to='/users'>
                  <Nav.Link eventKey="link-1">Users</Nav.Link>
                </LinkContainer>
              </Nav.Item>
              <Nav.Item>
                <LinkContainer to='/payments'>
                  <Nav.Link eventKey="link-2">Payments</Nav.Link>
                </LinkContainer>
              </Nav.Item>
              <Nav.Item>
                <LinkContainer to='/categories'>
                  <Nav.Link eventKey="link-3">Categories</Nav.Link>
                </LinkContainer>
              </Nav.Item>
              <Nav.Item>
                <DropdownButton align="end"
                  title={<Avatar sx={{ bgcolor: red[400] }}
                    className='shadow'>
                    {adminInfo.name.substring(0, 1)}
                  </Avatar>}
                  id="dropdown-menu-align-end"
                  className='text-dark nav-drop prfile px-0 mx-0 py-lg-0 us-ml'>
                  <LinkContainer to="/profile">
                    <Dropdown.Item>Profile</Dropdown.Item>
                  </LinkContainer>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={logoutHandler}>
                    LogOut
                  </Dropdown.Item>
                </DropdownButton>
              </Nav.Item>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {loading && <Box sx={{ width: '100%' }}>
        <LinearProgress />
      </Box>}

    </header >
  );
};
