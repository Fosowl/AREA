import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@mui/material/TextField';
import TimePicker from '@mui/lab/TimePicker';
import DateTimePicker from '@mui/lab/DateTimePicker';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import MobileDatePicker from '@mui/lab/MobileDatePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

const useStyles = makeStyles({
  InputHolder: {
    width: '100%'
  }
});

const DateInput = (props) => {
  const { onChange, defaultValue } = props

    const classes = useStyles();
    const [value, setValue] = React.useState(defaultValue ? defaultValue : new Date('2021-03-01T21:00:00'));

    const handleChange = (newValue) => {
      setValue(newValue);
      onChange(newValue)
    };

    return (
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DesktopDatePicker
          inputFormat="MM/dd/yyyy"
          value={value}
          onChange={handleChange}
          renderInput={(params) => <TextField {...params} className={classes.InputHolder} />}
        />
      </LocalizationProvider>
    );
}

export default DateInput