import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { PlusOutlined } from "@ant-design/icons";
import {
  Form,
  Input,
  Button,
  Upload,
  Col,
  Row,
  Typography,
  Card,
  Alert,
  Progress,
  Tag,
  Divider,
  Spin,
} from "antd";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";
import WorkerLayout from "./WorkerLayout";
import { axiosInstance } from "../helpers/axiosInstance";

const { Title } = Typography;

function WorkerProfile() {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [worker, setWorker] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState(null);
  const [performance, setPerformance] = useState(null);
  const [taskProgress, setTaskProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    onGetWorkerProfile();
    onGetWorkerPerformance();
  }, []);

  const onGetWorkerProfile = async () => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.post("/api/users/get-user-by-id", {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.data.success) {
        const worker = response.data.data;
        setProfilePicture(worker.profilePicture);
        setWorker(worker);
        setTaskProgress(calculateTaskProgress(worker.assignedTasks));
      }
      dispatch(HideLoading());
      setLoading(false);
    } catch (error) {
      dispatch(HideLoading());
      setLoading(false);
    }
  };

  const onGetWorkerPerformance = async () => {
    try {
      const response = await axiosInstance.get("/api/workers/performance");
      setPerformance(response.data.data);
      setTaskProgress(calculateTaskProgress(response.data.data));
    } catch (error) {
      console.error("Failed to fetch performance:", error);
    }
  };

  const calculateTaskProgress = (tasks) => {
    if (!tasks || tasks.length === 0) return 0;
    const completedTasks = tasks.completedTasks;
    const totalTasks = tasks.totalTasks;

    return totalTasks > 0 ? Math.floor((completedTasks / totalTasks) * 100) : 0;
  };

  const handleProfileUpdate = async (values) => {
    try {
      const formData = new FormData();
      if (file) formData.append("profilePicture", file);
      if (values.name) formData.append("name", values.name);
      if (values.email) formData.append("email", values.email);
      if (values.password_new) formData.append("password", values.password_new);
  
      dispatch(ShowLoading());
  
      const response = await axiosInstance.put(`/api/profile/${worker._id}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });
  
      if (response.data.success) {
        setMessage(response.data.message);
  
        // Update the worker state with the new values
        setWorker((prevWorker) => ({
          ...prevWorker,
          name: values.name || prevWorker.name,
          email: values.email || prevWorker.email,
          profilePicture: profilePicture || prevWorker.profilePicture,
        }));
  
        // Set updated values in the form fields
        form.setFieldsValue({
          name: values.name || worker.name,
          email: values.email || worker.email,
        });
  
        dispatch(HideLoading());
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      dispatch(HideLoading());
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
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  if (loading) {
    return <Spin size="large" style={{ display: "block", margin: "100px auto" }} />;
  }

  return (
    <WorkerLayout>
      <Card className="profile-card" bordered={false} style={{ maxWidth: "800px", margin: "auto" }}>
        <Title level={2} style={{ color: "#3A7BDB" }}>
          Worker Profile
        </Title>
        {message && (
          <Alert message={message} type="success" closable onClose={() => setMessage(null)} />
        )}
        {worker && (
          <Form form={form} initialValues={worker} onFinish={handleProfileUpdate} autoComplete="off">
            <Row gutter={24}>
              <Col span={8}>
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
                    <img
                      src={profilePicture}
                      alt="avatar"
                      style={{
                        width: "185px",
                        height: "185px",
                        borderRadius: "8px",
                      }}
                    />
                  ) : (
                    uploadButton
                  )}
                </Upload>
              </Col>
              <Col span={16}>
                <Form.Item label="Name" name="name" rules={[{ required: true, message: "Please input your name!" }]}>
                  <Input placeholder="Name" />
                </Form.Item>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[{ required: true, message: "Please input your email!" }]}
                >
                  <Input placeholder="Email" />
                </Form.Item>
                <Form.Item label="Password" name="password_new">
                  <Input type="password" placeholder="New Password (optional)" />
                </Form.Item>
                <Button type="primary" htmlType="submit" style={{ marginTop: "1rem" }} block>
                  Update Profile
                </Button>
              </Col>
            </Row>

            <Divider />

            <Row gutter={24} style={{ marginTop: "1.5rem" }}>
              <Col span={12}>
                <Title level={4}>Task Progress</Title>
                <Progress
                  percent={taskProgress}
                  format={(percent) => `${percent}%`}
                  status={taskProgress === 100 ? "success" : "active"}
                />
              </Col>
              <Col span={12}>
                <Title level={4}>Performance</Title>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <Tag color="blue">Completed Tasks: {performance?.completedTasks || 0}</Tag>
                  <Tag color="orange">Total Tasks: {performance?.totalTasks || 0}</Tag>
                </div>
              </Col>
            </Row>
          </Form>
        )}
      </Card>
    </WorkerLayout>
  );
}

export default WorkerProfile;
