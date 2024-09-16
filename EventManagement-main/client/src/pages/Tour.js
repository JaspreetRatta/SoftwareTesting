import { Col, message, Row, Pagination, Input, Button } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";
import TourCard from "../components/TourCard";

function Home() {
  const { user } = useSelector((state) => state.users);
  const [searchTitle, setSearchTitle] = useState(""); 
  const dispatch = useDispatch();
  const [buses, setBuses] = useState([]);
  
  const getBuses = async () => {
    try {
      dispatch(ShowLoading());
      const response = await axios.post("/api/tour/list");
      dispatch(HideLoading());
      setBuses(response.data);
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const style = {
    padding: "40px 40px",
  };

  useEffect(() => {
    getBuses();
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 6;
  const startIndex = (currentPage - 1) * cardsPerPage;
  const endIndex = startIndex + cardsPerPage;

  // Filter buses based on searchTitle and slice the array for pagination
  const currentCards = buses.filter(bus => bus.title.toLowerCase().includes(searchTitle.toLowerCase())).slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div>
      {/* Responsive Search input with Icon and Search Button */}
      <div className="my-3 py-1">
        <Input 
          placeholder="Search by tour title" 
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}
          style={{ maxWidth: 800 }}
        />
        <Button type="primary" onClick={getBuses} style={{ marginLeft: '10px' }}>
          Search
        </Button>
      </div>

      <div>
        <Row style={{display:"flex"}}>
          {currentCards.map((card) => (
            <Col style={style} lg={8} md={12} sm={24}>
              <TourCard tour={card} id={card.id} />
            </Col>
          ))}
        </Row>

        <Pagination 
          style={{display:"flex",justifyContent:"end",marginBottom:"20px"}}
          current={currentPage}
          total={buses.filter(bus => bus.title.toLowerCase().includes(searchTitle.toLowerCase())).length} 
          pageSize={cardsPerPage}
          onChange={handlePageChange}
        />
      </div>
    </div>
  );
}

export default Home;
