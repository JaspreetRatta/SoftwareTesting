import React, { useEffect, useState } from 'react';
import { Col, message, Row, Card, Switch, Typography, Space, Divider, Button, Statistic, Rate, Form, Radio, Modal, InputNumber } from 'antd';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { HideLoading, ShowLoading } from '../redux/alertsSlice';
import { axiosInstance } from '../helpers/axiosInstance';
import StripeCheckout from 'react-stripe-checkout';
import Review from './Review';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; 
import ReviewCustomer from './ReviewCustomer';

const { Title, Text } = Typography;

const SingleTourCard = () => {
  const [form] = Form.useForm();
  const params = useParams();
  const navigate = useNavigate();
  const [tour, setTour] = useState();
  const [review, setReview] = useState();
  const [point, setUserPoint] = useState(null);
  const [checkDiscount, setCheckDiscount] = useState(true);
  const [discount, setDiscount] = useState(0);
  const [coupons, setCoupons] = useState([]);
  const [showDiscount, setShowDiscount] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    onGetProfile();
  }, []);
  useEffect(() => {
    onGetCoupon();
  }, [point]);

  const onGetProfile = async () => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.post('/api/users/get-point-user-by-id');
      dispatch(HideLoading());
      if (response.data.success) {
        const point = response.data.data;
        setUserPoint(point);
      }
    } catch (error) {
      dispatch(HideLoading());
    }
  };

  const onGetCoupon = async () => {
    try {
      const response = await axiosInstance.post('/api/coupons/list-coupon');
      dispatch(HideLoading());
      if (response.data) {
        const coupons = response.data.filter((x) => x.point <= point);
        setCoupons(coupons);
      }
    } catch (error) {
      dispatch(HideLoading());
    }
  };

  const bookNow = async (transactionId) => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.post('/api/bookings/book-tour', {
        tour: tour._id,
        category: 'tour',
        discount: checkDiscount ? discount.point : 0,
        transactionId,
      });
      dispatch(HideLoading());
      if (response.data.success) {
        message.success(response.data.message);
        navigate('/bookingsTour');
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const onToken = async (token) => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.post('/api/bookings/make-payment', {
        token,
        amount: tour.price * 100,
      });
      dispatch(HideLoading());
      if (response.data.success) {
        message.success(response.data.message);
        bookNow(response.data.data.transactionId);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const getTour = async () => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.post('/api/tour/read', {
        _id: params.id,
      });
      dispatch(HideLoading());
      if (response.data.success) {
        setTour(response.data.data);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const getReviewTour = () => {
    axiosInstance
      .post('/api/review/read_tour', {
        _id: params.id,
      })
      .then((res) => {
        //code
        setReview(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getTour();
    getReviewTour();
  }, []);

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  // function formatDate(dateString) {
  //   const date = new Date(dateString);
  //   const day = date.getDate();
  //   const month = monthNames[date.getMonth()];
  //   const year = date.getFullYear();
  //   return `${day} ${month} ${year}`;
  // }

  // const formattedDate = formatDate(tour.journeyDate);

  const onFinish = async (values) => {};

  return (
    <div>
      {tour && (
        <Card style={{ marginBottom: '16px' }}>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <div style={{ overflow: 'hidden' }}>
                <img alt={tour.title} src={tour.images[0].url} style={{ width: '100%', objectFit: 'cover' }} />
              </div>
              <Divider />
              <Review review={review} />
            </Col>
            <Col xs={24} md={12}>
              <div style={{ padding: '16px' }}>
                <Row
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Title level={2} style={{ marginBottom: '8px' }}>
                    {tour.title}
                  </Title>
                  {/* <Button type="primary" >
                    Buy
                  </Button> */}

                  {coupons.length > 0 && (
                    <div className="payment-options">
                      <button className="primary-btn" onClick={() => setShowDiscount(true)}>
                        Pay with Card
                      </button>
                    </div>
                  )}
                  {coupons.length === 0 && (
                    <div className="payment-options">
                      <StripeCheckout
                        billingAddress
                        token={onToken}
                        amount={tour.price * 100}
                        currency="THB"
                        stripeKey="pk_test_51No2dzLzyWTDvO4mFVgg15J7SyIsIhnmesOOyDf6RknBT7aD2yfQxRWVyYwSKDHWRT0wpHyKXuPdvghPK0DbR2Xg00d2jB7qjP"
                      >
                        <button className="primary-btn">Pay with Card</button>
                      </StripeCheckout>
                    </div>
                  )}
                </Row>

                <Text strong>Journey Date : {tour.journeyDate}</Text>
                <br />
                <Text strong>Duration : {tour.duration} Hours</Text>
                <br />
                <Text strong>Price : {tour.price} THB / person</Text>
                <br />
                <Text strong> Venue : {tour.venue}
                  
                </Text>
                <br />

             
                
                <Divider />
                <Text>{tour.description}</Text>
                <Divider />
                <Title level={3}>Tour Details</Title>
                
              <div dangerouslySetInnerHTML={{ __html: tour.details }} />

              </div>
            </Col>
          </Row>

          <Divider />
          <Title level={3}>Customer Reviews</Title>
          <ReviewCustomer review={review} />
        </Card>
      )}
      {tour && (
        <Modal width={300} title={'Discount?'} visible={showDiscount} onCancel={() => setShowDiscount(false)} footer={false}>
          <Row gutter={[10, 10]}>
            <Col lg={24} xs={24}>
              {coupons.length > 0 && (
                <Form.Item label="Use" valuePropName="checked">
                  <Switch
                    checked={checkDiscount}
                    checkedChildren="yes"
                    unCheckedChildren="no"
                    onChange={() => {
                      setCheckDiscount(!checkDiscount);
                    }}
                  />
                </Form.Item>
              )}
            </Col>
            {checkDiscount && (
              <Col lg={24} xs={24}>
                <Radio.Group
                  onChange={(event) => {
                    setDiscount(event.target.value);
                  }}
                >
                  <Space direction="vertical">
                    {coupons.map((coupon) => (
                      <Radio value={coupon}>{coupon.discount} THB</Radio>
                    ))}
                  </Space>
                </Radio.Group>
              </Col>
            )}
          </Row>

          <div className="d-flex justify-content-end mt-2">
            <StripeCheckout
              billingAddress
              token={onToken}
              amount={checkDiscount ? (tour.price - discount.discount) * 100 : tour.price * 100}
              currency="THB"
              stripeKey="pk_test_51No2dzLzyWTDvO4mFVgg15J7SyIsIhnmesOOyDf6RknBT7aD2yfQxRWVyYwSKDHWRT0wpHyKXuPdvghPK0DbR2Xg00d2jB7qjP"
            >
              <button className="primary-btn" onClick={() => setShowDiscount(false)}>
                Next
              </button>
            </StripeCheckout>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default SingleTourCard;
