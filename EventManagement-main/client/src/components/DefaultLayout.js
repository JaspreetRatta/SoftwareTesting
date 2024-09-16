import React from "react";
import { useSelector } from "react-redux";
import UserLayout from "./UserLayout";
import AdminLayout from "./AdminLayout";
import WorkerLayout from "./WorkerLayout"; // Import WorkerLayout

function DefaultLayout({ children }) {
  const { user } = useSelector((state) => state.users);

  return (
<>
      {user?.isAdmin ? (
        <AdminLayout>{children}</AdminLayout>
      ) : user?.isWorker ? ( // Check if the user is a worker
        <WorkerLayout>{children}</WorkerLayout>
      ) : (
        <UserLayout>{children}</UserLayout>
      )}
    </>
  );
}

export default DefaultLayout;

