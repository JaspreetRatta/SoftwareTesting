import { message, Modal, Table } from "antd";

import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

import PageTitle from "../../components/PageTitle";
import { axiosInstance } from "../../helpers/axiosInstance";
import { HideLoading, ShowLoading } from "../../redux/alertsSlice";
import { useReactToPrint } from "react-to-print";

function AdminBookingsTour() {
  const { users } = useSelector((state) => ({ ...state }));
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const [bookings, setBookings] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const dispatch = useDispatch();

  const getBookings = async () => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.post(
        "/api/bookings/get-all-bookings-tour",
        "/get-bookings-by-user-id-tour",
        {}
      );
      dispatch(HideLoading());
      if (response.data.success) {
        const mappedData = response.data.data.map((booking) => {
          return {
            ...booking,
            ...booking.tour,
            key: booking._id,
          };
        });
        setBookings(mappedData);;
     }
   } catch (error) {
     dispatch(HideLoading());
     message.error(error.message);
   }
 };



  const columns = [
    {
      title: "Event Name",
      dataIndex: "title",
      key: "tour",
    },
    {
      title: "Date",
      dataIndex: "journeyDate",
      render: (date) => moment(date).format("DD-MM-YYYY"),
    },

    {
      title: "Booked on",
      dataIndex: "createdAt",
      render: (date) => {
        const formattedDate = new Date(date).toLocaleDateString("en-US", {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
        return formattedDate;
      }
    },

    {
      title: "Price",
      dataIndex: "price",
      key: "tour",
    },
    
//{
 // title: "Discount",
  // dataIndex: "discount", 
  // key: "discount", 
  // render: (discount) => {
  
    //return discount ? `฿${discount}` : 'None';
  // },
// },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => (
        <p
          className="text-md underline"
          onClick={() => {
            setSelectedBooking(record);
            setShowPrintModal(true);
          }}
        >
          Details
        </p>
      ),
    },
  ];

  useEffect(() => {
    getBookings();
  }, []);


  useEffect(() => {
    const earnings = bookings.reduce((acc, booking) => {
      return acc + Number(booking.price);
    }, 0);
    setTotalEarnings(earnings);
  }, [bookings]);


  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <div>
      <PageTitle title="Events Bookings" />
      <div className="mt-2">
        <Table dataSource={bookings} columns={columns} />
          <h3>Total Earnings: {totalEarnings}</h3>
        
       
      </div>

      {showPrintModal && (
        <Modal
          title="User Detail"
          visible={showPrintModal}
          onCancel={() => {
            setShowPrintModal(false);
            setSelectedBooking(null);
          }}
          okText="Print"
          onOk={handlePrint}
        >
          <div className="d-flex flex-column p-5" ref={componentRef}>
            <p>User : {selectedBooking?.user?.name}</p>
            <hr />
            <p>Events : {selectedBooking?.title}</p>
            <hr />
            <p>
              <span> Date :</span>{" "}
              {moment(selectedBooking?.journeyDate).format("DD-MM-YYYY")}
            </p>
            <hr />
            <p>
              <span>Total Amount :</span> {selectedBooking.price - selectedBooking.discount}
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default AdminBookingsTour;
