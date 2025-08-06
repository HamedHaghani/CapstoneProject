import React from "react";
import { useNavigate } from "react-router-dom";
import "./IntroPage.css"; // fallback styles if needed

const IntroPage = () => {
  const navigate = useNavigate();

  const backgroundStyle = {
    backgroundImage: `url(${process.env.PUBLIC_URL + "/intro-bg.jpg"})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "white",
    textAlign: "center",
    padding: "2rem",
  };

  return (
    <div style={backgroundStyle}>
      <div style={{ transform: "translateY(-40px)" }}>
      <h1>Welcome to TaskForce</h1>
      <p>Please select your role to continue</p>
      <div style={{ marginTop: "2rem" }}>
        <button onClick={() => navigate("/main")} className="intro-button">
          Employee Access
        </button>
        <button
          onClick={() => navigate("/pin")}
          className="intro-button"
          style={{ marginLeft: "1rem" }}
        >
          Manager Access
        </button>
      </div>
      </div>
    </div>
  );
};

export default IntroPage;
