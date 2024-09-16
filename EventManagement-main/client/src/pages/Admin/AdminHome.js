import React from 'react';
import { Card, Row, Col } from 'antd';
import { CarOutlined, EnvironmentOutlined, DollarCircleOutlined } from '@ant-design/icons';

function AdminHome() {
  return (
    <div style={{ backgroundColor: '#f1f1f1', padding: '20px', borderRadius: '10px' }}>
      <h1 style={{ textAlign: 'center', color: '#555' }}>Welcome Admin!</h1>
      
      <Row gutter={16} style={{ marginTop: '20px' }}>
        <Col span={8}>
          <Card
            hoverable
            title="Users buy bus"
            actions={[
              <CarOutlined key="bus" />,
            ]}
          >
            <p>Number of users: 150</p>
          </Card>
        </Col>
        <Col span={8}>
          <Card
            hoverable
            title="Users buy tours"
            actions={[
              <EnvironmentOutlined key="tour" />,
            ]}
          >
            <p>Number of users: 80</p>
          </Card>
        </Col>
        <Col span={8}>
          <Card
            hoverable
            title="Total earnings"
            actions={[
              <DollarCircleOutlined key="earnings" />,
            ]}
          >
            <p>$5,000</p>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default AdminHome;

