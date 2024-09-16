import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { PlusOutlined } from '@ant-design/icons';
import { Form, Input, Button, Upload, Col, Row, Typography, Card, Alert, Progress } from 'antd';
import { HideLoading, ShowLoading } from '../redux/alertsSlice';
import '../resourses/profile.css';

const { Title } = Typography;

function ProfilePage() {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState(null);
  const [coupon, setCoupon] = useState(null);
  // Add other profile fields as needed

  useEffect(() => {
    onGetProfile();
  }, []);
  useEffect(() => {
    onGetCoupon();
  }, [user]);

  const onGetProfile = async () => {
    try {
      dispatch(ShowLoading());
      const response = await axios.post(
        '/api/users/get-user-by-id',
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (response.data.success) {
        const user = response.data.data;
        setProfilePicture(user.profilePicture);
        setUser(user);
      }
    } catch (error) {
      dispatch(HideLoading());
    }
  };

  const onGetCoupon = async () => {
    try {
      const response = await axios.post(
        '/api/coupons/list-coupon',
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      dispatch(HideLoading());
      if (response.data) {
        const coupons = response.data.filter((x) => x.point >= user.point);
        if (coupons.length === 0) {
          setCoupon(response.data[response.data.length - 1]);
        } else {
          setCoupon(coupons[0]);
        }
      }
    } catch (error) {
      dispatch(HideLoading());
    }
  };

  const handleProfileUpdate = async (values) => {
    try {
      const formData = new FormData();
      if (file) formData.append('profilePicture', file);
      if (values.name) formData.append('name', values.name);
      if (values.email) formData.append('email', values.email);
      if (values.password_new) formData.append('password', values.password_new);
      // Append other profile fields to the formData
      dispatch(ShowLoading());
      const response = await axios.put(`/api/profile/${user._id}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.data.success) {
        setMessage(response.data.message);
        form.resetFields();
        dispatch(HideLoading());
      }
      // Handle successful profile update
    } catch (error) {
      // Handle error
      console.error('Error deleting Update Profile:', error);
    }
  };

  const handleChange = (event) => {
    const file = event.file.originFileObj;
    setFile(file);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setProfilePicture(reader.result);
    };
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );

  return (
    <Card className="add-memory-card" bordered={false}>
      <Title level={2} style={{ color: '#3A7BDB' }}>
        Edit Profile
      </Title>
      {message && <Alert message={message} type="success" closable onClose={() => setMessage(null)} />}
      {user && (
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={user}
          form={form}
          onFinish={handleProfileUpdate}
          autoComplete="off"
        >
          <div style={{ paddingTop: '1rem', margin: 'auto' }}>
            <Row style={{ marginBottom: '1rem' }}>
              
            </Row>
            <Row justify="start">
              <Col span={3} offset={3}>
                <Title level={4}>Profile Picture</Title>
                <Upload
                  name="avatar"
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  onChange={handleChange}
                  accept="image/*"
                >
                  {profilePicture ? (
                    <img src={profilePicture} alt="avatar" style={{ width: '185px', height: '185px', borderRadius: '8px' }} />
                  ) : (
                    uploadButton
                  )}
                </Upload>
              </Col>
              <Col span={12} style={{ textAlign: 'center' }}>
                <Form.Item
                  label="Name"
                  name="name"
                  va
                  style={{ paddingTop: '1rem' }}
                  rules={[{ required: true, message: 'Please input your name!' }]}
                >
                  <Input placeholder="Name" />
                </Form.Item>
                <Form.Item
                  label="Email"
                  name="email"
                  style={{ paddingTop: '1rem' }}
                  rules={[{ required: true, message: 'Please input your email!' }]}
                >
                  <Input placeholder="email" />
                </Form.Item>
                <Form.Item label="Password" name="password_new" style={{ paddingTop: '1rem' }}>
                  <Input type="password" />
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                  <Button type="primary" htmlType="submit" style={{ marginTop: '1rem', float: 'right' }} size="large" block>
                    Update Profile
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </div>
        </Form>
      )}
    </Card>
  );
}

export default ProfilePage;
