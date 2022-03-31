import React, { useEffect, useRef } from 'react';
import Alert from '@mui/material/Alert';
import { useDispatch } from 'react-redux';
import { hideAlert } from '../../features/MainAlert/mainAlertSlice';

export const MainAlert = ({ variant, message }) => {
  const ref = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    const alert = ref.current;
    setTimeout(() => alert.style.top = '6%', 0);

    const time = setTimeout(() => {
      dispatch(hideAlert());
    }, 2000);

    return () => clearTimeout(time);
  });

  return (
    <Alert severity={variant}
      className='position-fixed shadow rounded-2 col-xl-3 col-md-5 col-11 text-center'
      ref={ref}
      style={{
        top: '-10%',
        left: '50%',
        transform: 'translate(-50%, 0%)',
        transition: 'all 0.5s ease',
        opacity: '0.75',
        zIndex: '99999'
      }}>
      {message}
    </Alert>
  );
};

MainAlert.defaultProps = {
  variant: 'info',
};
