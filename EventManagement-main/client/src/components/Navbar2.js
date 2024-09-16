import { useRef } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import Dropdown from 'react-bootstrap/Dropdown';
import "../resourses/navbar.css";

function Navbar2({ activeRoute, user, userMenu, navigate }) {
  const navRef = useRef();

  const showNavbar = () => {
    navRef.current.classList.toggle("responsive_nav");
  };

  return (
    <>
      <header>
        <div className="con-logo">
          <a href="/ ">
            <h4 className="logo-text">JOL</h4>
            Welcome {user?.name}
          </a>
        </div>

        <nav ref={navRef}>
          {userMenu.map((item, index) => (
            <div
              className="user-menu-item"
              key={index}
            >
              {item.name === "Profile" ? (
                <Dropdown>
                  <Dropdown.Toggle variant="transparent" id="dropdown-basic-button">
                    <i className={item.icon}></i>
                    <span>{item.name}</span>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => navigate("/client/src/pages/Profile")}>
                      Profile setting
                   </Dropdown.Item>
                    
                    <Dropdown.Item onClick={() => navigate("/bookingsTour")}>
                      Tour History
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <div onClick={() => {
                  if (item.path === "/logout") {
                    localStorage.removeItem("token");
                    navigate("/login");
                  } else {
                    navigate(item.path);
                  }
                }}>
                  <i className={item.icon}></i>
                  <span>{item.name}</span>
                </div>
              )}
            </div>
          ))}

          <button className="nav-btn nav-close-btn" onClick={showNavbar}>
            <FaTimes />
          </button>
        </nav>

        <button className="nav-btn" onClick={showNavbar}>
          <FaBars />
        </button>
      </header>
    </>
  );
}

export default Navbar2;

