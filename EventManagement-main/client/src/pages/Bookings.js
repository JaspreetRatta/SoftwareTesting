import { message, Modal, Table, Form, Rate, Input, Button } from "antd";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import PageTitle from "../components/PageTitle";
import { axiosInstance } from "../helpers/axiosInstance";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";
import { useReactToPrint } from "react-to-print";
import { useSelector } from "react-redux";
const Bookings = () => {
  const { users } = useSelector((state) => ({ ...state }));
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const COMMISSION = 70; // 70 THB commission
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showReview, setShowReview] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [valuesReview, setValuesReview] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    getBookings();
  }, [valuesReview]);

  const onFinish = async (values) => {
    const tempValuesReview = {
      ...valuesReview,
      rating: values.rating,
      comment: values.comment,
      user: users.user.name,
      email: users.user.email,
      reviewStatus: true,
      category: selectedBooking.category,
      name: selectedBooking.name,
      numbus: selectedBooking.number,
      bus_id: selectedBooking.bus._id,
      booking_id: selectedBooking.key,
    };

    try {
      const response = await axiosInstance.post("/api/review/create", tempValuesReview);
      console.log(response.data);
      getBookings();
      form.resetFields();
      setVisible(false);
      if (response.data.success) {
        message.success(response.data.message);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      getBookings();
      console.log(error.response);
      message.error(error.message);
    }
  };

  const showModal = () => {
    setVisible(true);
  };

  const handleOk = () => {
    form.submit();
  };

  const handleCancel = () => {
    form.resetFields();
    setVisible(false);
  };

  const columns = [
    {
      title: "Bus Name",
      dataIndex: "name",
      key: "bus",
    },
    {
      title: "Bus Number",
      dataIndex: "number",
      key: "bus",
    },
    {
      title: "Journey Date",
      dataIndex: "journeyDate",
    },
    {
      title: "Price",
      dataIndex: "fare",
    },
    {
      title: "Snacks",
      dataIndex: "commission",
      render: () => `฿${COMMISSION}`, // Display the fixed commission
    },
    {
      title: "Discount",
      dataIndex: "discount", // this should match the field in your booking records
      key: "discount", // unique key for react list
      render: (discount) => {
        // you can format the value here, this example assumes discount is a number
        // if discount value is 0, we display 'None', otherwise we display the discount value
        return discount ? `฿${discount}` : 'None';
      },
    },
    {
      title: "Seats",
      dataIndex: "seats",
      render: (seats) => {
        return seats.join(", ");
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => (
        <div>
          <p
            className="text-md underline"
            onClick={() => {
              setSelectedBooking(record);
              setShowPrintModal(true);
            }}
          >
            Print Ticket
          </p>
          {!record.reviewStatus && (
            <Button
              type="primary"
              onClick={() => {
                showModal();
                setSelectedBooking(record);
                console.log(record);
              }}
            >
              Review
            </Button>
          )}
        </div>
      ),
    },
  ];

  const getBookings = async () => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.post("/api/bookings/get-bookings-by-user-id", {});
      dispatch(HideLoading());
      if (response.data.success) {
        const mappedData = response.data.data.map((booking) => {
          return {
            ...booking,
            ...booking.bus,
            key: booking._id,
          };
        });
        setBookings(mappedData);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <>
      <div>
        <Modal title="Review" visible={visible} onOk={handleOk} onCancel={handleCancel}>
          <Form form={form} onFinish={onFinish}>
            <Form.Item
              name="comment"
              label="Comment"
              rules={[
                {
                  required: true,
                  message: "Please leave a comment!",
                },
              ]}
            >
              <Input.TextArea />
            </Form.Item>

            <Form.Item
              name="rating"
              label="Rating"
              className="mt-3"
              rules={[
                {
                  required: true,
                  message: "Please give a rating!",
                },
              ]}
            >
              <Rate />
            </Form.Item>
          </Form>
        </Modal>
      </div>

      {showPrintModal && (
        <Modal
          title="Print Ticket"
          onCancel={() => {
            setShowPrintModal(false);
            setSelectedBooking(null);
          }}
          visible={showPrintModal}
          okText="Print"
          onOk={handlePrint}
        >
          <div className="d-flex flex-column p-5" ref={componentRef}>
            <p>Bus : {selectedBooking.name}</p>
            <p>
              {selectedBooking.from} - {selectedBooking.to}
            </p>
            <hr />

            <p>User : {users.user.name}</p>
            <hr />
            <p>
              <span>Journey Date:</span> {moment(selectedBooking.journeyDate).format("DD-MM-YYYY")}
            </p>
            <p>
              <span>Journey Time:</span> {selectedBooking.departure}
            </p>
            <hr />
            <p>
              <span>Seat Numbers:</span> <br />
              {selectedBooking.seats.join(', ')}
            </p>
            <hr />
            <p>
            <span>Total Amount:</span> {(selectedBooking.fare + COMMISSION) * selectedBooking.seats.length - selectedBooking.discount} /-

            </p>
          </div>
        </Modal>
      )}

      <div>
        <PageTitle title="Bookings Bus" />
        <div className="mt-2">
          <Table dataSource={bookings} columns={columns} />
        </div>
      </div>
    </>
  );
};

export default Bookings;
