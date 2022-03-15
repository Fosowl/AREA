import React from 'react'

// import assets
import LoginWhite from '../../../assets/img/login_white.png';
import LoginDark from '../../../assets/img/login_dark.png';

// mui imports
import Grid from '@mui/material/Grid';
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
    PageContainer: {
        width: '100%',
        minHeight: '100%',
        background: '#B60000',
    },
    loginImg: {
        maxWidth: '60%',
        marginBottom: '75px'
    },
    loginText: {
        maxWidth: '60%',
    },
});

const LoginRight = () => {
    const classes = useStyles();

    return (
        <Grid container justifyContent="center" alignItems="center" direction="column" className={classes.PageContainer}>
            <img className={classes.loginImg} src={LoginWhite} alt="signin"/>
        </Grid>
    )
}

export default LoginRight;
