import React from "react";
import { Divider, Rate } from "antd";

const Review = ({ review }) => {

  if (!review || !Array.isArray(review)) {
    return null; 
  }

  return (
    <div>
      {review.map((reviewItem) => (
        <div key={reviewItem.id}>
          <div>
            <Rate disabled defaultValue={reviewItem.rating} />
          </div>
          <div>Rating: {reviewItem.rating}/5</div>
          <div>Comment: {reviewItem.comment}</div>
          <div>Customer: {reviewItem.user}</div>
          <Divider />
        </div>
      ))}
    </div>
  );
};

export default Review;
