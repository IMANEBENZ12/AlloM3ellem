import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SelectRole from "./SelectRole";
import HomePage from "./HomePage";
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

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SelectRole />} />
        <Route path="/SelectRole" element={<SelectRole />} />
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/Home" element={<Home />} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/cleaning-booking" element={<CleaningBooking />} /> 
        <Route path="/apply" element={<Apply />} />
        <Route path="/apply1" element={<Apply1 />} />
        <Route path="/plombing-booking" element={<Booking />} />
        <Route path="/electrical-booking" element={<Booking2 />} />
        <Route path="/finalize" element={<Finalize />} />
        <Route path="/handymen" element={<Handymen />} />
      </Routes>
    </Router>
  );
};

export default App;