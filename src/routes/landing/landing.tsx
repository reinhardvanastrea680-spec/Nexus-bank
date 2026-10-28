import { createFileRoute, Outlet } from "@tanstack/react-router";
import { LandingLayout } from "../../landing/layout";
export const Route = createFileRoute("/landing/landing")({
  component: () => (
    <Outlet />
  ),
});
