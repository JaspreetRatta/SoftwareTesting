import React from "react";
import { useNavigate,Link } from "react-router-dom";
import { Avatar, Card,Carouse } from "antd";
const { Meta } = Card;

function TourCard({ tour,id }) {
  const navigate = useNavigate();
  const {images} = tour
 
  return (
    <div className="card p-2">
      <div>
        <Card
          cover={
            <img
            className="p-1"
            style={{ height: "300px", objectFit: "cover" }}
            src={images && images.length ? images[0].url : "https://static.vecteezy.com/system/resources/previews/004/141/669/non_2x/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg"}
          />
          }
          actions={[
            <>
              <Link  to={`/tour/${tour._id}`}>
              View Details
              </Link>
            </>,
          ]}
        >
          <Meta title={`Title : ${tour.title}`} description={`Description : ${tour.description.slice(0,120)}`} 
           style={{ height: "110px" }}
          />
        </Card>
      </div>
    </div>
  );
}

export default TourCard;
