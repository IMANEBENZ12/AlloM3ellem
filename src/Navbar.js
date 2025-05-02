import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next"; // Import useTranslation
import "./Home.css";

const Navbar = () => {
  const { t, i18n } = useTranslation(); // Initialize translation hook
  const [username, setUsername] = useState(null);

  useEffect(() => {
    // Retrieve user data from localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.firstName) {
      setUsername(user.firstName); // Set the username from the user's first name
    }
  }, []);

  const handleLanguageChange = (lng) => {
    i18n.changeLanguage(lng); // Change the language globally
    localStorage.setItem("language", lng); // Save the selected language to localStorage
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <img src="images/service-a-domicile.png" alt="Logo" className="logo-img" />
      </div>
      <div className="nav-buttons">
        <Link to="/home" className="nav-btn">{t("home")}</Link>
        <Link to="/services" className="nav-btn">{t("services")}</Link>
        <Link to="/apply" className="nav-btn">{t("becomeAPro")}</Link>
        {username ? (
          <Link to="/profile" className="welcome-message">{t("hi")}, {username}</Link> // Display username if logged in
        ) : (
          <Link to="/login" className="login-btn">{t("login")}</Link> // Show "Log in" if not logged in
        )}
      </div>

      {/* Language Switcher */}
      <div className="language-switcher">
        <button
          onClick={() => handleLanguageChange("en")}
          className={i18n.language === "en" ? "active" : ""}
        >
          English
        </button>
        <button
          onClick={() => handleLanguageChange("fr")}
          className={i18n.language === "fr" ? "active" : ""}
        >
          Français
        </button>
        <button
          onClick={() => handleLanguageChange("ar")}
          className={i18n.language === "ar" ? "active" : ""}
        >
          العربية
        </button>
      </div>
    </nav>
  );
};

export default Navbar;