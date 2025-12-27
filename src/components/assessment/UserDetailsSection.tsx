import React, { useState } from "react";
import { UserDetailsForm } from "./UserDetailsForm"; // import your existing form
import { UserDetails } from "@/types/assessment";

export function UserDetailsSection() {
  const [userDetails, setUserDetails] = useState<UserDetails>({
    name: "",
    email: "",
    age: "",
    gender: "",
  });

  // Handles form submission
  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:8000/user-details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userDetails),
      });

      const data = await response.json();
      console.log("Server response:", data);
      alert("User details sent successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to send user details");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <UserDetailsForm data={userDetails} onChange={setUserDetails} />
      <button
        type="submit"
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded"
      >
        Submit
      </button>
    </form>
  );
}
