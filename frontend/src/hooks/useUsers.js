import { useState, useEffect } from "react";

export default function useUsers() {
  const [users, setUsers] = useState({});
  const [currentUser, setCurrentUser] = useState("");

  // Load from localStorage once
  useEffect(() => {
    const savedUsers = JSON.parse(localStorage.getItem("users") || "{}");
    const savedCurrent = localStorage.getItem("current_user") || "";
    setUsers(savedUsers);
    setCurrentUser(savedCurrent);
  }, []);

  // Save to localStorage when users change
  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  // Save current user
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("current_user", currentUser);
    } else {
      localStorage.removeItem("current_user");
    }
  }, [currentUser]);

  // ============================
  // Register new user
  // ============================
  const register = (username, password) => {
    const clean = username.toLowerCase();

    if (users[clean]) {
      return { ok: false, message: "Username already exists" };
    }

    const avatar = clean.charAt(0).toUpperCase();

    const newUsers = {
      ...users,
      [clean]: { password, avatar },
    };

    setUsers(newUsers);
    setCurrentUser(clean);

    return { ok: true };
  };

  // ============================
  // Login
  // ============================
  const login = (username, password) => {
    const clean = username.toLowerCase();

    if (!users[clean]) {
      return { ok: false, message: "User not found" };
    }

    if (users[clean].password !== password) {
      return { ok: false, message: "Wrong password" };
    }

    setCurrentUser(clean);
    return { ok: true };
  };

  // ============================
  // Logout
  // ============================
  const logout = () => {
    setCurrentUser("");
  };

  // ============================
  // Change username
  // ============================
  const changeUsername = (newName) => {
    const clean = newName.toLowerCase();

    if (users[clean]) {
      return { ok: false, message: "Username already taken" };
    }

    const old = currentUser;
    const data = users[old];

    const updatedUsers = { ...users };
    delete updatedUsers[old];

    updatedUsers[clean] = {
      ...data,
      avatar: clean.charAt(0).toUpperCase(),
    };

    setUsers(updatedUsers);
    setCurrentUser(clean);

    return { ok: true };
  };

  return {
    users,
    currentUser,
    avatar: users[currentUser]?.avatar || "?",
    register,
    login,
    logout,
    changeUsername,
  };
}
