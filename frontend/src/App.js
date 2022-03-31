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


const App = () => {
  const { adminInfo } = useSelector(getAdminInfo);
  const { variant, show, message } = useSelector(getMainAlert);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={adminInfo ? <Navigate to='/' /> : <LoginScreen />} />
          <Route path='/' element={<AuthGuard childern={<HomeScreen />} />} />

          <Route path='/users' element={<AuthGuard childern={<UsersScreen />} />} />
          <Route path='/users/page/:pageNumber' element={<AuthGuard childern={<UsersScreen />} />} />
          <Route path='/users/:search/page/:pageNumber' element={<AuthGuard childern={<UsersScreen />} />} />

          <Route path='/payments' element={<AuthGuard childern={<PaymentScreen />} />} />

          <Route path='/categories' element={<AuthGuard childern={<CategoryScreen />} />} />
          <Route path='/categories/page/:pageNumber' element={<AuthGuard childern={<CategoryScreen />} />} />
          <Route path='/categories/:search/page/:pageNumber' element={<AuthGuard childern={<CategoryScreen />} />} />

          <Route path='/categories/:id' element={<AuthGuard childern={<CategoryDetailsScreen />} />} />
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