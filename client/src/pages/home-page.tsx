import { useEffect } from "react";
import { Redirect } from "wouter";

export default function HomePage() {
  // Redirect to dashboard page
  return <Redirect to="/dashboard" />;
}
