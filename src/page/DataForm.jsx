import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Table, message, Popconfirm } from 'antd';
import Update from './Edit';
import Add from './Add';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import './DataForm.css'; // Import CSS file for styling

const DataForm = () => {
  const [updateMode, setUpdateMode] = useState(false);
  const [updateRecord, setUpdateRecord] = useState(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios
      .get('https://serverless-api-fetizanan.netlify.app/.netlify/functions/api/')
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error('There was an error!', error);
      });
  };

  function handleDelete(id) {
    axios
      .delete( `https://serverless-api-fetizanan.netlify.app/.netlify/functions/api/${id}`)
      .then(() => {
        setData(data.filter((item) => item._id !== id));
        message.success('Data deleted successfully');
      })
      .catch((error) => {
        console.error("Error deleting data: ", error);
      });
  }
  
  

  const handleUpdateClick = (record) => {
    setUpdateRecord(record);
    setUpdateMode(true);
  };

  const handleUpdate = (id, updatedData) => {
    setData(data.map((item) => (item.id === id ? { ...item, ...updatedData } : item)));
    setUpdateMode(false);
  };

  const handleAdd = (newData) => {
    setData([...data, newData]);
  };  

  const columns = [
    {
      title: 'Student Name',
      dataIndex: 'name',
      key: 'name',
      width: 560, 
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 780, 
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
      width: 400, 
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <span className="flex gap-3">
          <EditOutlined style={{ width: '3rem', color: 'blue' }} onClick={() => handleUpdateClick(record)} />
          <Popconfirm
            title="Are you sure you want to delete this data?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
>
            <DeleteOutlined style={{ color: 'red' }} />
          </Popconfirm>

        </span>
      ),
    },
  ];

  return (
    <div className="data-form-container">
      <Table columns={columns} dataSource={data} className="pastel-table" />
      {updateMode && <Update record={updateRecord} onCancel={() => setUpdateMode(false)} onUpdate={handleUpdate} />}
      <Add onAdd={handleAdd} /> {/* Add component rendered within the same screen */}
    </div>
  );
};

export default DataForm;
