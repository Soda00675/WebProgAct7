// Add.jsx
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form, Input, message } from "antd";
import axios from "axios";

const Add = ({ onAdd }) => {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [existingEmails, setExistingEmails] = useState([]);

  useEffect(() => {
    fetchExistingEmails();
  }, []);

  const fetchExistingEmails = () => {
    axios
      .get("https://serverless-api-fetizanan.netlify.app/.netlify/functions/api")
      .then((res) => {
        const emails = res.data.map((item) => item.email);
        setExistingEmails(emails);
      })
      .catch((error) => {
        console.error("Error fetching existing data: ", error);
      });
  };

  const showModal = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const onFinish = (values) => {
    const { name, email, age } = values;
    if (existingEmails.includes(email)) {
      message.error('Email already exists. Please enter a different email.');
      return;
    }

    if (name.length < 3) {
      message.error('Please enter at least three characters for the student name.');
      return;
    }

    if (isNaN(age) || age === "") {
      message.error('Please enter a valid number for the age.');
      return;
    }

    axios
      .post("https://serverless-api-fetizanan.netlify.app/.netlify/functions/api", values)
      .then((res) => {
        fetchExistingEmails();
        onAdd(res.data); 
        message.success('Data added successfully');
        form.resetFields();
        setVisible(false);
      })
      .catch((error) => {
        console.error("Error adding data: ", error);
        message.error('Failed to add data');
      });
  };

  return (
    <>
      <Button className="left-5" type="default" onClick={showModal} style={{ backgroundColor: 'Black', color: '#fff' }}>
        + Add New Student
      </Button>
      <Modal
        title="Add New Student"
        visible={visible}
        onCancel={handleCancel}
        footer={null}
        style={{ backgroundColor: '#f0f0f0' }}
      >
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item name="name" label="Student Name" rules={[{ required: true, message: 'Please enter student name' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Please enter email' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="age" label="Age" rules={[{ required: true, message: 'Please enter age' }]}>
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Add Student
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

Add.propTypes = {
  onAdd: PropTypes.func.isRequired,
};

export default Add;
