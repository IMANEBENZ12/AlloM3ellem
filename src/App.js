import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
//import SelectRole from "./SelectRole";

import Home from "./Home";
import Login from "./Login";
import ServicesPage from "./Services";
import CleaningBooking from "./CleaningBooking";
import Apply from "./Apply";
import Apply1 from "./Apply1"; 
import Booking from "./Booking";
import Booking2 from "./Booking2";
import Finalize from "./Finalize";
import Handymen from "./Handymen";
import FinalizePlumbing from "./FinalizePlumbing";
import FinalizeCleaning from './FinalizeCleaning';
import Profile from './Profile'; 
import CarpentryBooking from './CarpentaryBooking';
import FinalizeCarpentry from './FinalizeCarpentry';
import ACBooking from './ACBooking'; // Import ACBooking
import FinalizeAC from './FinalizeAC'; 
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Home" element={<Home />} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/cleaning-booking" element={<CleaningBooking />} /> 
        <Route path="/apply" element={<Apply />} />
        <Route path="/apply1" element={<Apply1 />} />
        <Route path="/plumbing-booking" element={<Booking />} />
        <Route path="/electrical-booking" element={<Booking2 />} />
        <Route path="/finalize" element={<Finalize />} />
        <Route path="/finalize-plumbing" element={<FinalizePlumbing />} />
        <Route path="/finalize-cleaning" element={<FinalizeCleaning />} /> 
        <Route path="/handymen" element={<Handymen />} />
        <Route path="/carpentry-booking" element={<CarpentryBooking />} />
        <Route path="/finalize-carpentry" element={<FinalizeCarpentry />} /> 
        <Route path="/ac-booking" element={<ACBooking />} /> {/* Add ACBooking route */}
        <Route path="/finalize-ac" element={<FinalizeAC />} />
      </Routes>
    </Router>
  );
};

export default App;