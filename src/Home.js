import React from "react";
import "./Home.css";

function Home() {
  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Welcome to My App!</h1>
      </header>

      <div className="banner">
        <h2>My name is Feras Machta</h2>
        <p>Welcome to my first React App!</p>
      </div>

      <div className="features">
        <div className="feature-card">
          <h3>Page 1: Home Page</h3>
          <p>This Page that you are looking at currently!</p>
        </div>
        <div className="feature-card">
          <h3>Page 2: TicTacToe</h3>
          <p>A basic React TicTacToe Game</p>
        </div>
        <div className="feature-card">
          <h3>Page 3: Api</h3>
          <p>Demsontration of the use of API's in React</p>
        </div>
      </div>

      <footer className="home-footer">
        <p>
          <strong>Github:</strong> https://github.com/fmachta
        </p>
        <p>
          <strong>Linkedin:</strong> https://www.linkedin.com/in/fmachta/
        </p>
        {/* Social media icons or links */}
      </footer>
    </div>
  );
}

export default Home;
