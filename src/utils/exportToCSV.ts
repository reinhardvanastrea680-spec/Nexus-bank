export function exportToCSV(data: any[], filename: string): void {
  if (data.length === 0) {
    return;
  }

  // Get all unique keys from data
  const allKeys = new Set<string>();
  data.forEach((item) => {
    Object.keys(item).forEach((key) => allKeys.add(key));
  });

  const headers = Array.from(allKeys);

  // Convert data to CSV rows
  const csvContent = [
    headers.join(","),
    ...data.map((item) => {
      return headers
        .map((key) => {
          let value = item[key];

          // Handle different data types
          if (value === null || value === undefined) {
            return "";
          }
          if (typeof value === "object") {
            value = JSON.stringify(value);
          }
          if (
            typeof value === "string" &&
            (value.includes(",") || value.includes("\n") || value.includes('"'))
          ) {
            value = `"${value.replace(/"/g, '""')}"`;
          }

          return value;
        })
        .join(",");
    }),
  ].join("\n");

  // Create download link
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
