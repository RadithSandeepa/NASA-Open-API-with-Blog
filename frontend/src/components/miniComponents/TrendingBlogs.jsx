import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../../assets/Pagination.css"
// import "../assets/Pagination.css";

const TrendingBlogs = ({ heading, newClass }) => {
  const [blogs, setBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 9;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const randomQuery = getRandomQuery();
        const response = await axios.get(
          `https://images-api.nasa.gov/search?q=${randomQuery}`
        );
        const data = response.data.collection.items;
        setBlogs(data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setBlogs([]); // Set an empty array if there's an error
      }
    };

    fetchData();
  }, []);

  const getRandomQuery = () => {
    const queries = ["space", "mars", "nebula", "galaxy", "astronomy"];
    return queries[Math.floor(Math.random() * queries.length)];
  };

  // Get current blogs
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <section
      className={
        newClass && newClass.length > 0 ? "dashboard-blogs blogs" : "blogs"
      }
    >
      <h3>{heading}</h3>
      <div className="container">
        {currentBlogs.map((element, index) => (
          <Link
            to={{
              pathname: `/blog/${encodeURIComponent(element.data[0].title)}`,
              state: { title: element.data[0].title },
            }}
            className="card"
            key={index}
          >
            {element.links && element.links[0] && element.links[0].href && (
              <img src={element.links[0].href} alt="blog" />
            )}
            <span className="category">NASA Image</span>
            {element.data && element.data[0] && element.data[0].title && (
              <h4>{element.data[0].title}</h4>
            )}
            <p>{element.center}</p>
            <p>{element.description_508}</p>
            <p>{element.keywords ? element.keywords.join(", ") : ""}</p>
          </Link>
        ))}
      </div>
      {/* Pagination */}
      <ul
  className="pagination"
  style={{
    display: 'flex',
    justifyContent: 'center',
    gap: '8px',
    padding: '10px',
    listStyle: 'none',
  }}
>
  {Array.from({ length: Math.ceil(blogs.length / blogsPerPage) }).map(
    (_, index) => {
      const pageNumber = index + 1;
      const isActive = pageNumber === currentPage;

      return (
        <li key={index} className="page-item" style={{ padding: '5px' }}>
          <button
            onClick={() => paginate(pageNumber)}
            className={`page-link ${isActive ? 'active' : ''}`}
            style={{
              backgroundColor: isActive ? '#333' : '#f0f0f0',
              color: isActive ? '#fff' : '#333',
            }}
          >
            {pageNumber}
          </button>
        </li>
      );
    }
  )}
</ul>

    </section>
  );
};

export default TrendingBlogs;
