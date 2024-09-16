import React, { useState } from "react";
import {
  Button,
  Form,
  Input,
  DatePicker,
  Upload,
  Typography,
  Card,
  Tooltip,
  Row,
  Col,
  Divider,
  Modal,
  Alert
} from "antd";
import { useDispatch } from "react-redux";
import { UploadOutlined } from '@ant-design/icons';
import { InfoCircleOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import axios from "axios";
import heroimg11 from "../resourses/images/hero-img11.jpg";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";
import "../resourses/addmemory.css";

const { TextArea } = Input;
const { Title, Text } = Typography;

function AddMemory() {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState([])
  const [message, setMessage] = useState(null);

  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();

      if (fileList.length > 0) {
        const files = fileList.map((image) => image.originFileObj)
        for (let file of files) {
          formData.append('images', file);
        }
      }

      formData.append('title', values.title);
      formData.append('location', values.location);
      formData.append('date', values.date);
      formData.append('description', values.description);
      // Append other profile fields to the formData

      dispatch(ShowLoading());
      const response = await axios.post(`/api/memories/add-memory`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.data.success) {
        setMessage(response.data.message)
        setFileList([])
        form.resetFields()
        dispatch(HideLoading());
      }

    } catch (error) {
      // Handle error
      console.error("Error deleting Update Profile:", error);
    }
  };

  const handleCancel = () => setPreviewOpen(false);
  const handlePreview = async (event) => {
    const file = event.originFileObj
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setPreviewImage(reader.result);
      setPreviewOpen(true);
      setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };
  };

  const handleChange = ({ fileList: newFileList }) => {
    newFileList = newFileList.map(x => ({ ...x, status: "done" }))
    setFileList(newFileList);
  }
  const uploadButton = (
    <div>
      <UploadOutlined />
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
    <Row className="add-memory-container" gutter={16}>
      <Col xs={24} md={12}>
        <Card className="add-memory-card" bordered={false}>
          <Title level={2} style={{ color: "#3A7BDB" }}>Add a New Memory</Title>
          <Text type="secondary">Fill in the details of your memory below.</Text>
          {message && <Alert message={message} type="success" closable onClose={() => setMessage(null)} />}
          <Divider />
          <Form
            layout="vertical"
            onFinish={handleSubmit}
            form={form}
          >
            <Form.Item
              label="Title"
              name="title"
              rules={[{ required: true, message: "Please input the title!" }]}
            >
              <Input placeholder="Title" />
            </Form.Item>

            <Form.Item
              label="Location"
              name="location"
              rules={[{ required: true, message: "Please input the location!" }]}
            >
              <Input placeholder="Location" />
            </Form.Item>

            <Form.Item label="Date" name="date" rules={[{ required: true, message: "Please input the Date!" }]}>
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              label="Description"
              name="description"
              rules={[
                { required: true, message: "Please input the description!" },
              ]}
            >
              <TextArea rows={4} placeholder="Description" />
            </Form.Item>
            <br />
            <Form.Item
              label={
                <span>
                  Upload Images&nbsp;
                  <Tooltip title="Supported formats: jpg, jpeg, png. Maximum size: 9MB.">
                    <InfoCircleOutlined style={{ color: "rgba(0,0,0,.45)" }} />
                  </Tooltip>
                </span>
              }
              name="images"
            >

              <Upload
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
                accept="image/*"
              >
                {fileList.length >= 15 ? null : uploadButton}
              </Upload>
              <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
              </Modal>
            </Form.Item>
            <br></br>
            <Form.Item>
              <Button type="primary" htmlType="submit" size="large" block>
                Add Memory
              </Button>
            </Form.Item>
            <Link to="/client/src/Diary/MemoryList" className="my-memorylist-link">
              View My Memory List
            </Link>
          </Form>

        </Card>
      </Col>
      <Col xs={24} md={12}>
        <img src={heroimg11} alt="Memory" className="hero-image" />
      </Col>
    </Row>
  );
}

export default AddMemory;

