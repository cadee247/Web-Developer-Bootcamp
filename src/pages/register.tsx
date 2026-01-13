import { useState } from "react";

// RegisterPage component handles user registration
export default function RegisterPage() {
  // Local state for form inputs and feedback message
  const [name, setName] = useState("");       // stores user's name input
  const [email, setEmail] = useState("");     // stores user's email input
  const [password, setPassword] = useState(""); // stores user's password input
  const [message, setMessage] = useState(""); // stores success/error message after registration attempt

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // prevent default page reload on form submit

    try {
      // Send registration data to backend API
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }), // send user input as JSON
      });

      // Parse response and set feedback message
      const data = await res.json();
      setMessage(data.message || data.error);
    } catch {
      // Catch network or unexpected errors
      setMessage("Something went wrong");
    }
  };

  return (
    <div className="auth-container">
      <div className="card">
        <h1>Register</h1>

        {/* Registration form */}
        <form onSubmit={handleSubmit}>
          {/* Name input field */}
          <input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          {/* Email input field */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* Password input field */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* Submit button */}
          <button type="submit">Create Account</button>
        </form>

        {/* Feedback message display */}
        {message && <p style={{ marginTop: "1rem" }}>{message}</p>}

        {/* Link to login page */}
        <div className="link">
          <a href="/login">Already have an account?</a>
        </div>
      </div>
    </div>
  );
}