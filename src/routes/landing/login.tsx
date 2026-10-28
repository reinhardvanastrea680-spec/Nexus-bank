import { createFileRoute } from "@tanstack/react-router";
import LoginPage from "../../landing/pages/LoginPage";

export const Route = createFileRoute("/landing/login")({
  component: () => (
    <LoginPage />
  ),
});
