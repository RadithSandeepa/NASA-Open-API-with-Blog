import React, { useContext } from "react";
import NEOFeed from "../miniComponents/asteroid/NEOFeed";
import { Context } from "../../main";
import { Navigate } from "react-router-dom";

const getCurrentDate = () => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

const Asteroid = () => {
  const { mode, isAuthenticated } = useContext(Context);
  const currentDate = getCurrentDate();

  const apiKey = import.meta.env.VITE_NASA_API_KEY;

  if (!isAuthenticated) {
    return <Navigate to={"/"} />;
  }

  if (!apiKey) {
    return (
      <article className={mode === "dark" ? "dark-bg" : "light-bg"}>
        <p>NASA API key is missing. Set VITE_NASA_API_KEY in your .env file.</p>
      </article>
    );
  }

  return (
    <article className={mode === "dark" ? "dark-bg" : "light-bg"}>
      <NEOFeed startDate={currentDate} endDate={currentDate} apiKey={apiKey} />
    </article>
  );
};

export default Asteroid;
