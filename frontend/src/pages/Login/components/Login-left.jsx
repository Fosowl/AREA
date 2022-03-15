import React, { useState } from 'react'

// mui imports
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import { Button, TextField, InputAdornment} from '@mui/material';
import { makeStyles } from "@mui/styles";
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import HomeIcon from '@mui/icons-material/Home';
import api from 'api/Api';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import emailValidator from "email-validator";

const useStyles = makeStyles(theme => ({
    PageContainer: {
        width: '100%',
        minHeight: '100vh',
        paddingBottom: '20px',
        position: 'relative'
    },
    signinHeader: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: '50px'
    },
    isAccount: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    GoBackHome: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginBottom: '50px',
        marginRight: '300px',
        verticalAlign: 'middle',
        position: 'absolute',
        top: '25px',
        left: '20px',
        width: '100%'

    },
    backHome: {
        display: 'flex',
        alignItems: 'center',
        '&:hover': {
            color: '#121212',
            transition: '.3s'
        },
        color: '#B60000',
    },
    link: {
        '&:hover': {
            color: '#121212',
            transition: '.3s'
        },
        color: '#B60000',
    },
    formContaineer: {
        width: '100%',
    },
    formSignin: {
        width: '100%',
        marginTop: '50px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    buttonSignin: {
        '&:hover': {
            opacity: .8,
            backgroundColor: '#B60000',
            transition: '.3s'
        },
        width: '40%',
        color: '#F9F9FB',
        marginTop: '50px',
        padding: '20px',
        backgroundColor: '#B60000',
        borderRadius: '15px',
        fontWeight: 'bold',
        /**[theme.breakpoints.down('md')]: {
            width: '80%',
            marginTop: '15px',
            fontSize: '1.1rem',
            padding: '15px',
        },**/
        fontSize: '1.5rem'
    },
    signinInput: {
        width: '75%',
        marginBottom: '25px',
        /**[theme.breakpoints.down('md')]: {
            width: '90%',
        },**/
      },
    resize: {
        /**[theme.breakpoints.down('md')]: {
            fontSize: '1.1rem'
        },**/
        "& label.Mui-focused": {
            color: "#69A38E"
          },
          "& .MuiInput-underline:after": {
            borderBottomColor: "#295C3C"
          },
          "& .MuiFilledInput-underline:after": {
            borderBottomColor: "#295C3C"
          },
          "& .MuiOutlinedInput-root": {
            "&.Mui-focused fieldset": {
              borderColor: "#295C3C"
            }
          },
        fontSize: '1.5rem',
    },
}));

const LoginLeft = () => {
    const classes = useStyles()
    const navigate = useNavigate();

    const [email, setEmail] = useState(undefined);
    const [password, setPassword] = useState("");
    const [showPassword, setShow] = useState(false)

    const onLogin = () => {
        if (!emailValidator.validate(email))
        {
            return toast.error("Invalid Email")
        }

        if (!password)
        {
            return toast.error("Password cannot be empty")
        }

        const promise = api.oauth.login(email, password)
            .then((acc) => {
                console.log("success");
                localStorage.setItem("token", acc.id);
            });

        toast.promise(
            promise,
            {
                pending: 'Wait...',
                success: 'Login Succes 👌',
                error: 'Invalid Mail/Password 🤯'
            }
        ).then(() => {
            navigate("/home")
        })
    }

    return (
        <Grid container backgroundColor="light.main" justifyContent="center" direction="column" alignItems="center" className={classes.PageContainer}>
            {/* <Grid item className={classes.GoBackHome}>
                <Link href="/" underline="none">
                    <Typography sx={{fontSize: {lg: '2rem', sm: '1.6rem', xs: '1.6rem'}}} className={classes.backHome} style={{marginRight: '10px'}} variant="h4" color="primary"><HomeIcon style= {{ fontSize: 35, marginRight: '15px'}}/>Go Home</Typography>
                </Link>
            </Grid> */}
            <Grid item className={classes.signinHeader}>
                <Typography sx={{fontSize: {lg: '3.8rem', md: '2.8rem', sm: '2.5rem', xs: '2.1rem' }}} variant="h1" color="darkgreen.main">Sign In</Typography>
            </Grid>
            <Grid item className={classes.isAccount}>
                <Typography sx={{fontSize: {lg: '2rem', md: '1.7rem', sm: '1.5rem', xs: '1rem' }}} style={{marginRight: '10px'}} variant="h4" color="">Don't have an account ?</Typography>
                <Link href="/register" underline="none">
                    <Typography style={{ textDecoration: 'underline' }} sx={{':hover': { transition: '0.3s ease-out'}, fontSize: {lg: '2rem', md: '1.7rem', sm: '1.5rem', xs: '1rem' }}} fontWeight="bold" variant="h4" className={classes.link}> Sign Up</Typography>
                </Link>
            </Grid>
            <Grid item className={classes.formContaineer}>
                <form className={classes.formSignin} >
                    <TextField
                        label="Email"
                        variant="standard"
                        type="email"
                        value={email}
                        InputProps={{
                            classes: {
                                input: classes.resize,
                            },
                        }}
                        className={classes.signinInput}
                        onChange={e => {
                            setEmail(e.target.value)
                        }}
                    />
                    <TextField
                        label="Password"
                        variant="standard"
                        type={showPassword?"text":"password"}
                        value={password}
                        InputProps={{
                            classes: {
                                input: classes.resize,
                            },
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => setShow(!showPassword)}
                                        >
                                        {showPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                        className={classes.signinInput}
                        onChange={e => {
                            setPassword(e.target.value);
                        }}
                    />
                    <Button className={classes.buttonSignin} onClick={onLogin} >
                        Sign In
                    </Button>
                </form>
            </Grid>
        </Grid>
    )
}

export default LoginLeft;