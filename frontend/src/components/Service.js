import * as React from 'react';
import { makeStyles } from '@material-ui/core';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { BorderColor } from '@mui/icons-material';

const useStyles = makeStyles({
  Grid: {
    marginTop: '50px',
    marginLeft: '15%',
    marginRight: '15%'
  },

  NameTxt: {
    display: 'inline-block',
    textDecorationLine: 'underline',
    marginBottom: '30px',
    color: '#111',
    fontFamily: 'Helvetica Neue',
    fontSize: '36px',
    fontWeight: 'bold',
    letterSpacing: '-1px',
    lineHeight: '1',
    textAlign: 'center'
  },

  DescrTxt: {
    textAligh: 'justify',
    color: 'black',
    fontFamily: 'Verdana',
    fontSize: '24px',
    lineHeight: '26px',
    textIndent: '30px',
    margin: 0
  },

  Line: {
    marginTop: '35px',
    borderTop: '1px'
  }
});

export default function Services(props) {
  const { name, description } = props;
  const classes = useStyles();

  return (
    <li>
      <Grid className={classes.Grid}>
        <p className={classes.NameTxt}>
              {name} :
        </p>
        <p className={classes.DescrTxt}>
              {description}
        </p>
      <hr className={classes.Line}></hr>
      </Grid>
    </li>
  );
}