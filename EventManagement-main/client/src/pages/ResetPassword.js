import React from "react";
import { Form, message } from "antd";
import { useDispatch } from "react-redux";
import axios from "axios";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";

function ResetPassword() {
  const dispatch = useDispatch();

  const onFinish = async (values) => {
    try {
      dispatch(ShowLoading());
      // Send a request to your API to reset the password
      // using the provided email and new password
      const response = await axios.post("/api/users/reset-password", values);
      dispatch(HideLoading());
      if (response.data.success) {
        message.success(response.data.message);
        // Redirect the user to the login page
        window.location.href = "/login";
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  return (
    <div className="h-screen d-flex justify-content-center align-items-center">
      <div className="w-400 card p-3">
        <h1 className="text-lg">Reset Password</h1>
        <hr />
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="Email" name="email">
            <input type="text" />
          </Form.Item>
          <Form.Item label="New Password" name="password">
            <input type="password" />
          </Form.Item>
        
          <div className="d-flex justify-content-between align-items-center">
            <button className="secondary-btn" type="submit">
              Reset Password
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default ResetPassword;
