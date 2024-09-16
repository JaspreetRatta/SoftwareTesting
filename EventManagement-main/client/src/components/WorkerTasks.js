import React, { useEffect, useState } from 'react';
import { Table, Progress, Button, Modal, Form, Input, message } from 'antd';
import { axiosInstance } from '../helpers/axiosInstance';
import WorkerLayout from './WorkerLayout';

const WorkerTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [progressModalVisible, setProgressModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    // Fetch worker tasks for the signed-in user
    axiosInstance.get('/api/tasks/worker-tasks')
      .then(response => {
        if (response.data.success) {
          setTasks(response.data.data);
        } else {
          message.error(response.data.message);
        }
      })
      .catch(error => {
        console.error(error);
        message.error('Failed to fetch tasks');
      });
  }, []);

  const showUpdateProgressModal = (task) => {
    setSelectedTask(task);
    form.setFieldsValue({ progress: task.progress });
    setProgressModalVisible(true);
  };

  const handleUpdateProgress = async (values) => {
    try {
      const response = await axiosInstance.post('/api/tasks/update-task', {
        taskId: selectedTask._id,
        progress: values.progress,
        comments: values.comments || '',
      });

      if (response.data.success) {
        message.success('Task progress updated successfully');
        setTasks(tasks.map(task => task._id === selectedTask._id ? { ...task, progress: values.progress } : task));
        setProgressModalVisible(false);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      message.error('Failed to update task progress');
    }
  };

  const columns = [
    {
      title: 'Task Name',
      dataIndex: 'taskName',
      key: 'taskName',
    },
    {
      title: 'Description',
      dataIndex: 'taskDescription',
      key: 'taskDescription',
    },
    {
      title: 'Deadline',
      dataIndex: 'deadline',
      key: 'deadline',
      render: (deadline) => new Date(deadline).toLocaleDateString(),
    },
    {
      title: 'Progress',
      dataIndex: 'progress',
      key: 'progress',
      render: (progress) => <Progress percent={progress} status={progress === 100 ? 'success' : 'active'} />,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, task) => (
        <Button type="primary" onClick={() => showUpdateProgressModal(task)}>
          Update Progress
        </Button>
      ),
    },
  ];

  return (
    <WorkerLayout>
    <div style={{ padding: '20px' }}>
      <h2>My Tasks</h2>
      <Table columns={columns} dataSource={tasks} rowKey="_id" pagination={{ pageSize: 5 }} />

      <Modal
        title="Update Task Progress"
        visible={progressModalVisible}
        onCancel={() => setProgressModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleUpdateProgress}>
          <Form.Item
            name="progress"
            label="Progress (%)"
            rules={[{ required: true, message: 'Please input your task progress' }]}
          >
            <Input type="number" min={0} max={100} />
          </Form.Item>
          <Form.Item
            name="comments"
            label="Comments (optional)"
          >
            <Input.TextArea placeholder="Add any comments" />
          </Form.Item>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="primary" htmlType="submit">
              Update
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
    </WorkerLayout>
  );
};

export default WorkerTasks;
