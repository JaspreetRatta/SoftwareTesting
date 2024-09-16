import React from "react";
import { Divider, Rate,Col,Statistic,Row } from "antd";


const Review = ({ review }) => {
  if (!review || !Array.isArray(review)) {
    return null;
  }

    const averageRating =
    review.length > 0
      ? (
          review.reduce((sum, review) => sum + review.rating, 0) /
          review.length
        ).toFixed(1)
      : 0;

  return (
    <div>
      <Row gutter={[16, 16]} align="middle">
        <Col xs={24} md={12}>
          <Statistic
            title="Average Rating"
            value={averageRating}
            precision={1}
          />
          <Rate disabled allowHalf defaultValue={averageRating} />
        </Col>
        <Col xs={24} md={12}>
          <Statistic title="Reviews" value={review.length} />
        </Col>
      </Row>

    </div>
  );
};

export default Review;
