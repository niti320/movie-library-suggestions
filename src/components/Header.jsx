"use client"; // Ensure this is a Client Component

import React, { useState, useEffect } from "react";
import styles from "@/styles/App.css";
import AOS from "aos";
import { FaBars } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { account } from "@/lib/appwrite";
import "aos/dist/aos.css";

function Header() {
  const [username, setUsername] = useState(""); // state for username
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

    // Fetch the logged-in user's data from Appwrite
    const fetchUserData = async () => {
      try {
        const user = await account.get();
        setUsername(user.name);
      } catch (err) {
        // console.error("Failed to fetch user data:", err);
      }
    };

    fetchUserData();
  }, []);

  const toggleMenu = () => {
    const menu = document.getElementById("verticalmenu");
    if (!verticalMenu) {
      setVerticalMenu(true);
      menu.style.top = "80px";
    } else {
      setVerticalMenu(false);
      menu.style.top = "-150px";
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (searchTerm) {
      router.push(`/search-result?query=${encodeURIComponent(searchTerm)}`); // ✅ Next.js navigation
    }
    setShowSearchOverlay(false);
  };

  return (
    <>
      {username && (
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
              <button className="NavButton">
                <Link href="/login" style={{ display: "flex", gap: "8px" }}>
                  <i className="fa-solid fa-user" style={{ fontSize: "15px", color: "white" }}></i>
                  <p style={{ fontSize: "12px", fontWeight: "normal" }}>
                    {username ? username : "Login"}
                  </p>
                </Link>
              </button>
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
      )}
  
      {/* Vertical Menu */}
      <div id="verticalmenu" className={`verticalMenu ${verticalMenu ? "open" : ""}`}>
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
