import React from 'react';
import { Container, Row, Col } from "react-bootstrap";
import { MailOutlined, PhoneOutlined } from '@ant-design/icons'; // importing icons from antd
import '../resourses/ContactForm.css'; // Import the CSS file for styling



const ContactForm = () => {
  return (

    
    <Container>
      <Row className="mb-5 mt-3">
        <Col lg="8">
          <h1 className="display-4 mb-4">Contact HoHo Travels</h1>   
        </Col>
      </Row>
      <Row className="sec_sp">
        <Col lg="5" className="mb-5">
          <h3 className="color_sec py-4">Get in touch</h3>
          <div>
            <strong><MailOutlined /> Email:</strong> <a href="mailto:travelshoho@gmail.com">travelshoho@gmail.com</a> 
            {/* Navigating to Gmail on click */}
          </div>
          <br />
          <div>
            <strong><PhoneOutlined /> Phone:</strong> +66869808102 
          </div> 
        
        </Col>
        <h1 className="featured__tour-title">HoHo Travels</h1>
        <br/>
        <br/>
              <p>
                Introducing HoHo Travels - where bus and tour management becomes a breeze. We understand the complexities of managing tours, from scheduling buses to ensuring every traveler has a memorable experience. That's why we've developed a system that brings together cutting-edge technology and user-friendly interfaces. With HoHo Travels, managing tours is not just efficient—it's enjoyable
              </p>

      </Row>
    </Container>

    
  );
};


export default ContactForm;
