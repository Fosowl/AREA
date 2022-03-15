import React from 'react'

// import components
import RegisterLeft from './components/Register-Left';
import RegisterRight from './components/Register-Right';

// mui imports
import Grid from '@mui/material/Grid';

function Register() {
    return (
        <Grid container style={{overflow: 'hidden', marginTop: "-9px", marginBottom: "-9px", marginLeft: "-9px"}}>
            <Grid item display={{ xs: "none", md: "block"}} md={6}>
                <RegisterLeft/>
            </Grid>
            <Grid item xs={12} md={6}>
                <RegisterRight/>
            </Grid>
        </Grid>
    )
}

export default Register
