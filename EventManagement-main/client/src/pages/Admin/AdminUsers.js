// Importing necessary libraries and components
import { message, Table } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import PageTitle from "../../components/PageTitle";
import { axiosInstance } from "../../helpers/axiosInstance";
import { HideLoading, ShowLoading } from "../../redux/alertsSlice";

// Main component function
function AdminUsers() {
  const dispatch = useDispatch(); // To dispatch actions

  // State for managing users and non-admin user count
  const [users, setUsers] = useState([]);
  const [nonAdminCount, setNonAdminCount] = useState(0);

  // Function to retrieve users
  const getUsers = async () => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.post("/api/users/get-all-users", {});
      dispatch(HideLoading());
      if (response.data.success) {
        setUsers(response.data.data); // Set user data if response is successful

        // Filter out admins and set non-admin count
        const nonAdminUsers = response.data.data.filter((user) => !user.isAdmin);
        setNonAdminCount(nonAdminUsers.length);
      } else {
        message.error(response.data.message); // Show error message if there's an issue
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message); // Error handling
    }
  };

  // Function to update user permissions
  const updateUserPermissions = async (user, action) => {
    try {
      let payload = null;
      if (action === "make-admin") {
        payload = {
          ...user,
          isAdmin: true,
        };
      } else if (action === "remove-admin") {
        payload = {
          ...user,
          isAdmin: false,
        };
      } else if (action === "block") {
        payload = {
          ...user,
          isBlocked: true,
        };
      } else if (action === "unblock") {
        payload = {
          ...user,
          isBlocked: false,
        };
      }

      dispatch(ShowLoading());
      const response = await axiosInstance.post(
        "/api/users/update-user-permissions",
        payload
      );
      dispatch(HideLoading());
      if (response.data.success) {
        getUsers(); // Refresh the users list
        message.success(response.data.message);
      } else {
        message.error(response.data.message); // Error handling for unsuccessful operation
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message); // Error handling
    }
  };

  // Column definitions for the table
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Registered At",
      dataIndex: "createdAt",
      render: (date) => {
        const formattedDate = new Date(date).toLocaleDateString("en-US", {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
        return formattedDate; // Formatting registration date
      },
    },
    {
      title: "Status",
      dataIndex: "",
      render: (data) => {
        return data.isBlocked ? "Blocked" : "Active"; // Displaying user status
      },
    },
    {
      title: "Role",
      dataIndex: "",
      render: (data) => {
        if (data?.isAdmin) {
          return "Admin";

        } else if (data?.isWorker) {
          return "Worker"; // Return "Worker" if the user is a worker
        } else {
          
          return "User"; // Determining user role
        }
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (action, record) => (
        <div className="d-flex gap-3">
          {record?.isBlocked && (
            <p
              className="underline"
              onClick={() => updateUserPermissions(record, "unblock")}
            >
              UnBlock
            </p>
          )}
          {!record?.isBlocked && (
            <p
              className="underline"
              onClick={() => updateUserPermissions(record, "block")}
            >
              Block
            </p>
          )}
          {record?.isAdmin && (
            <p
              className="underline"
              onClick={() => updateUserPermissions(record, "remove-admin")}
            >
              
            </p>
          )}
          {!record?.isAdmin && (
            <p
              className="underline"
              onClick={() => updateUserPermissions(record, "make-admin")}
            >
              
            </p>
          )}
        </div> // Action buttons for managing user permissions
      ),
    },
  ];

  // Effect hook to get users on component mount
  useEffect(() => {
    getUsers();
  }, []);

  // Rendering the component
  return (
    <div>
      <div className="d-flex justify-content-between my-2">
        <PageTitle title="Users" />
        <p>Total  Users: {nonAdminCount}</p> {/* Display total number of non-admin users */}
      </div>
      <Table columns={columns} dataSource={users} /> {/* Users table */}
    </div>
  );
}

// Exporting the component
export default AdminUsers;
