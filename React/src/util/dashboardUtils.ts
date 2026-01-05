export const getRiskLabel = (hba1c?: number) => {
  if (hba1c == null) return "Unknown";
  if (hba1c < 5.7) return "Normal";
  if (hba1c < 6.5) return "Prediabetes";
  return "Diabetes";
};
