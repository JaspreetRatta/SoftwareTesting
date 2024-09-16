import React, { useState, useEffect } from "react";
import "../resourses/home.css";
import { Container, Row, Col } from "reactstrap";
import { message } from "antd";
import heroImg from "../resourses/images/hero-img35.jpg";
import heroImg02 from "../resourses//images/gallery-01.jpg";
import heroVideo from "../resourses//images/thailand01.mp4";
import worldImg from "../resourses//images/world.png";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";
import Subtitle from "./../shared/Subtitle";

import RecentTour from "../components/RecentTour";

const House = () => {
  const dispatch = useDispatch();
  const [tour, setTour] = useState([]);
  const [buses, setBus] = useState([]);

  const getTour = async () => {
    try {
      dispatch(ShowLoading());
      const response = await axios.post("/api/tour/list-tour");
      dispatch(HideLoading());
      setTour(response.data);
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const getBuses = async () => {
    try {
      dispatch(ShowLoading());
      const response = await axios.post("/api/buses/list-bus");
      dispatch(HideLoading());
      setBus(response.data);
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  useEffect(() => {
    getTour();
    getBuses();
  }, []);

  return (
    <>
      {/* ========== hero section start =========== */}

      <section>
        <Container>
          <Row>
            <Col lg="6">
              <div className="hero__content">
                <div className="hero__subtitle d-flex align-items-center ">
                  <Subtitle subtitle={"Know Before You GO"} />
                  <img src={worldImg} alt="" />
                </div>
                <h1>
                  Traveling opens the door to creating
                  <span className="highlight"> memories</span>
                </h1>
                <br></br>
                <p>
                  Welcome to Bus and Tours in Thailand, your ultimate
                  destination for seamless and memorable travel experiences
                  throughout the enchanting land of Thailand. As a premier bus
                  reservation system and tour operator, we take pride in
                  offering top-notch services that cater to the diverse needs of
                  travelers, whether they are exploring the bustling city
                  streets of Bangkok or the serene beaches of Phuket.
                </p>
              </div>
            </Col>

            <Col lg="2">
              <div className="hero__img-box">
                <img src={heroImg} alt="" />
              </div>
            </Col>
            <Col lg="2">
              <div className="hero__img-box hero__video-box mt-4">
                <video src={heroVideo} alt="" controls />
              </div>
            </Col>
            <Col lg="2">
              <div className="hero__img-box mt-5">
                <img src={heroImg02} alt="" />
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      {/* ========== hero section start =========== */}
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      {/* ============ featured tour section start ============ */}
      <section>
        <Container>
          <Row>
            <Col lg="12" className="mb-5">

              <h2 className="featured__tour-title">JOL Events</h2>
              <p>
                Introducing JOL Events - where bus and tour management becomes a breeze. We understand the complexities of managing tours, from scheduling buses to ensuring every traveler has a memorable experience. That's why we've developed a system that brings together cutting-edge technology and user-friendly interfaces. With HoHo Travels, managing tours is not just efficient—it's enjoyable
              </p>
            </Col>

          </Row>
        </Container>
      </section>
      {/* ============ featured tour section end ============ */}

      <section className="services">
        <div className="container">

          <h1>About our Website</h1>
          <br />
          <div className="row">
            <div className="col-md-4">
              <div className="card">
                <div className="card-body">
                  <i className="fa fa-bar-chart myicon"></i>
                  <h1>Save Memories</h1>
                  <p>
                    Travel is more than just reaching a destination; it's about the stories, experiences, and memories we create along the way. With our "Save Travel Memory" function, HoHo Travels ensures that every moment of your journey is preserved. Whether it's a breathtaking sunset you witnessed from the bus window, a heartwarming interaction with a fellow traveler, or the thrill of exploring a new city, our system allows you to capture and store these memories with ease.



                  </p>

                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card">
                <div className="card-body">
                  <i className="fa fa-bell-o myicon"></i>
                  <h1>Disussion Room</h1>
                  <p>
                    Connect, share, and grow with the HoHo Travels' Discussion Room.
                     This is a dedicated space where wanderlust spirits unite, a forum for 
                     exchanging stories, advice, and inspiration. 
                     Whether you're a seasoned traveler or just starting, here, every question is welcome, 
                     and every story is cherished.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card">
                <div className="card-body">
                  <i className="fa fa-braille myicon"></i>
                  <h1>Points and Promotions</h1>
                  <p>
                  Travel more, gain more with HoHo Travels' Points and Promotions!
                   Every journey you take, review you write, or tip you share can earn you points,
                    making you eligible for exciting promotions.
                   The more active you are, the more you're rewarded.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />



      {/* ============ featured tour section start ============ */}
      <section>
        <Container>
          <Row>
            <div className="mb-5">
              <h1 className="mb-3">Recent Tour</h1>
              <Row
                style={{
                  display: "center",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {tour
                  .filter((tour) => tour.status === "Yet To Start")
                  .map((tour) => (
                    <Col lg={8} style={{ maxWidth: "300px", margin: "0 10px" }}>
                      <RecentTour tour={tour} id={tour.id} />
                    </Col>
                  ))}
              </Row>
            </div>
          </Row>
        </Container>
      </section>
      {/* ============ featured bus section end ============ */}




      <br />
      <br />
      <br />
      <br />
      <br />



      <section>
        <Container>
          <Row>
            <Col lg="8" className="mb-2">

              <h1 className="featured__tour-title">Let's Get In Touch!</h1>
              <p>
                Ready to travel and create memories with us? Give us a call or send us an
                email and we will get back to you as soon as possible!
              </p>
              <i className="fa fa-phone myicon text-warning"></i>
              <i className="fa fa-heart myicon text-danger"></i>
              <p>+66869808102</p>
              <p>travelshoho@gmail.com</p>
            </Col>

          </Row>
        </Container>
      </section>

      <br />
      <br />




    </>
  );
};

export default House;