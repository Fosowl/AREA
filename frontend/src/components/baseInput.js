import React from 'react';
import {
  Form,
  Input,
  Typography,
} from 'antd';

import 'antd/dist/antd.min.css';
import './styles/baseInput.css';

const { Title, Text, Link } = Typography;

class BaseInput extends React.Component {
  render() {
    const formItemSyle = {
    };

    const textStyle = {
      textAlign: 'left'
    }

    const inputStyle = {
      width: 400
    }
  
    return (
    <Form.Item name={this.props.value}
      rules={[
        {
          required: false,
          message: 'Input your ' + this.props.value + '!',
        },
    ]} style={formItemSyle}>
      <Text style={textStyle}>{this.props.value}</Text>
      <Input style={inputStyle}/>
    </Form.Item>
    );
  }
}

export default BaseInput;