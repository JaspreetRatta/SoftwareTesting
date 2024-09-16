import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { List, Card, message, Button, Typography, Image, Space, Row, Col } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
const { Title, Text } = Typography;

function MemoryList() {
  const [memories, setMemories] = useState([]);

  useEffect(() => {
    async function fetchMemories() {
      try {
        const response = await axios.get("/api/memories/get-all-memories");
        setMemories(response.data.data);
      } catch (error) {
        console.error("Error fetching memories:", error);
        // Handle error
      }
    }
    fetchMemories();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await axios.post("/api/memories/delete-memory", {
        _id: id,
      });
      console.log("Memory deleted :", response.data);
      message.success(response.data.message);
    } catch (error) {
      console.error("Error deleting memory:", error);
      // Handle error
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <Title level={2}>My Travel Memories</Title>
      <List
        grid={{ gutter: 16, column: 3 }}
        dataSource={memories}
        renderItem={(memory) => (
          <List.Item>
            <Card
              title={memory.title}
              extra={
                <Button
                  danger
                  
                  onClick={(e) => {
                    handleDelete(memory._id);
                  }}
                  shape="circle"
                />
              }
              hoverable
            >
              <Space direction="vertical" size={12}>
                <Text strong>{memory.location}</Text>
                
                {memory.images && memory.images[0] && (
                  <Row justify="center">
                    <Col span={12} offset={6} style={{ marginLeft: "6rem" }}>
                      <Image
                        width={200}
                        alt={memory.title}
                        src={memory.images[0]}
                        style={{ borderRadius: "8px" }}
                      />
                    </Col>
                  </Row>
                )}
                <div>
                  <Link to={`/client/src/Diary/showmore/${memory._id}`}>
                    {" "}
                    {/* Use memory ID in the URL */}
                    <Button size="default">Show More</Button>
                  </Link>
                </div>
              </Space>
            </Card>
          </List.Item>
        )
        }
      />
    </div >
  );
}

export default MemoryList;