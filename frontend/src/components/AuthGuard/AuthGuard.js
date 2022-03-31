import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { getAdminInfo } from '../../features/Admin/adminSlice';

export const AuthGuard = ({ childern }) => {
    const { adminInfo } = useSelector(getAdminInfo);

    if (!adminInfo)
        return <Navigate to="/login" />;
    else
        return <main className='py-3'>{childern}</main>;

};
