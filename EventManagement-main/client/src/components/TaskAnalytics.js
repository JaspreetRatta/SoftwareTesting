import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TaskAnalytics = () => {
    const [analytics, setAnalytics] = useState({
        totalTasks: 0,
        completedTasks: 0,
        averageProgress: 0
    });

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

    return (
        <div className="analytics-container">
            <h2>Task Analytics</h2>
            <div className="analytics-item">
                <span>Total Tasks:</span>
                <span>{analytics.totalTasks}</span>
            </div>
            <div className="analytics-item">
                <span>Completed Tasks:</span>
                <span>{analytics.completedTasks}</span>
            </div>
            <div className="analytics-item">
                <span>Average Progress:</span>
                <span>{analytics.averageProgress.toFixed(2)}%</span>
            </div>
        </div>
    );
};

export default TaskAnalytics;
