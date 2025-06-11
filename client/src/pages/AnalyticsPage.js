// // AnalyticsPage.js
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { DatePicker, message, Select, Button } from "antd";
// import { useNavigate } from "react-router-dom";
// import DefaultLayout from "../components/DefaultLayout";
// import Spinner from "../components/Spinner";
// import Analatics from "../components/Analatics";
// import { ArrowLeftOutlined } from "@ant-design/icons";

// const { RangePicker } = DatePicker;

// function AnalyticsPage() {
//   const [loading, setLoading] = useState(false);
//   const [transactionsData, setTransactionsData] = useState([]);
//   const [frequency, setFrequency] = useState("7");
//   const [type, setType] = useState("all");
//   const [selectedRange, setSelectedRange] = useState([]);
//   const navigate = useNavigate();

//   const getTransactions = async () => {
//     try {
//       const user = JSON.parse(localStorage.getItem("ExpenseTracker"));
//       setLoading(true);
//       const response = await axios.post(
//         "/api/transactions/get-all-transactions",
//         {
//           userid: user._id,
//           frequency,
//           ...(frequency === "custom" && { selectedRange }),
//           type,
//         }
//       );
//       setTransactionsData(response.data);
//       setLoading(false);
//     } catch (error) {
//       setLoading(false);
//       message.error("Something went wrong");
//     }
//   };

//   useEffect(() => {
//     getTransactions();
//   }, [frequency, selectedRange, type]);

//   return (
//     <DefaultLayout>
//       {loading && <Spinner />}
      
//       <div className="filter d-flex justify-content-between align-items-center mb-4">
//         <div className="d-flex">
//           <div className="d-flex flex-column me-4">
//             <h6>Select Frequency</h6>
//             <Select value={frequency} onChange={(value) => setFrequency(value)}>
//               <Select.Option value="7">Last 1 Week</Select.Option>
//               <Select.Option value="30">Last 1 Month</Select.Option>
//               <Select.Option value="365">Last 1 Year</Select.Option>
//               <Select.Option value="custom">Custom</Select.Option>
//             </Select>

//             {frequency === "custom" && (
//               <div className="mt-2">
//                 <RangePicker
//                   value={selectedRange}
//                   onChange={(values) => setSelectedRange(values)}
//                 />
//               </div>
//             )}
//           </div>
//           <div className="d-flex flex-column mx-5">
//             <h6>Select Type</h6>
//             <Select value={type} onChange={(value) => setType(value)}>
//               <Select.Option value="all">All</Select.Option>
//               <Select.Option value="income">Income</Select.Option>
//               <Select.Option value="expense">Expense</Select.Option>
//             </Select>
//           </div>
//         </div>
        
//         <div className="d-flex align-items-center position-relative" style={{ width: '100%' }}>
//   <h2 
//     className="mb-0 position-absolute start-50" 
//     style={{ transform: 'translateX(-150%)', zIndex: 1 }}
//   >
//     Analytics
//   </h2>

//   <div className="ms-auto">
//     <Button 
//       type="primary" 
//       icon={<ArrowLeftOutlined />} 
//       onClick={() => navigate('/')}
//       style={{
//         backgroundColor: '#4facfe',
//         border: 'none'
//       }}
//     >
//       BACK TO EXPENSES
//     </Button>
//   </div>
// </div>

//       </div>

//       <div className="analytics-container" style={{
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//         width: '100%'
//       }}>
//         <div style={{ width: '90%', maxWidth: '1200px' }}>
//           <Analatics transactions={transactionsData} />
//         </div>
//       </div>
//     </DefaultLayout>
//   );
// }

// export default AnalyticsPage;




import React, { useEffect, useState } from "react";
import axios from "axios";
import { DatePicker, message, Select } from "antd";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import Analatics from "../components/Analatics";
import "../resources/savings.css"; // use savings page layout & styles

const { RangePicker } = DatePicker;

function AnalyticsPage() {
  const [loading, setLoading] = useState(false);
  const [transactionsData, setTransactionsData] = useState([]);
  const [frequency, setFrequency] = useState("30");
  const [type, setType] = useState("all");
  const [selectedRange, setSelectedRange] = useState([]);
  const navigate = useNavigate();

  const getTransactions = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("ExpenseTracker"));
      setLoading(true);
      const response = await axios.post(
        "/api/transactions/get-all-transactions",
        {
          userid: user._id,
          frequency,
          ...(frequency === "custom" && { selectedRange }),
          type,
        }
      );
      setTransactionsData(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error("Something went wrong");
    }
  };

  useEffect(() => {
    getTransactions();
  }, [frequency, selectedRange, type]);

  return (
    <div className="expense-tracker-container">
      {loading && <Spinner />}

      {/* Header bar same as SavingGoals */}
      <div className="savings-navbar">
        <div className="nav-left">
          <h1>Analytics</h1>
        </div>
        <div className="nav-right">
          <button className="back-btn" onClick={() => navigate("/")}>
            ← Back to Expenses
          </button>
        </div>
      </div>

      {/* Filters Row */}
      <div className="content-section">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "20px",
            marginBottom: "20px",
          }}
        >
          {/* Frequency Selector */}
          <div style={{ flex: 1 }}>
            <label style={{ fontWeight: 600, marginBottom: 5, display: "block" }}>
              Select Frequency
            </label>
            <Select
              value={frequency}
              onChange={(value) => setFrequency(value)}
              style={{ width: "100%" }}
            >
              <Select.Option value="7">Last 1 Week</Select.Option>
              <Select.Option value="30">Last 1 Month</Select.Option>
              <Select.Option value="365">Last 1 Year</Select.Option>
              <Select.Option value="custom">Custom</Select.Option>
            </Select>

            {frequency === "custom" && (
              <RangePicker
                value={selectedRange}
                onChange={(values) => setSelectedRange(values)}
                style={{ marginTop: 10, width: "100%" }}
              />
            )}
          </div>

          {/* Type Selector */}
          <div style={{ flex: 1 }}>
            <label style={{ fontWeight: 600, marginBottom: 5, display: "block" }}>
              Select Type
            </label>
            <Select
              value={type}
              onChange={(value) => setType(value)}
              style={{ width: "100%" }}
            >
              <Select.Option value="all">All</Select.Option>
              <Select.Option value="income">Income</Select.Option>
              <Select.Option value="expense">Expense</Select.Option>
            </Select>
          </div>
        </div>

        {/* Analytics Graph */}
        <div>
          <Analatics transactions={transactionsData} />
        </div>
      </div>
    </div>
  );
}

export default AnalyticsPage;

