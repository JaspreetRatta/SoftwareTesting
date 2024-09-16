import React from "react";
import { Form, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { ShowLoading, HideLoading } from "../redux/alertsSlice";
import intro from "../resourses/intro.png";
import Nav from "../components/Navbar2";
import "./Register.css"; 

function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onFinish = async (values) => {
    try {
      dispatch(ShowLoading());
      const response = await axios.post("/api/users/register", values);
      dispatch(HideLoading());
      if (response.data.success) {
        message.success(response.data.message);
        navigate("/login");
      } else {
        message.error(response.data.message);
        console.log(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  return (
  
    <>
    
      <div className="register-container">
      <div className="register-form-container">
        <h1 className="register-heading">Register</h1>
        <hr />

        <div className="logo-container">
          <img src={intro} alt="Logo" className="logo-image" />
        </div>

        <Form layout="vertical" onFinish={onFinish} className="register-form">
          <Form.Item label="Name" name="name">
            <input type="text" className="input-field" />
          </Form.Item>
          <Form.Item label="Email" name="email">
            <input type="text" className="input-field" />
          </Form.Item>
          <Form.Item label="Password" name="password">
            <input type="password" className="input-field" />
          </Form.Item>
          <div className="form-actions">
            <Link to="/login" className="login-link">
              Click Here To Login
            </Link>
            <button className="register-button" type="submit">
              Register
            </button>
          </div>
        </Form>
      </div>
    </div>
    </>
  );
}

export default Register;
