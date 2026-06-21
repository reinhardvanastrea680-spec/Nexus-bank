function generateAccountNumber() {
  const firstDigit = Math.floor(Math.random() * 9) + 1;
  const remaining = Math.floor(Math.random() * 1e9).toString().padStart(9, "0");
  return `${firstDigit}${remaining}`;
}
function generateTransactionRef() {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}
export {
  generateTransactionRef as a,
  generateAccountNumber as g
};
