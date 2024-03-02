export function generateRandomColor() {
  // Generate random values for red, green, and blue components
  const r = Math.floor(Math.random() * 256); // Random value between 0 and 255
  const g = Math.floor(Math.random() * 256); // Random value between 0 and 255
  const b = Math.floor(Math.random() * 256); // Random value between 0 and 255

  // Combine the components into a single hexadecimal number
  const color = (r << 16) | (g << 8) | b; // Combine the components

  return color;
}
