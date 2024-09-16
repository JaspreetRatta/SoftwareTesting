import React from "react";
import { useNavigate,Link } from "react-router-dom";
import { Avatar, Card,Carouse,Col,Row } from "antd";
import { SwapRightOutlined } from "@ant-design/icons";

const { Meta } = Card;


function TourCard({ buses,id }) {

  const navigate = useNavigate();
  console.log(buses);
 
  return (
    // <div className="card p-2">
    //   <div>
    //     <Card
    //     title={buses.name}
    //       actions={[
    //         <>
    //           <Link  to={`/tour/${buses._id}`}>
    //           View Details
    //           </Link>
    //         </>,
    //       ]}
    //     >
    //       <Meta title={`Form : ${buses.from} `}
    //       />
    //       <Meta title={`To : ${buses.to}`}
    //       />
          
    //     </Card>
    //   </div>
    // </div>

      <Card title={buses.name}
       bordered={false}
       actions={[
        <>
          <a href={`/show-bus/${buses._id}`}>
          View Details
          </a>
        </>,
      ]}
       >
        Form : {buses.from}  <SwapRightOutlined />  To : {buses.to}
      </Card>

  );
}

export default TourCard;
