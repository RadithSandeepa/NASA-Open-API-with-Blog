import React, { useContext } from "react";
import { Context } from "../../main";

const About = () => {
  const { mode } = useContext(Context);
  return (
    <article className={mode === "dark" ? "dark-bg about" : "light-bg about"}>
      <div className="container">
        <h2>Orbit Navigator</h2>
        <p>
        Welcome to Orbit Navigator, your ultimate source for all things space and beyond! Our blog is dedicated to exploring 
        the vast wonders of the universe, from the smallest particles to the grandest galaxies. We invite you to journey with 
        us as we unravel the mysteries of space, one discovery at a time.
        </p>
        <p>
        At Orbit Navigator, we cover a diverse range of space-related topics, catering to everyone from casual stargazers to 
        avid astronomers. We bring you the latest news from space agencies like NASA and ESA, breakthroughs in astrophysics, and 
        exciting missions to explore distant planets and galaxies. Our team of space enthusiasts is passionate about sharing their 
        knowledge and insights, providing you with in-depth articles, fascinating infographics, and thought-provoking discussions.
        </p>
        <p>
        We also delve into the history of space exploration, spotlighting the pioneers who paved the way for humanity's reach into 
        the cosmos. Whether you're interested in black holes, exoplanets, or the future of space travel, we have something for you.
        </p>
        <p>
        Our mission is to inspire curiosity, promote scientific understanding, and encourage a sense of wonder about the universe. 
        We believe that exploring space is not just about reaching new frontiers; it's about connecting with something larger than ourselves. 
        Thank you for joining us at Orbit Navigator—let's explore the stars together! Don't forget to subscribe to stay updated with our 
        latest content and join the conversation on social media.
        </p>
      </div>
    </article>
  );
};

export default About;
