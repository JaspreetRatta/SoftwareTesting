import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  useParams, useNavigate
} from "react-router-dom";
import {
  Card, Spin, Alert, Button, Form, Input, notification,
  Modal, Popconfirm, Space, Avatar, DatePicker, Carousel
} from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import moment from 'moment';

const ShowMore = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [memories, setMemories] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [edit, setEdit] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
  });
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const fetchMemoriesById = async () => {
      try {
        const response = await axios.get(`/api/memories/get-memory-by-id/${id}`);
        setMemories(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching memory details:", error);
        setError(error);
        setLoading(false);
      }
    };
    fetchMemoriesById();
  }, [id]);

  const handleDelete = async () => {
    try {
      const response = await axios.post("/api/memories/delete-memory", { _id: id });
      notification.success({ message: response.data.message });
      navigate(-1, { replace: true });
    } catch (error) {
      console.error("Error deleting memory:", error);
      notification.error({ message: "Error deleting memory!" });
    }
  };

  const handleEdit = async () => {
    try {
      const response = await axios.post("/api/memories/update-memory", {
        _id: id,
        title: edit.title ? edit.title : memories?.title,
        description: edit.description ? edit.description : memories?.description,
        date: edit.date ? edit.date : memories?.date,
        location: edit.location ? edit.location : memories?.location,
      });
      notification.success({ message: response.data.message });
      setMemories(edit)
    } catch (error) {
      console.error("Error updating memory:", error);
      notification.error({ message: "Error updating memory!" });
    }
  };

  const showModal = () => {
    setEdit(memories)
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    await handleEdit();
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "2rem", gap: "2rem" }}>
      {loading ? (
        <Spin tip="Loading..." />
      ) : error ? (
        <Alert message={`Error: ${error.message}`} type="error" />
      ) : (
        <Space direction="vertical" size="large" align="center">
          <Card
            style={{ width: 950 }}
            cover={
              <Carousel autoplay>
                {memories?.images.map((col, index) => (
                  <div>
                    <img className="img-showmore" alt="..." src={col} />
                  </div>
                ))}

              </Carousel>
            }
            actions={[
              <Popconfirm
                title="Are you sure to delete this memory?"
                onConfirm={handleDelete}
                okText="Yes"
                cancelText="No"
              >
                <Button type="primary" icon={<DeleteOutlined />} danger>
                  Delete
                </Button>
              </Popconfirm>,
              <Button type="default" icon={<EditOutlined />} onClick={showModal}>
                Edit
              </Button>,
            ]}
          >
            <Card.Meta
             
              title={memories?.title}
              description={(
                <>
                  <p><strong>Location:</strong> {memories?.location}</p>
                  <p><strong>Description:</strong></p>
                  <Input.TextArea
                    value={memories?.description}
                    autoSize={{ minRows: 3, maxRows: 10 }}
                    readOnly
                    bordered={false}
                    style={{ width: '100%', resize: 'none', color: 'rgba(0, 0, 0, 0.65)' }}
                  />
                  <p><strong>Date:</strong> {new Date(memories?.date).toLocaleDateString()}</p>
                </>
              )}
            />
          </Card>

          <Modal title="Edit Memory" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
            <Form layout="vertical">
              <Form.Item label="Title">
                <Input
                  value={edit.title}
                  onChange={(e) => setEdit({ ...edit, title: e.target.value })}
                />
              </Form.Item>
              <Form.Item label="Location">
                <Input
                  value={edit.location}
                  onChange={(e) => setEdit({ ...edit, location: e.target.value })}
                />
              </Form.Item>
              <Form.Item label="Date">
                <DatePicker
                  format="YYYY-MM-DD"
                  value={edit.date ? moment(edit.date) : (memories ? moment(memories.date) : null)}
                  onChange={(date, dateString) => setEdit({ ...edit, date: dateString })}
                />
              </Form.Item>
              <Form.Item label="Description">
                <Input.TextArea
                  value={edit.description}
                  onChange={(e) => setEdit({ ...edit, description: e.target.value })}
                  autoSize={{ minRows: 6, maxRows: 10 }}
                />
              </Form.Item>
            </Form>
          </Modal>
        </Space>
      )}
    </div>
  );
};

export default ShowMore;
