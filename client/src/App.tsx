import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import ConditionalLayout from "./components/ConditionalLayout";

function App() {
  return (
    <>
      <Router>
        <ConditionalLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
          </Routes>
        </ConditionalLayout>
      </Router>
    </>
  );
}

export default App;
