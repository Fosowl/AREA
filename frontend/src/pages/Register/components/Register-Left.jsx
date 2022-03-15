import React from 'react'

// import assets
import RegisterWhite from '../../../assets/img/register_white.png';
import RegisterDark from '../../../assets/img/register_dark.png';

// mui imports
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
    PageContainer: {
        width: '100%',
        minHeight: '100%',
        background: '#B60000',
    },
    registerImg: {
        maxWidth: '75%',
    },
    registerText: {
        maxWidth: '75%',
        marginBottom: '75px'
    }
});

const RegisterLeft = () => {
    const classes = useStyles();

    return (
        <Grid container bgcolor="darkgreen.main" justifyContent="center" alignItems="center" direction="column" className={classes.PageContainer}>
            <img className={classes.registerImg} src={RegisterWhite} alt="signin"/>
        </Grid>
    )
}

export default RegisterLeft;