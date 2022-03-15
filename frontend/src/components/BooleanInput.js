
import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({

});

const BooleanInput = (props) => {
  const { onChange, defaultValue } = props

    const { pretty_name } = props;
    const classes = useStyles();

    return (
        <div>
            <input onChange={onChange} value={defaultValue} type="checkbox" name="boolean"/>
        </div>
    );
}

export default BooleanInput