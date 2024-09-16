import { message, Table } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import PageTitle from "../../../components/PageTitle";
import { axiosInstance } from "../../../helpers/axiosInstance";
import { HideLoading, ShowLoading } from "../../../redux/alertsSlice";
import { Modal, Button } from "antd";
import CreateTour from "./CreateTour";
import EditTour from "./EditTour";

function AdminTour() {
  const dispatch = useDispatch();
  const [showBusForm, setShowBusForm] = useState(false);
  const [showBusForm2, setShowBusForm2] = useState(false);
  const [selectedBus, setSelectedBus] = useState(null);

  const [tour, setTour] = useState([]);
  const getTour = async () => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.post("/api/tour/list");
      dispatch(HideLoading());
      setTour(response.data);
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const deleteTour = async (id) => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.post("/api/tour/remove", {
        _id: id,
      });
      dispatch(HideLoading());
      if (response.data.success) {
        message.success(response.data.message);
        getTour();
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
      title: "Title",
      dataIndex: "title",
    },
    {
      title: "Date",
      dataIndex: "journeyDate",
    },
    {
      title: "Price",
      dataIndex: "price",
    },

    {
      title: "Venue",
      dataIndex: "venue",
    },
   // {
     // title: "Status",
      //dataIndex: "eventStatus",
    //},
    // {
     // title: "Duration ( Day )",
    //  dataIndex: "duration",
   // },
    {
      title: "Action",
      dataIndex: "action",
      render: (action, record) => (
        <div className="d-flex gap-3">
          <i
            class="ri-delete-bin-line"
            onClick={() => {
              deleteTour(record._id);
            }}
          ></i>
          <i
            className="ri-pencil-line"
            onClick={() => {
              setSelectedBus(record);
              setShowBusForm(true);
              console.log(showBusForm);
            }}
          ></i>
        </div>
      ),
    },
  ];
  useEffect(() => {
    getTour();
  }, []);
  return (
    <div>
      <div className="d-flex justify-content-between my-2">
        <PageTitle title="Events" />
        <Button
          type="primary"
          className="primary-btn"
          onClick={() => setShowBusForm2(true)}
        >
          Add Events
        </Button>
      </div>
      <Table columns={columns} dataSource={tour} />

      {showBusForm2 && (
        <CreateTour
          showBusForm={showBusForm2}
          setShowBusForm={setShowBusForm2}
          type={selectedBus ? "edit" : "add"}
          selectedBus={selectedBus}
          setSelectedBus={setSelectedBus}
          getTour={getTour}
        />
      )}

      {showBusForm && (
        <EditTour
          showBusForm={showBusForm}
          setShowBusForm={setShowBusForm}
          selectedBus={selectedBus}
          setSelectedBus={setSelectedBus}
          getTour={getTour}
        />
      )}


    </div>
  );
}

export default AdminTour;
