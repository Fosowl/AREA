import React from 'react';
import { Link } from "react-router-dom";
import { Grid, TextField } from '@mui/material';
import LoginLeft from './components/Login-left';
import LoginRight from './components/Login-right';

//useEffect(() => {
//  const storedTodos = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY))
//  if (storedTodos) setTodos(storedTodos)
//}, [])

//useEffect(() => {
//  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todos))
//}, [todos])
function Login() {
    return (
        <Grid container style={{overflow: 'hidden'}}>
            <Grid item display={{ xs: "none", md: "block"}} md={6}>
                <LoginLeft/>
            </Grid>
            <Grid item xs={12} md={6}>
                <LoginRight/>
            </Grid>
        </Grid>
    )
}

export default Login;