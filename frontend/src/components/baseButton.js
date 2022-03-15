import React from 'react';
import {
  Form,
  Button,
  Typography,
} from 'antd';

import 'antd/dist/antd.min.css';
import './styles/baseButton.css';

const { Title, Text, Link } = Typography;

class BaseButton extends React.Component {
  render() {
    const formItemSyle = {
    };
    
    const buttonStyle = {
      marginLeft: 'auto',
      marginRight: 'auto',
      justifyContent: 'center',
      alignItems: 'center',
      width: 360
    }

    return (
        <Form.Item wrapperCol={{ offset: 8, span: 16, }} style={formItemSyle}>
          <Button style={buttonStyle} type="primary" htmlType="submit" shape="round">{this.props.value}</Button>
        </Form.Item>
    );
  }
}

export default BaseButton;