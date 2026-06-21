import { CheckCircle2, XCircle, MinusCircle } from "lucide-react";

interface StatusBadgeProps {
  status: "pending" | "approved" | "declined" | "cancelled";
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const styles = {
    pending: {
      background: "rgba(255, 171, 0, 0.12)",
      borderColor: "rgba(255, 171, 0, 0.3)",
      textColor: "#FFAB00",
      label: "Pending",
    },
    approved: {
      background: "rgba(0, 230, 118, 0.1)",
      borderColor: "rgba(0, 230, 118, 0.25)",
      textColor: "#00E676",
      label: "Approved",
    },
    declined: {
      background: "rgba(255, 23, 68, 0.1)",
      borderColor: "rgba(255, 23, 68, 0.25)",
      textColor: "#FF1744",
      label: "Declined",
    },
    cancelled: {
      background: "rgba(122, 143, 166, 0.1)",
      borderColor: "rgba(122, 143, 166, 0.2)",
      textColor: "#7A8FA6",
      label: "Cancelled",
    },
  };

  const style = styles[status];

  const icon =
    status === "approved" ? (
      <CheckCircle2 size={12} />
    ) : status === "declined" ? (
      <XCircle size={12} />
    ) : status === "cancelled" ? (
      <MinusCircle size={12} />
    ) : (
      <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: "#FFAB00" }} />
    );

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border"
      style={{
        backgroundColor: style.background,
        borderColor: style.borderColor,
        color: style.textColor,
      }}
    >
      {icon}
      {style.label}
    </span>
  );
}
