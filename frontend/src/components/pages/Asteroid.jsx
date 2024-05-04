import React, { useContext } from "react";
import NEOFeed from "../miniComponents/asteroid/NEOFeed";
import { Context } from "../../main";
import { Navigate, useParams } from "react-router-dom";


const getCurrentDate = () => {
  const today = new Date();
  return today.toISOString().split("T")[0]; 
};

const Asteroid = () => {
  const { mode, isAuthenticated } = useContext(Context);
  const currentDate = getCurrentDate(); 

  const apiKey = "hfA6XEeYBj51cs0g3Prv5deINF32uIx9e743BLzM"; 
  if (!isAuthenticated) {
    return <Navigate to={"/"} />;
  }
  return (
    <article className={mode === "dark" ? "dark-bg" : "light-bg"}>
      <NEOFeed startDate={currentDate} endDate={currentDate} apiKey={apiKey} />
    </article>
  );
};

export default Asteroid;
