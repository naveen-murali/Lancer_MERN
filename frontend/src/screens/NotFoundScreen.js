import React from 'react';
import { Button } from 'react-bootstrap';
import { Box, styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';

const FlexBox = styled(Box)(() => ({
    display: 'flex',
    alignItems: 'center',
}));

const JustifyBox = styled(FlexBox)(() => ({
    maxWidth: 320,
    flexDirection: 'column',
    justifyContent: 'center',
}));

const IMG = styled('img')(() => ({
    width: '100%',
    marginBottom: '32px',
}));

const NotFoundRoot = styled(FlexBox)(() => ({
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    height: '70vh !important',
}));


const NotFoundScreen = () => {
    const redirect = useNavigate();

    return (
        <NotFoundRoot>
            <JustifyBox>
                <IMG src="/assets/404.svg" alt="" />
                <Button
                    className="btn us-btn-outline"
                    style={{ width: "fit-content" }}
                    onClick={() => redirect(-1)}>
                    Go Back
                </Button>
            </JustifyBox>
        </NotFoundRoot>
    );

};

export default NotFoundScreen;