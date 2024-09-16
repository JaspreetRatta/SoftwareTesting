import React, { useState, useEffect } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { useSpring, animated } from '@react-spring/web';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import { Card, Table } from 'antd';

// Register chart elements
ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const TaskReport = () => {
  const [analytics, setAnalytics] = useState({
    totalTasks: 0,
    completedTasks: 0,
    averageProgress: 0,
  });
  const [tasks, setTasks] = useState([]);

  
  // Fetch task analytics
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axios.get('/api/tasks/analytics');
        setAnalytics(response.data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      }
    };
    fetchAnalytics();
  }, []);

  // Fetch tasks
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('/api/tasks');
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };
    fetchTasks();
  }, []);

  // Spring animation
  const props = useSpring({
    from: { opacity: 0, transform: 'translate3d(0,-40px,0)' },
    to: { opacity: 1, transform: 'translate3d(0,0px,0)' },
  });

  // Data for the pie chart
  const pieData = {
    labels: ['Completed Tasks', 'Pending Tasks'],
    datasets: [
      {
        data: [analytics.completedTasks, analytics.totalTasks - analytics.completedTasks],
        backgroundColor: ['#4CAF50', '#FF6384'],
      },
    ],
  };

  // Data for the bar chart (Progress by worker)
  const barData = {
    labels: tasks.map(task => task.assignedTo?.workerName || 'Unassigned'),
    datasets: [
      {
        label: 'Task Progress (%)',
        data: tasks.map(task => task.progress),
        backgroundColor: '#36A2EB',
      },
    ],
  };

  // Table columns for displaying tasks
  const columns = [
    {
      title: 'Task Name',
      dataIndex: 'taskName',
      key: 'taskName',
    },
    {
      title: 'Worker Name',
      dataIndex: 'assignedTo',
      key: 'workerName',
      render: (assignedTo) => assignedTo?.workerName || 'Unassigned',
    },
    {
      title: 'Worker Email',
      dataIndex: 'assignedTo',
      key: 'workerEmail',
      render: (assignedTo) => assignedTo?.workerEmail || 'Unassigned',
    },
    {
      title: 'Progress',
      dataIndex: 'progress',
      key: 'progress',
      render: (progress) => `${progress}%`,
    },
    {
      title: 'Status',
      dataIndex: 'progress',
      key: 'status',
      render: (progress) => `${progress === 100 ? "Completed" : "Pending"}`,
    },
    {
      title: 'Deadline',
      dataIndex: 'deadline',
      key: 'deadline',
      render: (date) => new Date(date).toLocaleDateString(),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h2>Task Report and Analytics</h2>

      <div className="analytics-container" style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
        <animated.div style={props}>
          <Card title="Task Completion Overview" style={{ maxWidth: '400px', margin: 'auto' }}>
            <Pie data={pieData} />
          </Card>
        </animated.div>

        <animated.div style={props}>
          <Card title="Task Progress by Workers" style={{ maxWidth: '600px', margin: 'auto' }}>
            <Bar data={barData} options={{ scales: { y: { beginAtZero: true, max: 100 } } }} />
          </Card>
        </animated.div>
      </div>

      <div style={{ marginTop: '40px' }}>
        <h3>Tasks and Worker Information</h3>
        <Table columns={columns} dataSource={tasks} rowKey="_id" pagination={{ pageSize: 5 }} />
      </div>

      {/* Analytics Summary */}
      <div className="analytics-stats" style={{ marginTop: '20px', textAlign: 'center' }}>
        <h4>Total Tasks: {analytics.totalTasks}</h4>
        <h4>Completed Tasks: {analytics.completedTasks}</h4>
        <h4>Average Progress: {analytics.averageProgress.toFixed(2)}%</h4>
      </div>
    </div>
  );
};

export default TaskReport;
