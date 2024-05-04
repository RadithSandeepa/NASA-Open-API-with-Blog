import React, { useContext, useState } from "react";
import LatestBlogs from "../miniComponents/LatestBlogs";
import HeroSection from "../miniComponents/HeroSection";
import TrendingBlogs from "../miniComponents/TrendingBlogs";
import { Context } from "../../main";
import { Navigate, useParams } from "react-router-dom";

const Home = () => {
  const { mode, blogs,isAuthenticated } = useContext(Context);
  const filteredBlogs = blogs.slice(0, 6);
  if (!isAuthenticated) {
    return <Navigate to={"/"} />;
  }
  return (
    <>
      <article className={mode === "dark" ? "dark-bg" : "light-bg"}>
      <h2 style={{ marginLeft: "100px", padding: "10 0 0 20px" }}>Astronomy Picture of the Day </h2>
        <HeroSection />
        <h2 style={{ marginLeft: "100px" }}>Latest Nasa Blogs </h2>
        <TrendingBlogs />
        <LatestBlogs heading={"Latest Blogs"} blogs={filteredBlogs} />
      </article>
    </>
  );
};

export default Home;
