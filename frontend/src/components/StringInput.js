
import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { TextField } from '@mui/material';

const useStyles = makeStyles({
    InputHolder: {
        width: '100%'
    }
});

const inputProps = {
    step: 300,
  };

const StringInput = (props) => {
    const { onChange, defaultValue } = props
    const classes = useStyles();

    return (
        <TextField id="text" type="text" value={defaultValue} onChange={onChange} inputProps={inputProps} className={classes.InputHolder}/>
    );
}

export default StringInput