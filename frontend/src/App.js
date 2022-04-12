import React from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { getAdminInfo } from './features/Admin/adminSlice';

import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import UsersScreen from './screens/UsersScreen';
import PaymentScreen from './screens/PaymentScreen';
import CategoryScreen from './screens/CategoryScreen';

import {
  AuthGuard,
  Footer,
  Header,
  MainAlert,
  Portal
} from './components';
import { getMainAlert } from './features/MainAlert/mainAlertSlice';
import CategoryDetailsScreen from './screens/CategoryDetailsScreen';
import ServiceScreen from './screens/ServiceScreen';
import NotFoundScreen from './screens/NotFoundScreen';


const App = () => {
  const { adminInfo } = useSelector(getAdminInfo);
  const { variant, show, message } = useSelector(getMainAlert);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={adminInfo ? <Navigate to='/' /> : <LoginScreen />} />
          <Route path='/' element={<AuthGuard childern={<HomeScreen />} />} />

          <Route path='/users'>
            <Route path='' element={<AuthGuard childern={<UsersScreen />} />} />
            <Route path='page/:pageNumber' element={<AuthGuard childern={<UsersScreen />} />} />
            <Route path=':search/page/:pageNumber' element={<AuthGuard childern={<UsersScreen />} />} />
          </Route>

          <Route path='/services'>
            <Route path='' element={<AuthGuard childern={<ServiceScreen />} />} />
            <Route path='page/:pageNumber' element={<AuthGuard childern={<ServiceScreen />} />} />
            <Route path=':search/page/:pageNumber' element={<AuthGuard childern={<ServiceScreen />} />} />
          </Route>

          <Route path='/payments' element={<AuthGuard childern={<PaymentScreen />} />} />

          <Route path='/categories'>
            <Route path='' element={<AuthGuard childern={<CategoryScreen />} />} />
            <Route path=':id' element={<AuthGuard childern={<CategoryDetailsScreen />} />} />
            <Route path='page/:pageNumber' element={<AuthGuard childern={<CategoryScreen />} />} />
            <Route path=':search/page/:pageNumber' element={<AuthGuard childern={<CategoryScreen />} />} />
          </Route>

          <Route path='*' element={<AuthGuard childern={<NotFoundScreen />} />} />
        </Routes>

        {adminInfo && <Footer />}
        {adminInfo &&
          <Portal id='lancer-header'>
            <Header />
          </Portal>}

        {show && <Portal>
          <MainAlert variant={variant} message={message} />
        </Portal>}

      </BrowserRouter>
    </>
  );
};

export default App;