import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Table, message } from 'antd';
import axios from 'axios';
import { ShowLoading, HideLoading } from '../../redux/alertsSlice';
import PageTitle from '../../components/PageTitle';
import EmployeeForm from '../../components/EmployeeForm'; // Assume you have this component

const EmployeeManagement = () => {
    const dispatch = useDispatch();
    const [employees, setEmployees] = useState([]);
    const [showEmployeeForm, setShowEmployeeForm] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    const getEmployees = async () => {
        try {
            dispatch(ShowLoading());
            const res = await axios.post('/api/employees/get-all-employees');
            dispatch(HideLoading());
            if (res.data.success) {
                setEmployees(res.data.data); // Corrected to use res.data.data
            } else {
                message.error(res.data.message);
            }
        } catch (error) {
            dispatch(HideLoading());
            message.error(error.message);
        }
    };
    

    const deleteEmployee = async (id) => {
        try {
            dispatch(ShowLoading());
            const res = await axios.post('/api/employees/delete-employee', { _id: id });
            dispatch(HideLoading());
            if (res.data.success) {
                message.success(res.data.message);
                getEmployees();
            } else {
                message.error(res.data.message);
            }
        } catch (error) {
            dispatch(HideLoading());
            message.error(error.message);
        }
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'employeeEmail',
        },
        {
            title: 'Phone Number',
            dataIndex: 'phoneNumber',
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: (action, record) => (
                <div className="d-flex gap-3">
                    <i
                        className="ri-delete-bin-line"
                        onClick={() => deleteEmployee(record._id)}
                    ></i>
                    <i
                        className="ri-pencil-line"
                        onClick={() => {
                            setSelectedEmployee(record);
                            setShowEmployeeForm(true);
                        }}
                    ></i>
                </div>
            ),
        },
    ];

    useEffect(() => {
        getEmployees();
    }, []);

    return (
        <div>
            <div className="d-flex justify-content-between my-2">
                <PageTitle title="Employees" />
                <button className="primary-btn" onClick={() => setShowEmployeeForm(true)}>
                    Add Employee
                </button>
            </div>

            <Table columns={columns} dataSource={employees} />

            {showEmployeeForm && (
                <EmployeeForm
                    showEmployeeForm={showEmployeeForm}
                    setShowEmployeeForm={setShowEmployeeForm}
                    type={selectedEmployee ? 'edit' : 'add'}
                    selectedEmployee={selectedEmployee}
                    setSelectedEmployee={setSelectedEmployee}
                    getData={getEmployees}
                />
            )}
        </div>
    );
};

export default EmployeeManagement;

