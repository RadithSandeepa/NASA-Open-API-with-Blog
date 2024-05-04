import React, { useEffect, useState, useContext } from "react";
import { BeatLoader } from "react-spinners";
import axios from "axios";
import { Context } from "../../main";

const HeroSection = () => {
  const { mode } = useContext(Context);
  const [apod, setApod] = useState(null);

  useEffect(() => {
    const fetchApod = async () => {
      try {
        const response = await axios.get(
          "https://api.nasa.gov/planetary/apod?api_key=hfA6XEeYBj51cs0g3Prv5deINF32uIx9e743BLzM"
        );
        setApod(response.data);
      } catch (error) {
        console.error("Error fetching NASA APOD:", error);
      }
    };

    fetchApod();
  }, []);

  return (
    <section>
      {apod ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "80vh",
          }}
        >
          <div
            className="apod-card"
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              border: "1px solid #ccc",
              borderRadius: "10px",
              overflow: "hidden",
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
              height: "80vh",
              width: "70vw",
              backgroundColor: mode === "dark" ? "black" : "white", // Adjust background color based on mode
            }}
          >
            {/* Image container */}
            <div
              className="image-container"
              style={{
                width: "35vw",
                height: "100%", // Ensures the image fills the height of the card
                backgroundColor: mode === "dark" ? "#333" : "#f5f5f5", // Darker background in dark mode
              }}
            >
              <img
                src={apod.url}
                alt="NASA APOD"
                className="apod-image"
                style={{
                  width: "100%", // Fills the width of the container
                  height: "100%", // Fills the height of the container
                  objectFit: "cover",
                }}
              />
            </div>

            {/* Description container */}
            <div
              className="description-container"
              style={{
                width: "30vw",
                padding: "20px",
                backgroundColor: mode === "dark" ? "black" : "white", // Adjust background color
                color: mode === "dark" ? "white" : "black", // Adjust text color
                height: "100%",
                overflowY: "auto",
              }}
            >
              <h2>{apod.title}</h2>
              <p>{apod.explanation}</p>
            </div>
          </div>
        </div>
      ) : (
        <BeatLoader color="gray" size={30} />
      )}
    </section>
  );
};

export default HeroSection;
