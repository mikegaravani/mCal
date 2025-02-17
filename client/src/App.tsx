import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import HomePage from "./components/HomePage/HomePage";

function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* ROUTES WITH SIDEBAR LAYOUT */}
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
          </Route>

          {/* ROUTES WITHOUT SIDEBAR LAYOUT */}
        </Routes>
      </Router>
    </>
  );
}

export default App;
