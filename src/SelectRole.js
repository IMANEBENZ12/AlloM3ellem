import React from "react";
import "./SelectRole.css"; // Import the CSS file
import { FaUserTie, FaHardHat } from "react-icons/fa";

const SelectRole = () => {
  return (
    <div className="container">
      <div className="card">
        <img src="/service-a-domicile.png" alt="Home Service" className="icon" />
        <h2>Select a Role</h2>

        <div className="role-buttons">
          {/* Client Role */}
          <a href="/signin" className="role-button">
            <FaUserTie className="role-icon client-icon" />
            <div className="role-text">
              <p className="role-title">Looking for a specialist</p>
              <p className="role-description">
                To place any type of order to search for a performer
              </p>
            </div>
          </a>

          {/* Service Provider Role */}
          <button className="role-button">
            <FaHardHat className="role-icon provider-icon" />
            <div className="role-text">
              <p className="role-title">Providing a service</p>
              <p className="role-description">
                To offer your services to potential clients
              </p>
            </div>
          </button>
        </div>

        {/* Language Selection */}
        <button className="language-button">Select Language</button>
      </div>
    </div>
  );
};

export default SelectRole;
