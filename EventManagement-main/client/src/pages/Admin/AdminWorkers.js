import { message, Table, Button } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import WorkerForm from "../../components/WorkerForm";
import PageTitle from "../../components/PageTitle";
import { axiosInstance } from "../../helpers/axiosInstance";
import { HideLoading, ShowLoading } from "../../redux/alertsSlice";
import AssignTaskForm from "../../components/AssignTaskForm"; // Import the new AssignTaskForm component

function AdminWorkers() {
  const dispatch = useDispatch();
  const [showWorkerForm, setShowWorkerForm] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false); // For task assignment modal
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [workers, setWorkers] = useState([]);

  // Fetch all workers
  const getWorkers = async () => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.post("/api/workers/get-all-workers", {});
      dispatch(HideLoading());
      if (response.data.success) {
        setWorkers(response.data.data);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  // Delete a worker
  const deleteWorker = async (id) => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.post("/api/workers/delete-worker", { _id: id });
      dispatch(HideLoading());
      if (response.data.success) {
        message.success(response.data.message);
        getWorkers();
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  // Table columns for workers
  const columns = [
    {
      title: "Name",
      dataIndex: "workerName",
    },
    {
      title: "Email",
      dataIndex: "workerEmail",
    },
    {
      title: "Contact Number",
      dataIndex: "workerContactNumber",
    },
    {
      title: "Position",
      dataIndex: "workerPosition",
    },
    {
      title: "Profile Picture",
      dataIndex: "profilePicture",
      render: (url) => <img src={url} alt="Profile" style={{ width: 50, height: 50 }} />,
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (action, record) => (
        <div className="d-flex gap-3">
          <i
            className="ri-delete-bin-line"
            onClick={() => {
              deleteWorker(record._id);
            }}
          ></i>
          <i
            className="ri-pencil-line"
            onClick={() => {
              setSelectedWorker(record);
              setShowWorkerForm(true);
            }}
          ></i>
          {/* Assign Task button */}
          <i
            className="ri-task-line"
            onClick={() => {
              setSelectedWorker(record); // Set selected worker for task assignment
              setShowTaskForm(true); // Open task form modal
            }}
          ></i>
        </div>
      ),
    },
  ];

  useEffect(() => {
    getWorkers();
  }, []);

  return (
    <div>
      <div className="d-flex justify-content-between my-2">
        <PageTitle title="Workers" />
        <div className="d-flex">
          <Button className="primary-btn ml-2" onClick={() => setShowWorkerForm(true)}>
            Add Worker
          </Button>
        </div>
      </div>

      {showWorkerForm && (
        <WorkerForm
          showWorkerForm={showWorkerForm}
          setShowWorkerForm={setShowWorkerForm}
          selectedWorker={selectedWorker}
          setSelectedWorker={setSelectedWorker}
          getWorkers={getWorkers}
        />
      )}

      {showTaskForm && (
        <AssignTaskForm
          showTaskForm={showTaskForm}
          setShowTaskForm={setShowTaskForm}
          selectedWorker={selectedWorker}
        />
      )}

      <Table columns={columns} dataSource={workers} rowKey="_id" />
    </div>
  );
}

export default AdminWorkers;
