import React,{useState} from "react";
import { Col, Form, message, Modal, Row } from "antd";
import { axiosInstance } from "../../../helpers/axiosInstance";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../../redux/alertsSlice";
import FileUpload from "./FileUpload";


function TourForm({
  showTourForm,
  setShowTourForm,
  type = "add",
  getData,
  selectedTour,
  setSelectedTour,
  values,
  setValues
}) {
  const dispatch = useDispatch();

  const handleSubmit = (values) => {
    console.log(values);


    try {
      dispatch(ShowLoading());
      let response = null;
      if (type === "add") {
        response = axiosInstance.post("/api/tour/create", values);
      } else {
        response = axiosInstance.post("/api/tour/update", {
          ...values,
          _id: selectedTour._id,
        });
      }
      if (response.data.success) {
        message.success(response.data.message);
      } else {
        message.error(response.data.message);
      }
      getData();
      setShowTourForm(false);
      setSelectedTour(null);

      dispatch(HideLoading());
    } catch (error) {
      message.error(error.message);
      dispatch(HideLoading());
    }
   
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  return (
    <Modal
      width={800}
      title={type === "add" ? "Add Tour" : "Update Tour"}
      visible={showTourForm}
      onCancel={() => {
        setSelectedTour(null);
        setShowTourForm(false);
      }}
      footer={false}
    >
      <Form layout="vertical" onFinish={handleSubmit} initialValues={selectedTour}>
        <Row gutter={[10, 10]}>
          <Col lg={24} xs={24}>
          <Form.Item label="Title" name="title">
              <input type="text" />
          </Form.Item>
          {/* <label className="mb-2">Title</label>
              <input type="text" 
              name="title"
              value={values.title}
              onChange={handleChange}
              /> */}
          </Col>
          <Col lg={12} xs={24}>
          <Form.Item label="Date" name="Date">
              <input type="date" />
          </Form.Item>
          {/* <label className="mb-2">Journey Date</label>
              <input type="date" 
              name="journeyDate"
              value={values.journeyDate}
              onChange={handleChange}
              /> */}
          </Col>

          <Col lg={12} xs={24}>
          <Form.Item label="Price" name="price">
              <input type="number" />
          </Form.Item>
          {/* <label className="mb-2">Price</label>
              <input type="number"
               name="price"
               value={values.price}
               onChange={handleChange}
              /> */}
          </Col>

          <Col lg={12} xs={24}>
          <Form.Item label="Description" name="description">
              <input type="text" />
          </Form.Item>
          {/* <label className="mb-2">Description</label>
              <input type="text" 
              name="description"
              value={values.description}
              onChange={handleChange}
              /> */}
          </Col>

          <Col lg={12} xs={24}>
          <Form.Item label="Duration ( hour )" name="duration">
              <input type="number" />
          </Form.Item>
          {/* <label className="mb-2">Duration ( Day )</label>
              <input type="number" 
              name="duration"
              value={values.duration}
              onChange={handleChange}
              /> */}
          </Col>
          <Col lg={12} xs={24}>
            <Form.Item label="Status" name="eventStatus">
              <select name="" id="">
                <option value="Yet To Start">Yet To Start</option>
                <option value="Running">Running</option>
                <option value="Completed">Completed</option>
              </select>
            </Form.Item>
          </Col>

          <Col lg={24} xs={24}>
            <label htmlFor="">Photo</label>
              <FileUpload
                values={values}
                setValues={setValues}
              />
          </Col>

          <Col lg={24} xs={24}>
          <Form.Item label="Details" name="Details">
              <input type="text" />
          </Form.Item>
          {/* <label className="mb-2">Details</label>
              <textarea type="text"
              name="details"
              value={values.details}
              onChange={handleChange} 
              /> */}
          </Col>
        </Row>

        <div className="d-flex justify-content-end mt-2">
          <button className="primary-btn" type="submit">
            Save
          </button>
        </div>
      </Form>
    </Modal>
  );
}

export default TourForm;
