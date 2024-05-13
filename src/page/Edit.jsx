// Edit.jsx
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Modal, Form, Input, Button, message } from "antd";
import axios from "axios";

const Edit = ({ record, onCancel, onUpdate }) => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    form.setFieldsValue(record); // Set initial form values from record
  }, [record]);

  const handleCancel = () => {
    setVisible(false);
    onCancel(); // Call onCancel function provided by parent component
  };

  const onFinish = (values) => {
    const { name, email, age } = values;

    if (name.length < 3) {
      message.error('Please enter at least three characters for the student name.');
      return;
    }

    if (isNaN(age) || age === "") {
      message.error('Please enter a valid number for the age.');
      return;
    }

    axios
      .put(`https://serverless-api-fetizanan.netlify.app/.netlify/functions/api/${record._id}`, values)
      .then(() => {
        message.success("Data updated successfully");
        onUpdate(record._id, values); // Call onUpdate function provided by parent component
        form.resetFields();
        setVisible(false);
        onCancel(); // Call onCancel function provided by parent component
      })
      .catch((error) => {
        console.error("Error updating data: ", error);
        message.error("Failed to update data");
      });
  };

  return (
    <Modal
      title="Update Student"
      visible={visible}
      onCancel={handleCancel}
      footer={null}
      style={{ backgroundColor: '#f0f0f0' }} // Apply pastel background color directly
    >
      <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"
      >
        <Form.Item
          name="name"
          label="Student Name"
          rules={[{ required: true, message: "Please input the student name!" }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Please input the email!" },
            { type: 'email', message: "Please input a valid email address!" }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="age"
          label="Age"
          rules={[
            { required: true, message: "Please input the age!" },
            () => ({
              validator(_, value) {
                if (!value || !isNaN(Number(value))) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Please enter a valid number for the age!"));
              },
            }),
          ]}
        >
          <Input type="number" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Update
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

Edit.propTypes = {
  record: PropTypes.object.isRequired,
  onCancel: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired
};

export default Edit;
