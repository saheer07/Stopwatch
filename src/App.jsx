// src/App.jsx
import React from "react";
import Stopwatch from "./components/Stopwatch";
import { useTheme } from "./context/ThemeContext"; // 🔁 Correct path

function App() {
  const { darkMode } = useTheme(); // 🔁 This line makes App re-render on darkMode change

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        overflow: "hidden",
        background: darkMode
          ? "linear-gradient(to bottom right, #0f172a, #1e293b)"
          : "linear-gradient(to bottom right, #e0e7ff, #f8fafc)",
        transition: "background 0.5s ease",
      }}
    >
      <div
        style={{
          position: "relative",
          zIndex: 1,
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        <Stopwatch />
      </div>
    </div>
  );
}

export default App;
