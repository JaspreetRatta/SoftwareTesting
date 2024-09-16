import React, { useEffect, useState } from "react";
import { Col, Form, message, Modal, Row, Select, Input } from "antd";
import { axiosInstance } from "../helpers/axiosInstance";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";

function WorkerForm({
  showWorkerForm,
  setShowWorkerForm,
  selectedWorker,
  setSelectedWorker,
  getWorkers,
}) {
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // To handle search

  // Fetch users who are not workers (isWorker: false)
  const getUsers = async () => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.post("/api/users/get-all-users", { isWorker: false });
      dispatch(HideLoading());
      if (response.data.success) {
        setUsers(response.data.data);
        setFilteredUsers(response.data.data); // Initialize with all users
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  useEffect(() => {
    if (!selectedWorker) {
      getUsers();
    }
  }, [selectedWorker]);

  // Search users by name or email
  const handleSearch = (value) => {
    setSearchTerm(value);
    const filtered = users.filter((user) =>
      user.name.toLowerCase().includes(value.toLowerCase()) ||
      user.email.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const onFinish = async (values) => {
    try {
      dispatch(ShowLoading());
      let response;
      if (selectedWorker) {
        response = await axiosInstance.post("/api/workers/update-worker", {
          ...values,
          _id: selectedWorker._id,
        });
      } else {
        response = await axiosInstance.post("/api/workers/add-worker", values);
      }

      if (response.data.success) {
        message.success(response.data.message);
        getWorkers();
        setShowWorkerForm(false);
      } else {
        message.error(response.data.message);
      }

      dispatch(HideLoading());
    } catch (error) {
      message.error(error.message);
      dispatch(HideLoading());
    }
  };

  return (
    <Modal
      width={800}
      title={selectedWorker ? "Edit Worker" : "Add Worker"}
      visible={showWorkerForm}
      onCancel={() => {
        setSelectedWorker(null);
        setShowWorkerForm(false);
      }}
      footer={false}
    >
      <Form layout="vertical" onFinish={onFinish} initialValues={selectedWorker}>
        <Row gutter={[10, 10]}>
          {!selectedWorker && (
            <Col lg={12} xs={24}>
              <Form.Item label="Select User" name="workerEmail" rules={[{ required: true }]}>
                <Select
                  showSearch
                  placeholder="Select a user to add as worker"
                  filterOption={false} // Disable default filtering
                  onSearch={handleSearch} // Custom search handler
                  notFoundContent={searchTerm ? `No results for "${searchTerm}"` : "No users"}
                >
                  {filteredUsers.map((user) => (
                    <Select.Option key={user._id} value={user.email}>
                      {user.name} - {user.email}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          )}
          <Col lg={12} xs={24}>
            <Form.Item label="Worker Name" name="workerName" rules={[{ required: true }]}>
              <input
                type="text"
                placeholder="Enter worker's name"
                disabled={!!selectedWorker}
              />
            </Form.Item>
          </Col>
          <Col lg={12} xs={24}>
            <Form.Item label="Email" name="workerEmail" rules={[{ required: true }]}>
              <input
                type="email"
                placeholder="Enter worker's email"
                disabled={!!selectedWorker}
              />
            </Form.Item>
          </Col>
          <Col lg={12} xs={24}>
            <Form.Item label="Position" name="workerPosition" rules={[{ required: true }]}>
              <input type="text" placeholder="Enter worker's position" />
            </Form.Item>
          </Col>
          <Col lg={12} xs={24}>
            <Form.Item label="Contact Number" name="workerContactNumber" rules={[{ required: true }]}>
              <input type="text" placeholder="Enter contact number" />
            </Form.Item>
          </Col>
          <Col lg={12} xs={24}>
            <Form.Item label="Profile Picture" name="profilePicture">
              <input type="text" placeholder="Profile picture URL (optional)" />
            </Form.Item>
          </Col>
          <Col lg={12} xs={24}>
            <Form.Item label="Admin Status" name="isAdmin" rules={[{ required: true }]}>
              <Select>
                <Select.Option value={true}>Admin</Select.Option>
                <Select.Option value={false}>Not Admin</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col lg={12} xs={24}>
            <Form.Item label="Blocked Status" name="isBlocked" rules={[{ required: true }]}>
              <Select>
                <Select.Option value={true}>Blocked</Select.Option>
                <Select.Option value={false}>Not Blocked</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <div className="d-flex justify-content-end">
          <button className="primary-btn" type="submit">
            {selectedWorker ? "Update Worker" : "Add Worker"}
          </button>
        </div>
      </Form>
    </Modal>
  );
}

export default WorkerForm;
