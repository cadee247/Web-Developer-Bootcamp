import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

// Signup component handles user registration
export default function Signup() {
  // Local state for form inputs
  const [name, setName] = useState("");       // stores user's name input
  const [email, setEmail] = useState("");     // stores user's email input
  const [password, setPassword] = useState(""); // stores user's password input

  const router = useRouter(); // Next.js router for navigation

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent default page reload on form submit
    try {
      // Send registration data to backend API using axios
      await axios.post("/api/register", { name, email, password });

      // Show success message and redirect to login page
      alert("User created! You can now login.");
      router.push("/login");
    } catch (err) {
      // Show error message if registration fails
      alert("Error creating user: " + err.response?.data?.message || err.message);
    }
  };

  return (
    // Registration form
    <form onSubmit={handleSubmit}>
      <h1>Sign Up</h1>

      {/* Name input field */}
      <input
        placeholder="Name"
        value={name}
        onChange={e => setName(e.target.value)}
      />

      {/* Email input field */}
      <input
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />

      {/* Password input field */}
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />

      {/* Submit button */}
      <button type="submit">Register</button>
    </form>
  );
}