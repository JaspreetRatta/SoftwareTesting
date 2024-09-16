import React from 'react';
import { Col, Form, message, Modal, Row } from 'antd';
import { axiosInstance } from '../../../helpers/axiosInstance';
import { useDispatch } from 'react-redux';
import { HideLoading, ShowLoading } from '../../../redux/alertsSlice';

function CouponForm({ showCouponForm, setShowCouponForm, type = 'add', getData, selectedCoupon, setSelectedCoupon }) {
  const dispatch = useDispatch();

  const onFinish = async (values) => {
    try {
      dispatch(ShowLoading());
      let response = null;
      if (type === 'add') {
        response = await axiosInstance.post('/api/coupons/add-coupon', values);
      } else {
        response = await axiosInstance.post('/api/coupons/update-coupon', {
          ...values,
          _id: selectedCoupon._id,
        });
      }
      if (response.data.success) {
        message.success(response.data.message);
      } else {
        message.error(response.data.message);
      }
      getData();
      setShowCouponForm(false);
      setSelectedCoupon(null);

      dispatch(HideLoading());
    } catch (error) {
      message.error(error.message);
      dispatch(HideLoading());
    }
  };
  return (
    <Modal
      width={800}
      title={type === 'add' ? 'Add Coupon' : 'Update Coupon'}
      visible={showCouponForm}
      onCancel={() => {
        setSelectedCoupon(null);
        setShowCouponForm(false);
      }}
      footer={false}
    >
      <Form layout="vertical" onFinish={onFinish} initialValues={selectedCoupon}>
        <Row gutter={[10, 10]}>
          <Col lg={24} xs={24}>
            <Form.Item label="Point" name="point">
              <input type="number" />
            </Form.Item>
          </Col>
          <Col lg={24} xs={24}>
            <Form.Item label="Discount" name="discount">
              <input type="number" />
            </Form.Item>
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

export default CouponForm;
