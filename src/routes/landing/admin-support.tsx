import { createFileRoute } from "@tanstack/react-router";
import AdminSupportPage from "../../landing/pages/AdminSupportPage";

export const Route = createFileRoute("/landing/admin-support")({
  component: () => (
    <AdminSupportPage />
  ),
});
