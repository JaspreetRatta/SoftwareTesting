import React from 'react';


const Reports = () => {
  const mockData = {
    sales: 1200,
    bookings: 75,
    registeredUsers: 450,
    websiteVisitors: 980,
  };

  return (
    <div className="reports-container">
      <h1>Reports</h1>
      <div className="report-item">
        <h2>Total Sales</h2>
        <p>${mockData.sales}</p>
      </div>
      <div className="report-item">
        <h2>Number of Bookings</h2>
        <p>{mockData.bookings}</p>
      </div>
      <div className="report-item">
        <h2>People Registered</h2>
        <p>{mockData.registeredUsers}</p>
      </div>
      <div className="report-item">
        <h2>Website Visitors</h2>
        <p>{mockData.websiteVisitors}</p>
      </div>
    </div>
  );
};

export default Reports;
