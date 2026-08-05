/* Builds a simple SVG error image as a blob URL. */
const FnCreateFailedMemoryUrl = (name: string): string => {
    try {
        const displayName = String(name ?? "").trim() || "unknown";
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="400">
  <rect width="100%" height="100%" fill="#f5f5f5"/>
  <text x="50%" y="50%" text-anchor="middle" fill="#666" font-size="20" font-family="sans-serif">
    Not able to create memory url of ${displayName.replace(/[<>&"']/g, "")}
  </text>
</svg>`;
        return URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
    } catch {
        return "";
    }
};

export { FnCreateFailedMemoryUrl };
