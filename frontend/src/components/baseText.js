import React from 'react';
import {
    Typography
} from 'antd';

import 'antd/dist/antd.min.css';
import './styles/baseText.css';

const { Title, Text, Link } = Typography;

class BaseInput extends React.Component {
    render() {
        return(
            <h1>{this.props.inside}</h1>
        );
    }
}

export default BaseInput;