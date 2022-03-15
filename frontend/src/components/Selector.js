import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete'


function Selector(props) {
  const { Listed, current, stateChanger } = props;

  return (
    <>
      <Autocomplete
        disablePortal
        id="select-box"
        options={Listed}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label={current}/>}
        onChange={(event, value) => {stateChanger(value)}}
      />
    </>
  );
}

export default Selector;
