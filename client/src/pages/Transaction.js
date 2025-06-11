// import React, { useState } from "react";
// import { Form, Input, message, Select } from "antd";
// import Spinner from "../components/Spinner";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import DefaultLayout from "../components/DefaultLayout";

// function Transaction() {
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const onFinish = async (values) => {
//     try {
//       const user = JSON.parse(localStorage.getItem("ExpenseTracker"));
//       setLoading(true);
//       await axios.post("/api/transactions/add-transaction", {
//         ...values,
//         userid: user._id,
//       });
//       message.success("Transaction added successfully");
//       navigate("/"); 
//     } catch (error) {
//       message.error("Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <DefaultLayout>
//       {loading && <Spinner />}
//       <h3 className="text-center">Add New Transaction</h3>
//       <Form layout="vertical" className="transaction-form" onFinish={onFinish}>
//         <Form.Item label="Amount" name="amount" rules={[{ required: true }]}>
//           <Input type="number" />
//         </Form.Item>

//         <Form.Item label="Type" name="type" rules={[{ required: true }]}>
//           <Select>
//             <Select.Option value="income">Income</Select.Option>
//             <Select.Option value="expense">Expense</Select.Option>
//           </Select>
//         </Form.Item>

//         <Form.Item label="Category" name="category" rules={[{ required: true }]}>
//           <Select>
//             <Select.Option value="salary">Salary</Select.Option>
//             <Select.Option value="freelance">Freelance</Select.Option>
//             <Select.Option value="food">Food</Select.Option>
//             <Select.Option value="entertainment">Entertainment</Select.Option>
//             <Select.Option value="investment">Investment</Select.Option>
//             <Select.Option value="travel">Travel</Select.Option>
//             <Select.Option value="education">Education</Select.Option>
//             <Select.Option value="medical">Medical</Select.Option>
//             <Select.Option value="tax">Tax</Select.Option>
//           </Select>
//         </Form.Item>

//         <Form.Item label="Date" name="date" rules={[{ required: true }]}>
//           <Input type="date" />
//         </Form.Item>

//         <Form.Item label="Reference" name="reference">
//           <Input type="text" />
//         </Form.Item>

//         <Form.Item label="Description" name="description">
//           <Input type="text" />
//         </Form.Item>

//         <div className="d-flex justify-content-end">
//           <button className="primary" type="submit">
//             SAVE
//           </button>
//         </div>
//       </Form>
//     </DefaultLayout>
//   );
// }

// export default Transaction;



import React, { useState } from "react";
import { Form, Input, message, Select } from "antd";
import Spinner from "../components/Spinner";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../resources/savings.css"; // Use the same layout & navbar styling

function Transaction() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const user = JSON.parse(localStorage.getItem("ExpenseTracker"));
      setLoading(true);
      await axios.post("/api/transactions/add-transaction", {
        ...values,
        userid: user._id,
      });
      message.success("Transaction added successfully");
      navigate("/");
    } catch (error) {
      message.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="expense-tracker-container">
      {loading && <Spinner />}

      {/* Custom navbar */}
      <div className="savings-navbar">
        <div className="nav-left">
          <h1>Add New Transaction</h1>
        </div>
        <div className="nav-right">
          <button className="back-btn" onClick={() => navigate("/")}>
            ← Back to Expenses
          </button>
        </div>
      </div>

      {/* Form container */}
      <div className="content-section">
        <h3 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "20px" }}>
          Set Transaction
        </h3>

        <Form layout="vertical" className="transaction-form" onFinish={onFinish}>
          <Form.Item label="Amount" name="amount" rules={[{ required: true }]}>
            <Input type="number" placeholder="Amount" />
          </Form.Item>

          <Form.Item label="Type" name="type" rules={[{ required: true }]}>
            <Select placeholder="Income or Expense">
              <Select.Option value="income">Income</Select.Option>
              <Select.Option value="expense">Expense</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Category" name="category" rules={[{ required: true }]}>
            <Select placeholder="Select Category">
              <Select.Option value="salary">Salary</Select.Option>
              <Select.Option value="freelance">Freelance</Select.Option>
              <Select.Option value="food">Food</Select.Option>
              <Select.Option value="entertainment">Entertainment</Select.Option>
              <Select.Option value="investment">Investment</Select.Option>
              <Select.Option value="travel">Travel</Select.Option>
              <Select.Option value="education">Education</Select.Option>
              <Select.Option value="medical">Medical</Select.Option>
              <Select.Option value="tax">Tax</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Date" name="date" rules={[{ required: true }]}>
            <Input type="date" placeholder="dd-mm-yyyy" />
          </Form.Item>

          <Form.Item label="Reference" name="reference">
            <Input type="text" placeholder="Reference" />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <Input type="text" placeholder="Description" />
          </Form.Item>

          <div className="d-flex justify-content-end">
            <button className="primary" type="submit">
              SAVE
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default Transaction;
