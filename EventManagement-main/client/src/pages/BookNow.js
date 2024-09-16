import { Col, message, Row, Card, Switch, Form, Modal, Radio, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import SeatSelection from '../components/SeatSelection';
import { axiosInstance } from '../helpers/axiosInstance';
import { HideLoading, ShowLoading } from '../redux/alertsSlice';
import StripeCheckout from 'react-stripe-checkout';

function BookNow() {
  const COMMISSION = 70; // 70 THB commission
  const [selectedSeats, setSelectedSeats] = useState([]);
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [bus, setBus] = useState(null);
  const [point, setUserPoint] = useState(null);
  const [checkDiscount, setCheckDiscount] = useState(true);
  const [discount, setDiscount] = useState(0);
  const [coupons, setCoupons] = useState([]);
  const [showDiscount, setShowDiscount] = useState(false);

  const colStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  };

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
        setDiscount(point >= 1000 ? Math.round(point / 1000) * 100 : 0);
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

  const getBus = async () => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.post('/api/buses/get-bus-by-id', {
        _id: params.id,
      });
      dispatch(HideLoading());
      if (response.data.success) {
        setBus(response.data.data);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const bookNow = async (transactionId) => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.post('/api/bookings/book-seat', {
        bus: bus._id,
        seats: selectedSeats,
        discount: checkDiscount ? discount.point : 0,
        transactionId,
      });
      dispatch(HideLoading());
      if (response.data.success) {
        message.success(response.data.message);
        navigate('/bookings');
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
      const totalFareWithCommission = (bus.fare + COMMISSION) * selectedSeats.length * 100; // Adding the commission to the original fare
      const response = await axiosInstance.post('/api/bookings/make-payment', {
        token,
        amount: totalFareWithCommission, // using the fare including commission
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

  

  useEffect(() => {
    getBus();
  }, []);

  return (
    <>
      <Card>
        <div>
          {bus && (
            <Row className="mt-3" gutter={[30, 30]}>
              <Col lg={12} xs={24} sm={24}>
                <h1 className="text-2xl primary-text">{bus.name}</h1>
                <h1 className="text-md">
                  {bus.from} - {bus.to}
                </h1>
                <hr />

                <div className="flex flex-col gap-2">
                  <p className="text-md">Journey Date: {bus.journeyDate}</p>
                  <p className="text-md">Fare: ฿ {bus.fare} /-</p>
                  <p className="text-md">Departure Time: {bus.departure}</p>
                  <p className="text-md">Arrival Time: {bus.arrival}</p>
                  <p className="text-md">Departure Place: {bus.sto}</p>
                  <p className="text-md">Arrival Place: {bus.sfrom}</p>
                  <p className="text-md">Capacity: {bus.capacity}</p>
                  <p className="text-md">Seats Left: {bus.capacity - bus.seatsBooked.length}</p>
                </div>
                <hr />

                <div className="flex flex-col gap-2">
                  <h1 className="text-2xl">Selected Seats: {selectedSeats.join(', ')}</h1>
                  <h1 className="text-2xl mt-2">Fare: {bus.fare * selectedSeats.length} /-</h1>
                  <h1 className="text-2xl mt-2">Snacks: {COMMISSION} /-</h1>
                  <h1 className="text-2xl mt-2">Total Amount: {(bus.fare + COMMISSION) * selectedSeats.length} /-</h1>
                  
                  <hr />

                  {coupons.length > 0 && (
                    <div className="payment-options">
                      <button
                        className={`primary-btn ${selectedSeats.length === 0 && 'disabled-btn'}`}
                        disabled={selectedSeats.length === 0}
                        onClick={() => setShowDiscount(true)}
                      >
                        Pay with Card
                      </button>
                    </div>
                  )}
                  {coupons.length === 0 && (
                    <div className="payment-options">
                      <StripeCheckout
                        billingAddress
                        token={onToken}
                        amount={(bus.fare + COMMISSION) * selectedSeats.length * 100 }
                        currency="THB"
                        stripeKey="pk_test_51No2dzLzyWTDvO4mFVgg15J7SyIsIhnmesOOyDf6RknBT7aD2yfQxRWVyYwSKDHWRT0wpHyKXuPdvghPK0DbR2Xg00d2jB7qjP"
                      >
                        <button className={`primary-btn ${selectedSeats.length === 0 && 'disabled-btn'}`} disabled={selectedSeats.length === 0}>
                          Pay with Card
                        </button>
                      </StripeCheckout>
                    </div>
                  )}
                </div>
              </Col>
              <Col lg={4} style={colStyle}>
                <Col>
                  <p>
                    <span
                      style={{
                        height: '20px',
                        width: '20px',
                        display: 'inline-block',
                        borderRadius: '20%',
                        marginRight: '10px',
                        background: '#c9c9c9',
                      }}
                    ></span>
                    Unavailable
                  </p>
                  <p>
                    <span
                      style={{
                        height: '20px',
                        width: '20px',
                        display: 'inline-block',
                        borderRadius: '20%',
                        marginRight: '10px',
                        background: '#d5f4ea',
                      }}
                    ></span>
                    Available
                  </p>
                  <p>
                    <span
                      style={{
                        height: '20px',
                        width: '20px',
                        display: 'inline-block',
                        borderRadius: '20%',
                        marginRight: '10px',
                        background: '#05be5f',
                      }}
                    ></span>
                    Selected
                  </p>
                </Col>
              </Col>

              <Col lg={8}>
                <SeatSelection selectedSeats={selectedSeats} setSelectedSeats={setSelectedSeats} bus={bus} />
              </Col>
            </Row>
          )}
        </div>
      </Card>
      {bus && (
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
                      setDiscount({ point: 0, discount: 0 });
                      setCheckDiscount(!checkDiscount);
                    }}
                  />
                </Form.Item>
              )}
            </Col>
            {checkDiscount && (
              <Col lg={24} xs={24} style={{ border: '1px solid #EEE', borderRadius: '5px', padding: '10px' }}>
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
              amount={
                checkDiscount && selectedSeats.length > 0
      ? ((bus.fare + COMMISSION) * selectedSeats.length - discount.discount) * 100 // include commission here
      : (bus.fare + COMMISSION) * selectedSeats.length * 100 
              }
              currency="THB"
              stripeKey="pk_test_51IYnC0SIR2AbPxU0TMStZwFUoaDZle9yXVygpVIzg36LdpO8aSG8B9j2C0AikiQw2YyCI8n4faFYQI5uG3Nk5EGQ00lCfjXYvZ"
            >
              <button className={`primary-btn`} onClick={() => setShowDiscount(false)}>
                Next
              </button>
            </StripeCheckout>
          </div>
        </Modal>
      )}
    </>
  );
}

export default BookNow;
