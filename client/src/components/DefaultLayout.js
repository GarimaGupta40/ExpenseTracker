import React from "react";
import { Menu, Dropdown, Button, Space } from "antd";
import {useNavigate} from 'react-router-dom'

import "../resources/default-layout.css";
function DefaultLayout(props) {
  const user = JSON.parse(localStorage.getItem("ExpenseTracker"));
  const navigate = useNavigate()
  const menu = (
    <Menu
      items={[
        {
          label: (
            <li 
              onClick={() => {
                localStorage.removeItem('ExpenseTracker');
                navigate("/login");
              }} 
              style={{
                listStyle: 'none',
                textAlign: 'center',
                cursor: 'pointer',
                padding: '10px 0'
              }}
            >
              Logout
            </li>
          ),
        }
        
      ]}
    />
  );
  return (
    <div className="layout">
      <div className="header d-flex justify-content-between align-items-center">
        <div>
          <h1 className="logo">Expensify</h1>
        </div>
        <div>
        <Dropdown overlay={menu} placement="bottomLeft">
  <button
    className="primary"
    style={{
      color: 'black',
      fontSize: '16px', // slightly bigger font
      fontWeight: 'light' // optional for better visibility
    }}
  >
    Welcome {user.name}
  </button>
</Dropdown>

        </div>
      </div>

      <div className="content">{props.children}</div>
    </div>
  );
}

export default DefaultLayout;
