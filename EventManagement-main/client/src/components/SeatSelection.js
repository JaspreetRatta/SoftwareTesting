import React from "react";
import { Row, Col } from "antd";
import "../resourses/bus.css";
import "../resourses/seat.png";
import steerImg from "../resourses/steer.png";


function SeatSelection({ selectedSeats, setSelectedSeats, bus }) {
  const capacity = bus.capacity;

  const selectOrUnselectSeats = (seatNumber) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter((seat) => seat !== seatNumber));
    } else {
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };
  // Define the seat layout as an array of objects
  const seatLayout = [
    { row: 1, seats: [1, 2, 3, "", 4, 5, 6] },
    { row: 2, seats: [7, 8, 9, "", 10, 11, 12] },
    { row: 3, seats: [13, 14, 15, "", 16, 17, 18] },
    { row: 4, seats: ["", 19, 20, "", 21, 22, ""] },
    { row: 5, seats: [23, 24, 25, "", 26, 27, 28] },
    { row: 6, seats: [29, 30, 31, "", 32, 33, 34] },
  ];


  return (
    <div className="mx-5">

      <div className="bus-container">
        <Row gutter={[10, 10]}justify="center">
    
        
          {Array.from(Array(capacity).keys()).map((seat) => {
            let seatClass = ''
            if(selectedSeats.includes(seat+1))
            {
                seatClass = 'selected-seat'
            }else if (bus.seatsBooked.includes(seat+1))
            {
                seatClass = 'booked-seat'
            }
            return (
              <Col span={6}>
                <div
                  className={`seat ${seatClass}`}
                  onClick={() => selectOrUnselectSeats(seat + 1)}
                >
                  {seat + 1}
                </div>
              </Col>
            );
          })}
        </Row>
      </div>
    </div>
  );
}

export default SeatSelection;
