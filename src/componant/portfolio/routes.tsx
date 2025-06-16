import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from "./home";

import About from "./about";
import Login from "../signin&login/login";
import SignIn from "../signin&login/signup";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;