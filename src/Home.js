import React, { useState } from "react";
import { useTranslation } from "react-i18next"; // Import useTranslation
import { ShieldCheck, CalendarCheck, HeartHandshake } from "lucide-react";
import "./Home.css";
import Navbar from "./Navbar.js";
import LocationSearch from "./LocationSearch";

const HomePage = () => {
  const { t, i18n } = useTranslation(); // Initialize translation hook
  const [selectedLocation, setSelectedLocation] = useState(null);

  const handleLocationSelect = (location) => {
    console.log("User selected:", location);
    setSelectedLocation(location);
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng); // Change the language
  };

  return (
    <div className="homepage">
      <Navbar />
      

      {/* Hero Section */}
      <header className="hero">
        <div className="hero-content">
          <h1>{t("heroTitle")}</h1>
          <p>{t("heroSubtitle")}</p>
          <div className="search-container">
            <LocationSearch onSelect={handleLocationSelect} />
            {selectedLocation && <p>Selected Location: {selectedLocation}</p>}
          </div>
        </div>
      </header>

      {/* How It Works */}
      <section className="how-it-works">
        <h2>{t("howItWorks")}</h2>
        <div className="steps">
          <div className="step">
            <h3>{t("step1")}</h3>
            <p>{t("step1Desc")}</p>
          </div>
          <div className="step">
            <h3>{t("step2")}</h3>
            <p>{t("step2Desc")}</p>
          </div>
          <div className="step">
            <h3>{t("step3")}</h3>
            <p>{t("step3Desc")}</p>
          </div>
        </div>
      </section>

      {/* Promo Section */}
      <section className="promo">
        <h2>{t("whyChooseUs")}</h2>
        <div className="benefits-section">
          <div className="benefit-item">
            <div className="benefit-icon">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3>{t("vettedPros")}</h3>
          </div>
          <div className="benefit-item">
            <div className="benefit-icon">
              <CalendarCheck className="h-5 w-5" />
            </div>
            <h3>{t("nextDay")}</h3>
          </div>
          <div className="benefit-item">
            <div className="benefit-icon">
              <HeartHandshake className="h-5 w-5" />
            </div>
            <h3>{t("happinessGuarantee")}</h3>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>{t("footer")}</p>
      </footer>
    </div>
  );
};

export default HomePage;