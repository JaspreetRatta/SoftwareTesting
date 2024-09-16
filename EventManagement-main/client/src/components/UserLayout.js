import React, { useState } from "react";
import "../resourses/user.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import Navbar2 from "./Navbar2";
import userMenu from "./MenuItems";
import { Menu, Badge, Layout, Breadcrumb } from "antd";


function UserLayout({ children }) {
  const { Header, Content } = Layout;
  const [collapsed, setCollapsed] = useState(false);
  const activeRoute = window.location.pathname.includes("book-now")
    ? "/"
    : window.location.pathname;

  const { user } = useSelector((state) => state.users);

  const navigate = useNavigate();

  const handleMenuToggle = () => {
    setCollapsed(!collapsed);
  };

  return (
    <>
      <Layout className="layout">
        {/* <Navbar
          collapsed={collapsed}
          handleMenuToggle={handleMenuToggle}
          activeRoute={activeRoute}
          user={user}
          userMenu={userMenu}
          navigate={navigate}
        /> */}
        <Navbar2
        activeRoute={activeRoute}
        user={user}
        userMenu={userMenu}
        navigate={navigate}
        />
        <Content
          style={{
            padding: "0.1%",
            minHeight:"100vh"
          }}
        >
          <div className="site-layout-content">
            <div className="user-content">{children}</div>
          </div>
        </Content>

        
      
      <section className="footer bg-dark">
        <div className="container py-5 text-white text-center">
          <p>JOL</p>
        </div>
      </section>
      </Layout>
    </>
  );
}

export default UserLayout;
