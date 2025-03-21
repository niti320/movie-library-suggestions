"use client"; // Ensure this is a Client Component

import React, { useState, useEffect } from "react";
import styles from "@/styles/App.css";
import AOS from "aos";
import { FaBars } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "aos/dist/aos.css";

function Header() {
  const [showSearchOverlay, setShowSearchOverlay] = useState(false);
  const [verticalMenu, setVerticalMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const router = useRouter(); // ✅ Next.js router

  useEffect(() => {
    AOS.init({
      duration: 300,
      easing: "ease-in-out",
      once: true,
    });
  }, []);

  const toggleMenu = () => {
    setVerticalMenu((prev) => !prev);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (searchTerm) {
      router.push(`/search-result?query=${encodeURIComponent(searchTerm)}`);
    }
    setShowSearchOverlay(false);
  };

  return (
    <>
      <div className="HeaderBox">
        <div className="mainheader">
          <div className="NavButtons">
            <Link href="/" className="NavButton">
              <i className="fas fa-home" style={{ fontSize: "15px" }}></i>
              <p style={{ fontSize: "12px", fontWeight: "normal" }}>Home</p>
            </Link>
            <Link href="/top-rated" className="NavButton">
              <i className="fa-solid fa-tag" style={{ fontSize: "15px" }}></i>
              <p style={{ fontSize: "12px", fontWeight: "normal" }}>Top Rated</p>
            </Link>
            <Link href="/favorites" className="NavButton">
              <i className="fa-solid fa-bookmark" style={{ fontSize: "15px" }}></i>
              <p style={{ fontSize: "12px", fontWeight: "normal" }}>Favorites</p>
            </Link>
          </div>

          <div className="NavButtons2">
            <button className="NavButton" onClick={toggleMenu}>
              <FaBars color="white" size={"18px"} />
            </button>
          </div>

          <div className="NavButtons3">
            <button
              style={{ width: "40px" }}
              className="NavButton"
              onClick={() => setShowSearchOverlay(true)}
            >
              <i className="fa-solid fa-magnifying-glass" style={{ color: "white" }}></i>
            </button>
          </div>
        </div>
      </div>

      {/* Vertical Menu */}
      {verticalMenu && (
        <div id="verticalmenu" className="verticalMenu open">
          <Link href="/" className="NavButton">
            <i className="fas fa-home" style={{ fontSize: "15px" }}></i>
            <p style={{ fontSize: "12px", fontWeight: "normal" }}>Home</p>
          </Link>
          <Link href="/top-rated" className="NavButton">
            <i className="fa-solid fa-tag" style={{ fontSize: "15px" }}></i>
            <p style={{ fontSize: "12px", fontWeight: "normal" }}>Top Rated</p>
          </Link>
          <Link href="/favorites" className="NavButton">
            <i className="fa-solid fa-bookmark" style={{ fontSize: "15px" }}></i>
            <p style={{ fontSize: "12px", fontWeight: "normal" }}>Favorites</p>
          </Link>
        </div>
      )}

      {/* Search Overlay */}
      {showSearchOverlay && (
        <div className="search-overlay">
          <div className="search-container" data-aos="fade">
            <form onSubmit={handleSearchSubmit} className="form2">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search Movies"
                className="giant-search-bar"
              />
              <button
                type="button"
                className="close-button"
                onClick={() => setShowSearchOverlay(false)}
              >
                X
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;
