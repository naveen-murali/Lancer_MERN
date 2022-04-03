import React, { useEffect, useRef, useState } from 'react';
import { CloseButton } from 'react-bootstrap';

import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import { getLoadingState } from '../../features/Loading/loadingSlice';
import { useSelector } from 'react-redux';

export const FloatItem = ({ show, closeAction, children }) => {
    const [state, setState] = useState(false);
    const [showCard, setShowCard] = useState(false);
    const ref = useRef();
    const loading = useSelector(getLoadingState);

    useEffect(() => {
        let time1;
        let time2;
        if (show) {
            setState(true);
            time1 = setTimeout(() => {
                setShowCard(true);
            }, 0);
        } else {
            time1 = setTimeout(() => {
                setShowCard(false);
            }, 0);
            time2 = setTimeout(() => {
                setState(false);
            }, 340);
        }

        return () => {
            clearTimeout(time1);
            clearTimeout(time2);
        };
    }, [show]);

    return (
        <div ref={ref}
            className={state ? 'confirmAlert show p-3' : 'confirmAlert p-3'}>
            <div className={`col-12 col-sm-6 col-lg-4 col-xl-3 border-0 position-relative rounded-2 shadow confrimAlert-card bg-white ${showCard ? 'show' : 'hide'}`}>
                <div className='border-0 rounded-2'
                    style={{ overflow: 'hidden' }}>
                    {loading && <Box sx={{ width: '100%' }}>
                        <LinearProgress />
                    </Box>}
                </div>
                <div className='p-3'>
                    {children}

                    <span
                        className='position-absolute bg-white shadow p-1 d-flex align-items-center justify-content-center'
                        style={{
                            top: '-2%',
                            right: '-2.5%',
                            borderRadius: '50%',
                            opacity: '0.9'
                        }}
                        onClickCapture={closeAction}>
                        <CloseButton style={{ fontSize: '12px' }} />
                    </span>
                </div>
            </div>
        </div>
    );
};
