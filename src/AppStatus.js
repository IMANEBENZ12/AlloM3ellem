import React from 'react';
import './AppStatus.css';

const AppStatus = () => {
  return (
    <div className="app-container">
      <header className="app-header">
        <div className="logo-container">
          <img 
            src="/images/service-a-domicile.png" 
            alt="Angi Logo" 
            className="angi-logo" 
          />
        </div>
        <div className="help-link">
          <a href="#">Need Help?</a>
        </div>
      </header>

      <main className="status-container">
        <div className="status-card">
          <div className="status-icon">
            <div className="check-circle">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
          </div>
          
          <h1 className="status-title">Hold on just a minute!</h1>
          
          <p className="status-message">
            You have already applied for the AlloM3ellem Services platform. Please 
            check your email to see if there are any updates on your 
            application.
          </p>
        </div>
      </main>
    </div>
  );
};

export default AppStatus;