import { createFileRoute } from "@tanstack/react-router";
import NotFoundPage from "../../landing/pages/NotFoundPage";

export const Route = createFileRoute("/landing/not-found")({
  component: () => (
    <NotFoundPage />
  ),
});
