import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";


function formatTime(milliseconds) {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const mins = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const secs = (totalSeconds % 60).toString().padStart(2, "0");
  const ms = Math.floor((milliseconds % 1000) / 10).toString().padStart(2, "0");
  return `${mins}:${secs}:${ms}`;
}

function Stopwatch() {
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState([]);
  const intervalRef = useRef(null);

  const { darkMode, setDarkMode } = useTheme(); // ✅ context state use cheyyuka

  const playSound = (type) => {
    const sounds = {
      start: "https://actions.google.com/sounds/v1/cartoon/wood_plank_flicks.ogg",
      pause: "https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg",
      reset: "https://actions.google.com/sounds/v1/cartoon/wood_plank_flicks.ogg",
      lap: "https://actions.google.com/sounds/v1/cartoon/pop.ogg",
    };
    if (!sounds[type]) return;
    const audio = new Audio(sounds[type]);
    audio.currentTime = 0;
    audio.play();
  };

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTime((prev) => prev + 10);
      }, 10);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const toggleRunning = () => {
    playSound(running ? "pause" : "start");
    setRunning((prev) => !prev);
  };

  const handleReset = () => {
    playSound("reset");
    setTime(0);
    setRunning(false);
    setLaps([]);
  };

  const handleLap = () => {
    if (running) {
      playSound("lap");
      setLaps((prev) => [time, ...prev]);
    }
  };

  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const secondsPassed = Math.floor(time / 1000) % 60;
  const progress = (secondsPassed / 60) * circumference;

  return (
    <div className="relative min-h-screen overflow-hidden w-full flex items-center justify-center px-4">
    <div
    className={`w-full max-w-md p-8 rounded-3xl shadow-2xl border transition-colors duration-500 ${
      darkMode
        ? "bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 text-white"
        : "bg-gradient-to-br from-white/70 to-blue-100 border-gray-200 text-gray-900"
    }`}
    style={{
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      backgroundBlendMode: "overlay",
    }}
  >

        {/* Theme Toggle */}
        <button
          onClick={() => setDarkMode((prev) => !prev)}
          className="mb-6 px-4 py-2 rounded-full border border-indigo-600 hover:bg-indigo-600 hover:text-white text-sm transition duration-300"
        >
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>

        <h2 className="text-4xl font-extrabold mb-8 text-center select-none">⏱ Stopwatch</h2>

        {/* Circular Timer */}
        <div className="relative w-[220px] h-[220px] mx-auto mb-8">
          <svg width={220} height={220} viewBox="0 0 220 220" style={{ transform: "rotate(-90deg)" }}>
            <circle
              r={radius}
              cx="110"
              cy="110"
              stroke={darkMode ? "#1F2937" : "#E0E7FF"}
              strokeWidth={12}
              fill="transparent"
            />
            <circle
              r={radius}
              cx="110"
              cy="110"
              stroke={darkMode ? "#4F46E5" : "#6366F1"}
              strokeWidth={12}
              fill="transparent"
              style={{
                strokeDasharray: circumference,
                strokeDashoffset: circumference - progress,
                transition: "stroke-dashoffset 0.2s linear",
              }}
            />
          </svg>
          <div
            className="absolute inset-0 flex items-center justify-center text-6xl font-mono font-bold select-text"
            style={{ color: darkMode ? "#818CF8" : "#4F46E5", textShadow: "0 0 8px rgba(0,0,0,0.6)" }}
          >
            {formatTime(time)}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-4 mb-6 flex-wrap">
          <motion.button
            onClick={toggleRunning}
            whileTap={{ scale: 0.9 }}
            className={`px-6 py-3 rounded-lg font-semibold shadow-lg focus:outline-none focus:ring-4 transition ${
              running
                ? "bg-red-600 hover:bg-red-700 text-white focus:ring-red-400"
                : "bg-green-600 hover:bg-green-700 text-white focus:ring-green-400"
            }`}
          >
            {running ? "Pause" : "Start"}
          </motion.button>

          <motion.button
            onClick={handleLap}
            whileTap={{ scale: 0.9 }}
            disabled={!running}
            className={`px-6 py-3 rounded-lg font-semibold shadow-lg transition focus:outline-none focus:ring-4 ${
              running
                ? "bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-400"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Lap
          </motion.button>

        <motion.button
  onClick={handleReset}
  whileTap={{ scale: 0.9 }}
  className="px-6 py-3 rounded-lg font-semibold shadow-lg 
    bg-red-600 hover:bg-red-700 text-white 
    dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 
    transition focus:outline-none focus:ring-4 focus:ring-red-400"
>
  Reset
</motion.button>

        </div>

        {/* Laps */}
        <div className="max-h-48 overflow-y-auto border-t pt-4 border-gray-300 dark:border-gray-700">
          {laps.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 select-none">No laps recorded</p>
          ) : (
            <ul className="space-y-2">
              {laps.map((lapTime, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex justify-between px-4 py-2 bg-indigo-50 dark:bg-indigo-900 rounded-lg font-mono text-indigo-700 dark:text-indigo-300 shadow-sm select-text"
                >
                  <span>Lap {laps.length - index}</span>
                  <span>{formatTime(lapTime)}</span>
                </motion.li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default Stopwatch;
