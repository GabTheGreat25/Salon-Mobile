export const Colors = {
  dark: {
    backgroundColor: "#212B36",
    textColor: "#e5e5e5",
    borderColor: "#e5e5e5",
    shadowColor: getShadowColor("#212B36"),
  },
  light: {
    backgroundColor: "#e5e5e5",
    textColor: "#212B36",
    borderColor: "#212B36",
    shadowColor: getShadowColor("#e5e5e5"),
  },
  light2: {
    backgroundColor: "#FF7086",
    borderColor: "#FF7086",
    textColor: "#e5e5e5",
    shadowColor: getShadowColor("#FF7086"),
  },
};

function getShadowColor(backgroundColor) {
  const bgRgb = parseInt(backgroundColor.slice(1), 16);

  const brightness =
    (bgRgb >> 16) * 0.299 +
    ((bgRgb >> 8) & 255) * 0.587 +
    (bgRgb & 255) * 0.114;

  return brightness > 186 ? "#000" : "#fff";
}
