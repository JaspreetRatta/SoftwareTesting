import React from "react";
import { Col, Form, Input, Modal, Row, message } from "antd";
import { useDispatch } from "react-redux";
import { axiosInstance } from "../helpers/axiosInstance";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";

function AssignTaskForm({ showTaskForm, setShowTaskForm, selectedWorker }) {
  const dispatch = useDispatch();

  const onFinish = async (values) => {
    try {
      dispatch(ShowLoading());
      // Make sure the keys in the object match what the backend API expects
      const response = await axiosInstance.post("/api/tasks/assign-task", {
        taskName: values.taskName, // Ensure this matches backend key
        taskDescription: values.taskDescription, // Ensure this matches backend key
        assignedTo: selectedWorker._id, // Assign the task to the selected worker
        deadline: values.deadline, // Ensure deadline is sent correctly
      });
      dispatch(HideLoading());

      if (response.data.success) {
        message.success(response.data.message);
        setShowTaskForm(false); // Close the modal after task assignment
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  return (
    <Modal
      visible={showTaskForm}
      onCancel={() => setShowTaskForm(false)}
      title="Assign Task to Worker"
      footer={null}
    >
      <Form layout="vertical" onFinish={onFinish}>
        <Row gutter={[10, 10]}>
          <Col lg={12} xs={24}>
            <Form.Item label="Task Name" name="taskName" rules={[{ required: true }]}>
              <Input placeholder="Enter task name" />
            </Form.Item>
          </Col>
          <Col lg={12} xs={24}>
            <Form.Item label="Task Description" name="taskDescription" rules={[{ required: true }]}>
              <Input placeholder="Enter task description" />
            </Form.Item>
          </Col>
          <Col lg={12} xs={24}>
            <Form.Item label="Deadline" name="deadline" rules={[{ required: true }]}>
              <Input type="date" placeholder="Enter deadline" />
            </Form.Item>
          </Col>
        </Row>
        <div className="d-flex justify-content-end">
          <button className="primary-btn" type="submit">
            Assign Task
          </button>
        </div>
      </Form>
    </Modal>
  );
}

export default AssignTaskForm;
