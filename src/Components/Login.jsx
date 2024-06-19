import React from 'react';
import logo from "../assets/Faith Finity.png";
import { Button, Form, Input } from 'antd';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  
  const onFinish = (values) => {
    const { email, password } = values;
    if (onLogin(email, password)) {
      navigate("/home");
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return ( 
    <div className="login-container">
      <img className="logo" src={logo} />
      <h1>Admin Login</h1>
      <Form 
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 36 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: 'Please input your email!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          wrapperCol={{ offset: 8, span: 16 }}
        >
          <Button style={{ backgroundColor: "#46C81A", fontFamily: "sans-serif" }} type="primary" htmlType="submit">
            Login
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
