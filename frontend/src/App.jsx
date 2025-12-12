import { useState } from "react";
import "./App.css";

import useUsers from "./hooks/useUsers";

// Pages
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import WordPage from "./pages/WordPage.jsx";
import ResultPage from "./pages/ResultPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import LoadingPage from "./pages/LoadingPage.jsx";

/* =========================================================
   ROOT APP
========================================================= */

export default function App() {
  const userSystem = useUsers();
  const { currentUser, avatar, logout } = userSystem;

  const [page, setPage] = useState("login");
  const [result, setResult] = useState(null);

  const go = (p) => setPage(p);

  return (
    <div className="app">

      {/* Hide navbar when not logged in */}
      {currentUser && page !== "login" && page !== "register" && (
        <Navbar
          currentUser={currentUser}
          avatar={avatar}
          go={go}
          logout={logout}
        />
      )}

      <main className="main">

        {/* LOGIN PAGE */}
        {page === "login" && (
          <LoginPage
            userSystem={userSystem}
            onLogin={() => go("dashboard")}
            goRegister={() => go("register")}
          />
        )}

        {/* REGISTER PAGE */}
        {page === "register" && (
          <RegisterPage
            userSystem={userSystem}
            goLogin={() => go("login")}
            onRegister={() => go("dashboard")}
          />
        )}

        {/* SETTINGS PAGE */}
        {page === "settings" && (
          <SettingsPage
            userSystem={userSystem}
            goBack={() => go("dashboard")}
          />
        )}

        {/* WORD PAGE */}
        {page === "word" && (
          <WordPage
            username={currentUser}
            onResult={(res) => {
              setResult(res);
              go("result");
            }}
          />
        )}

        {/* RESULT PAGE */}
        {page === "result" && (
          <ResultPage
            data={result}
            goDashboard={() => go("dashboard")}
            goRetry={() => go("word")}
          />
        )}

        {/* DASHBOARD PAGE */}
        {page === "dashboard" && (
          <DashboardPage
            username={currentUser}
            goWord={() => go("word")}
          />
        )}

        {/* OPTIONAL LOADING PAGE */}
        {page === "loading" && <LoadingPage />}

      </main>
    </div>
  );
}

/* =========================================================
   NAVBAR (Multi-user, Avatar, Menu)
========================================================= */

function Navbar({ currentUser, avatar, go, logout }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="nav-logo">worddee.ai</div>

      <nav className="nav-links">
        <button
          className="nav-link"
          onClick={() => go("dashboard")}
        >
          My Progress
        </button>

        <button
          className="nav-link"
          onClick={() => go("word")}
        >
          Word of the Day
        </button>
      </nav>

      {/* Avatar */}
      <div
        className="nav-profile"
        style={{
          cursor: "pointer",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontWeight: 700,
          fontSize: 14,
          background: "#e0f2fe",
          border: "2px solid #0ea5e9",
          color: "#0369a1",
        }}
        onClick={() => setOpen(!open)}
      >
        {avatar}
      </div>

      {/* Dropdown menu */}
      {open && (
        <div
          style={{
            position: "absolute",
            top: 56,
            right: 20,
            background: "#fff",
            borderRadius: 10,
            border: "1px solid #e5e7eb",
            padding: "10px 0",
            width: 160,
            boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
            zIndex: 999,
          }}
        >
          <button
            className="nav-link"
            style={{ width: "100%", textAlign: "left", padding: "8px 14px" }}
            onClick={() => {
              setOpen(false);
              go("settings");
            }}
          >
            Settings
          </button>

          <button
            className="nav-link"
            style={{
              width: "100%",
              textAlign: "left",
              padding: "8px 14px",
              color: "#dc2626",
            }}
            onClick={() => {
              logout();
              go("login");
            }}
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
}
