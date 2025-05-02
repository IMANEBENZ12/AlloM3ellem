import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next"; // Import useTranslation
import Navbar from "./Navbar.js";
import "./Services.css";

const ServicesPage = () => {
  const { t, i18n } = useTranslation(); // Initialize translation hook

  const serviceData = [
    {
      title: t("homeCleaning"),
      description: t("homeCleaningDesc"),
      image: "/images/cleaning.png",
      link: "/cleaning-booking"
    },
    {
      title: t("electricalHelp"),
      description: t("electricalHelpDesc"),
      image: "/images/electritian.png",
      link: "/electrical-booking"
    },
    {
      title: t("plumbingHelp"),
      description: t("plumbingHelpDesc"),
      image: "/images/plumb.jpg",
      link: "/plumbing-booking"
    },
    {
      title: t("carpentryHelp"), // New Carpentry Service
      description: t("carpentryHelpDesc"),
      image: "/images/Carpentry.png",
      link: "/carpentry-booking"
    },
    {
      title: t("acRepairs"), // New A/C Repairs Service
      description: t("acRepairsDesc"),
      image: "/images/ac.png",
      link: "/ac-booking"
    }
  ];

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng); // Change the language
  };

  return (
    <div className="services-page">
      <Navbar />

      <h1>{t("servicesTitle")}</h1>
      <p className="subtitle">{t("servicesSubtitle")}</p>
      <div className="services-list">
        {serviceData.map((service, index) => (
          <div className="service-card" key={index}>
            <img src={service.image} className="service-image" alt={service.title} />
            <h2>{service.title}</h2>
            <p>{service.description}</p>
            <Link to={service.link} className="book-now-btn">
              {t("bookNow")}
            </Link>
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className="footer">
        <p>{t("footer")}</p>
      </footer>
    </div>
  );
};

export default ServicesPage;