import React, {useState} from 'react'

// mui imports
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import { Button, TextField, InputAdornment} from '@mui/material';
import { makeStyles } from "@mui/styles";
import HomeIcon from '@mui/icons-material/Home';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import passwordValidator from "password-validator";
import emailValidator from "email-validator";
import { toast } from 'react-toastify';
import api from 'api/Api';
import { useNavigate } from "react-router-dom";

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

var schema = new passwordValidator();
schema
    .is().min(8)                                    // Minimum length 8
    .is().max(100)                                  // Maximum length 100
    .has().uppercase()                              // Must have uppercase letters
    .has().lowercase()                              // Must have lowercase letters
    .has().digits(1)                                // Must have at least 2 digits
    .has().not().spaces()                           // Should not have spaces

const RegisterRight = () => {
    const classes = useStyles();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [pseudo, setPseudo] = useState("");
    const [fName, setFname] = useState("");
    const [lName, setLname] = useState("");
    const [showPassword, setShow] = useState(false)

    const onRegister = () => {

        if (!pseudo)
        {
            return toast.error("Pseudo field cannot be empty")
        }

        if (!fName)
        {
            return toast.error("First Name field cannot be empty")
        }

        if (!lName)
        {
            return toast.error("Last Name field cannot be empty")
        }

        if (!emailValidator.validate(email))
        {
            return toast.error("Invalid Email")
        }

        const validate = schema.validate(password, { details: true })
        if (validate.length > 0)
        {
            validate.forEach((value) => {
                toast.error(value.message)
            })
            return
        }

        const promise = api.oauth.register(pseudo, fName, lName, email, password, confirmPassword)
        toast.promise(
            promise,
            {
                pending: 'Wait...',
                success: 'Register Succes, a confirmation email has just been sent 👌',
                error: {
                    render: ({data: { message }}) => {
                        let msg;
                        if (message.email)
                        {
                            msg = message.email
                        }
                        else if (message.password)
                        {
                            msg = message.password
                        }
                        else
                            msg = message
                        return msg
                    }
                }
            }
        ).then(() => {
            navigate("/login")
        })
    }

      return (
        <>
            <Grid container backgroundColor="light.main" justifyContent="center" direction="column" alignItems="center" className={classes.PageContainer}>
                {/* <Grid item className={classes.GoBackHome}>
                    <Link href="/" underline="none">
                        <Typography sx={{fontSize: {lg: '2rem', sm: '1.6rem', xs: '1.6rem'}}} className={classes.backHome} style={{marginRight: '10px'}} variant="h4" color="primary"><HomeIcon style= {{ fontSize: 35, marginRight: '15px'}}/>Go Home</Typography>
                    </Link>
                </Grid> */}
                <Grid item className={classes.signinHeader}>
                    <Typography sx={{fontSize: {lg: '3.8rem', md: '2.8rem', sm: '2.5rem', xs: '2.1rem' }}} variant="h1" color="darkgreen.main">Sign Up</Typography>
                </Grid>
                <Grid item className={classes.isAccount}>
                    <Typography sx={{fontSize: {lg: '2rem', md: '1.7rem', sm: '1.5rem', xs: '1rem' }}} style={{marginRight: '10px'}} variant="h4" color="">Have an account ?</Typography>
                    <Link href="/login" underline="none">
                        <Typography style={{ textDecoration: 'underline' }} sx={{':hover': { transition: '0.3s ease-out'}, fontSize: {lg: '2rem', md: '1.7rem', sm: '1.5rem', xs: '1rem' }}} fontWeight="bold" variant="h4" className={classes.link}> Sign In</Typography>
                    </Link>
                </Grid>
                <Grid item className={classes.formContaineer}>
                    <form className={classes.formSignin} >
                        <TextField
                            label="pseudo"
                            variant="standard"
                            type="text"
                            value={pseudo}
                            InputProps={{
                                classes: {
                                    input: classes.resize,
                                },
                            }}
                            className={classes.signinInput}
                            onChange={e => {
                                setPseudo(e.target.value)
                            }}
                        />
                        <TextField
                            label="firstName"
                            variant="standard"
                            type="text"
                            value={fName}
                            InputProps={{
                                classes: {
                                    input: classes.resize,
                                },
                            }}
                            className={classes.signinInput}
                            onChange={e => {
                                setFname(e.target.value)
                            }}
                        />
                        <TextField
                            label="lastName"
                            variant="standard"
                            type="text"
                            value={lName}
                            InputProps={{
                                classes: {
                                    input: classes.resize,
                                },
                            }}
                            className={classes.signinInput}
                            onChange={e => {
                                setLname(e.target.value)
                            }}
                        />
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
                        <TextField
                            label="Confirm Password"
                            variant="standard"
                            type={"password"}
                            value={confirmPassword}
                            InputProps={{
                                classes: {
                                    input: classes.resize,
                                },
                            }}
                            className={classes.signinInput}
                            onChange={e => {
                                setConfirmPassword(e.target.value);
                            }}
                        />
                        <Button className={classes.buttonSignin} onClick={onRegister}>
                            Sign Up
                        </Button>
                    </form>
                </Grid>
            </Grid>
        </>
    )
}

export default RegisterRight;
