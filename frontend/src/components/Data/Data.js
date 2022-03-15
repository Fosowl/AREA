import * as React from 'react';

import TimeInput from 'components/TimeInput';
import DateInput from 'components/DateInput';
import StringInput from 'components/StringInput';
import BooleanInput from 'components/BooleanInput';

import './Data.scss'

const DataInput = (props) => {
    const { type, onChange, defaultValue } = props;

    if (type == "time") {
        return <TimeInput onChange={onChange} defaultValue={defaultValue} />
    } else if (type == "date") {
        return <DateInput onChange={onChange} defaultValue={defaultValue} />
    } else if (type == "string") {
        return <StringInput onChange={onChange} defaultValue={defaultValue} />
    } else if (type == "boolean") {
        return <BooleanInput onChange={onChange} defaultValue={defaultValue} />
    }

    console.log("Unknown data type in Data.js");
}

const Data = (props) => {

    const { data, onChange, defaultValue } = props;

    const Test = (event) => {
        let ret = {
            name: data.name
        }
        if (event?.target?.hasOwnProperty('value'))
        {
            ret.value = event.target.value;
        }
        else if (event?.target?.hasOwnProperty('checked'))
        {
            ret.value = event.target.checked;
        }
        else
            ret.value = event;
        onChange(ret)
    }

    return (
        <div className='main'>
            <p className='name'>{data.pretty_name}</p>
            <DataInput type={data.type} onChange={Test} defaultValue={defaultValue} />
            <p className='description'>{data.description}</p>
        </div>
    )
}

export default Data