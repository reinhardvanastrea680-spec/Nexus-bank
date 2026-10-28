import { createFileRoute } from "@tanstack/react-router";
import { LandingLayout } from "../../landing/layout";
import AccountPending from "../../landing/pages/AccountPending";

export const Route = createFileRoute("/landing/account-pending")({
  component: () => (
    <LandingLayout>
      <AccountPending />
    </LandingLayout>
  ),
});
