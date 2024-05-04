
import React, { useState, useEffect, useContext } from "react";
import "./styles.css";
import { Context } from "../../../main";
import dummyAsteroidSVG from "./asteroid.svg"; // Your SVG image

const NEOFeed = ({ startDate, endDate, apiKey }) => {
  // const [mode, setMode] = useState(() => localStorage.getItem("mode") || "light");
  const { isAuthenticated } = useContext(Context);
  const [asteroids, setAsteroids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { mode, user } = useContext(Context);

  const textClass = mode === "light" ? "text-dark" : "text-light";


  useEffect(() => {
    const fetchAsteroids = async () => {
      try {
        const response = await fetch(
          `https://api.nasa.gov/neo/rest/v1/feed?start_date=${startDate}&end_date=${endDate}&api_key=${apiKey}`
        );

        if (!response.ok) throw new Error("Failed to fetch data");

        const data = await response.json();
        const asteroidsData = Object.values(data.near_earth_objects).flat();
        const enhancedAsteroids = asteroidsData.map((asteroid) => ({
          ...asteroid,
          isPotentiallyHazardous: asteroid.is_potentially_hazardous_asteroid,
        }));

        setAsteroids(enhancedAsteroids);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchAsteroids();
  }, [startDate, endDate, apiKey]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className={`neo-feed ${mode === "light" ? "light-mode" : "dark-mode"}`}>
      <h2 className={`title ${mode === "light" ? "text-dark" : "text-light"}`}>Near Earth Asteroids</h2>
      <div className="asteroid-list">
        {asteroids.map((asteroid, index) => (
          <div className="asteroid-card" key={index}>
            <div className="svg-asteroid-wrapper">
              <img
                src={dummyAsteroidSVG}
                alt="asteroid"
                className="svg-asteroid"
              />
            </div>
            <h3 className={`asteroid-name ${textClass}`}>{asteroid.name}</h3>
            <p className={`asteroid-info ${textClass}`}>
              <strong>Estimated Diameter (meters):</strong>
              {asteroid.estimated_diameter.meters.estimated_diameter_min.toFixed(3)} - 
              {asteroid.estimated_diameter.meters.estimated_diameter_max.toFixed(3)}
            </p>
            <p className={`asteroid-info ${textClass}`}>
              <strong>Hazardous:</strong> {asteroid.isPotentiallyHazardous ? "Yes" : "No"}
            </p>
            <p className={`asteroid-info ${textClass}`}>
              <strong>Magnitude:</strong> {asteroid.absolute_magnitude_h.toFixed(2)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NEOFeed;
