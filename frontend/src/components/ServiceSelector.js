import * as React from 'react';
import { TextField, Box } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete'
import { Link } from 'Tools'


function ServiceSelector(props)
{
  const { items, label, defaultValue, onChange, className, classNameTextField } = props;

  return (
    <Autocomplete
      className={className}
      id="selector-item"
      sx={{ width: '100%' }}
      options={items}
      autoHighlight
      getOptionLabel={(option) => option.pretty_name}
      onRemo
      renderOption={(props, option) => (
        <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>

          { option.logo_url &&
            <img
              loading="lazy"
              src={Link[option.name]}
              // srcSet={option.logo_url}
              style={{width: 30, height: 30, resizeMode: 'cover'}}
              alt=""
            />
          }
          
          {option.pretty_name}
        </Box>
      )}
      isOptionEqualToValue={(option, value) => option && value && option.name === value.name}
      value={defaultValue}
      onChange={(event, value) => {onChange(value)}}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          className={classNameTextField}
        />
      )}
    />
  );
}

export default ServiceSelector;
