function exportToCSV(data, filename) {
  if (data.length === 0) {
    return;
  }
  const allKeys = /* @__PURE__ */ new Set();
  data.forEach((item) => {
    Object.keys(item).forEach((key) => allKeys.add(key));
  });
  const headers = Array.from(allKeys);
  const csvContent = [
    headers.join(","),
    ...data.map((item) => {
      return headers.map((key) => {
        let value = item[key];
        if (value === null || value === void 0) {
          return "";
        }
        if (typeof value === "object") {
          value = JSON.stringify(value);
        }
        if (typeof value === "string" && (value.includes(",") || value.includes("\n") || value.includes('"'))) {
          value = `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(",");
    })
  ].join("\n");
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
export {
  exportToCSV as e
};
