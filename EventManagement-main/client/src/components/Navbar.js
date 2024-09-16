import React from "react";

function Navbar({ collapsed, handleMenuToggle, activeRoute, user, userMenu, navigate }) {
  const toggleMenu = () => handleMenuToggle(); // Handle mobile menu toggle

  return (
    <div className="user-topnav">
      <div className="user-topnav-header">
        <i
          className={`menu-icon ${collapsed ? "ri-menu-2-fill" : "ri-close-line"}`}
          style={{ color: "black" }}
          onClick={toggleMenu} // Call toggleMenu on click
        ></i>
        <h1 className="user-logo">JOL</h1>
        Welcome {user?.name}
      </div>
      <div className={`user-menu ${collapsed ? "" : "menu-active"}`}>
        {userMenu.map((item, index) => (
          <div
            className={`${
              activeRoute === item.path && "user-active-menu-item"
            } user-menu-item`}
            key={index}
            onClick={() => {
              if (item.path === "/logout") {
                localStorage.removeItem("token");
                navigate("/login");
              } else {
                navigate(item.path);
              }
            }}
          >
            <i className={item.icon}></i>
            <span>{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Navbar;
