
import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "../resourses/layout.css"; // Ensure this CSS file has appropriate styles

function WorkerLayout({ children }) {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = React.useState(false);
  const { user } = useSelector((state) => state.users);

  const workerMenu = [
    {
      name: "My Tasks",
      path: "/worker/tasks",
      icon: "ri-task-line",
    },
    {
      name: "Profile",
      path: "/worker/profile",
      icon: "ri-user-line",
    },
    {
      name: "Logout",
      path: "/logout",
      icon: "ri-logout-box-line",
    },
  ];

  let activeRoute = window.location.pathname;
  if (window.location.pathname.includes("book-now")) {
    activeRoute = "/";
  }

  return (
    <div className="layout-parent">
      <div className="sidebar">
        <div className="sidebar-header">
          {collapsed ? (
            <i
              className="ri-menu-2-fill"
              style={{ color: "white" }}
              onClick={() => setCollapsed(!collapsed)}
            ></i>
          ) : (
            <i
              className="ri-close-line"
              style={{ color: "white" }}
              onClick={() => setCollapsed(!collapsed)}
            ></i>
          )}

          <h1 className="logo">JOL</h1>
          <h1 className="role">
            {user?.name} <br />
            Role: Worker
          </h1>
        </div>

        <div className="d-flex flex-column gap-3 justify-content-start menu">
          {workerMenu.map((item, index) => {
            return (
              <div
                key={index}
                className={`${
                  activeRoute === item.path && "active-menu-item"
                } menu-item`}
              >
                <i className={item.icon}></i>
                {!collapsed && (
                  <span
                    onClick={() => {
                      if (item.path === "/logout") {
                        localStorage.removeItem("token");
                        navigate("/login");
                      } else {
                        navigate(item.path);
                      }
                    }}
                  >
                    {item.name}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="body">
        <div className="content">{children}</div>
      </div>
    </div>
  );
}

export default WorkerLayout;
