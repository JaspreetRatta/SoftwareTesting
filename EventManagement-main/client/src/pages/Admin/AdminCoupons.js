import { message, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import CouponForm from './TourPage/CouponForm';
import PageTitle from '../../components/PageTitle';
import { axiosInstance } from '../../helpers/axiosInstance';
import { HideLoading, ShowLoading } from '../../redux/alertsSlice';

function AdminCoupons() {
  const dispatch = useDispatch();
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [coupons, setCoupons] = useState([]);

  const getCoupons = async () => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.post('/api/coupons/get-all-coupons', {});
      dispatch(HideLoading());
      if (response.data.success) {
        setCoupons(response.data.data);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const deleteCoupon = async (id) => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.post('/api/coupons/delete-coupon', {
        _id: id,
      });
      dispatch(HideLoading());
      if (response.data.success) {
        message.success(response.data.message);
        getCoupons();
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const columns = [
    {
      title: 'Point',
      dataIndex: 'point',
    },
    {
      title: 'Discount',
      dataIndex: 'discount',
    },

    {
      title: 'Action',
      dataIndex: 'action',
      render: (action, record) => (
        <div className="d-flex gap-3">
          <i
            class="ri-delete-bin-line"
            onClick={() => {
              deleteCoupon(record._id);
            }}
          ></i>
          <i
            class="ri-pencil-line"
            onClick={() => {
              setSelectedCoupon(record);
              setShowCouponForm(true);
            }}
          ></i>
        </div>
      ),
    },
  ];

  useEffect(() => {
    getCoupons();
  }, []);
  return (
    <div>
      <div className="d-flex justify-content-between my-2">
        <PageTitle title="Coupons" />
        <button className="primary-btn" onClick={() => setShowCouponForm(true)}>
          Add Coupon
        </button>
      </div>

      <Table columns={columns} dataSource={coupons} />

      {showCouponForm && (
        <CouponForm
          showCouponForm={showCouponForm}
          setShowCouponForm={setShowCouponForm}
          type={selectedCoupon ? 'edit' : 'add'}
          selectedCoupon={selectedCoupon}
          setSelectedCoupon={setSelectedCoupon}
          getData={getCoupons}
        />
      )}
    </div>
  );
}

export default AdminCoupons;
