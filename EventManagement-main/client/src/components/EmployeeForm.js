import React from "react";
import { Col, Form, message, Modal, Row } from "antd";
import { useDispatch } from "react-redux";
import { axiosInstance } from "../helpers/axiosInstance";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";

function EmployeeForm({
  showEmployeeForm,
  setShowEmployeeForm,
  type = "add",
  getData,
  selectedEmployee,
  setSelectedEmployee,
}) {
  const dispatch = useDispatch();

  const onFinish = async (values) => {
    try {
      dispatch(ShowLoading());
      let response = null;
      if (type === "add") {
        response = await axiosInstance.post("/api/employees/add", values);
      } else {
        response = await axiosInstance.post("/api/employees/update-Employee", {
          ...values,
          _id: selectedEmployee._id,
        });
      }
      dispatch(HideLoading());
      if (response.data.success) {
        message.success(response.data.message);
        getData();
        setShowEmployeeForm(false);
        setSelectedEmployee(null);
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
      width={800}
      title={type === "add" ? "Add Employee" : "Update Employee"}
      visible={showEmployeeForm}
      onCancel={() => {
        setSelectedEmployee(null);
        setShowEmployeeForm(false);
      }}
      footer={false}
    >
      <Form layout="vertical" onFinish={onFinish} initialValues={selectedEmployee}>
        <Row gutter={[10, 10]}>
          <Col lg={24} xs={24}>
            <Form.Item label="Employee Name" name="name" rules={[{ required: true, message: 'Please enter the employee name!' }]}>
              <input type="text" />
            </Form.Item>
          </Col>
          <Col lg={24} xs={24}>
            <Form.Item label="Email" name="employeeEmail" rules={[{ required: true, message: 'Please enter the employee email!' }]}>
              <input type="email" />
            </Form.Item>
          </Col>
          <Col lg={24} xs={24}>
            <Form.Item label="Phone Number" name="phoneNumber">
              <input type="text" />
            </Form.Item>
          </Col>
          
          <Col lg={12} xs={24}>
            <Form.Item label="Admin Privileges" name="isAdmin">
              <select>
                <option value={false}>No</option>
                <option value={true}>Yes</option>
              </select>
            </Form.Item>
          </Col>
          <Col lg={12} xs={24}>
            <Form.Item label="Active Status" name="isActive">
              <select>
                <option value={true}>Active</option>
                <option value={false}>Inactive</option>
              </select>
            </Form.Item>
          </Col>
        </Row>

        <div className="d-flex justify-content-end">
          <button className="primary-btn" type="submit">
            Save
          </button>
        </div>
      </Form>
    </Modal>
  );
}

export default EmployeeForm;
