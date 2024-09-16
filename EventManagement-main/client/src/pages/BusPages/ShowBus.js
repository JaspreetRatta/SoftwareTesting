import React, { Children, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Card, Space, Row, Col, Timeline, message,Rate,Divider,Typography } from "antd";
import { axiosInstance } from "../../helpers/axiosInstance";
import { HideLoading, ShowLoading } from "../../redux/alertsSlice";
import Review from "../../components/Review";
import ReviewCustomer from "../../components/ReviewCustomer"

const { Title, Text } = Typography;

function ShowBus() {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [bus, setBus] = useState(null);
  const [review, setReview] = useState();

  const customHeaderStyle = {
    borderBottom: "2px solid rgba(82,196,26,255)",
    marginRight: "2%",
    marginLeft: "2%",
    marginTop: "20px",
  };
  const customStyle1 = {
    marginTop: "20px",
    marginLeft: "2%",
    marginRight: "2%",
  };
  const customStyle2 = {
    borderLeft: "2px solid #e8e8e8",
    marginTop: "40px",
  };

  const getBus = async () => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.post("/api/buses/get-bus-by-id", {
        _id: params.id,
      });
      dispatch(HideLoading());
      if (response.data.success) {
        setBus(response.data.data);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const getReview = () => {
    axiosInstance
      .post("/api/review/read_bus", {
        _id: params.id,
      })
      .then((res) => {
        //code
        setReview(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getBus();
    getReview();
  }, []);

  return (
    <div>
      {bus && (

          <Card title={bus.name} size="small" headStyle={customHeaderStyle}>
            <Row style={customStyle1}>
              <Col span={20}>
                <div
                  style={{
                    marginTop: "30px",
                  }}
                >
                  <Timeline>
                    <Timeline.Item color="green">
                      {bus.departure} {bus.from}
                    </Timeline.Item>
                    <Timeline.Item color="green">
                      {bus.arrival} {bus.to}
                    </Timeline.Item>
                  </Timeline>
                </div>
                <p>{bus.journeyDate}</p>
                
              </Col>
                  
              <Col span={4} style={customStyle2}>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <Col>
                    <h4>THB {bus.fare}</h4>
                    <p
                      style={{ display: "flex", justifyContent: "flex-end" }}
                      className="mb-5"
                    >
                      per person
                    </p>
                    <div class="btn btn-success mb-3 ">
                      <Link class="text-light" to={`/book-now/${params.id}`}>
                        {" "}
                        Booking{" "}
                      </Link>
                    </div>
                  </Col>
                </div>
              </Col>
            </Row>
          </Card>

        
      )}
      <Card>
      <Review review={review}/>
      <Divider />
      <Title level={3}>Customer Reviews</Title>
      <ReviewCustomer review={review} />
      </Card>


    </div>
  );
}

export default ShowBus;
