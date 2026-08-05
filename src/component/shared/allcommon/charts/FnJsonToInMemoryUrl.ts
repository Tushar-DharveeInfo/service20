/* Convert an in-memory URL (blob:) back to JSON. */
async function FnInMemoryUrlToJson(inMemoryUrl: string): Promise<unknown> {
    try {
        const response = await fetch(inMemoryUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch Blob. Status: ${response.status}`);
        }
        const text = await response.blob().then((b) => b.text());
        return JSON.parse(text);
    } catch (error) {
        console.error("Error converting in-memory URL to JSON:", error);
        throw error;
    }
}

/* Convert JSON → Blob → In-Memory URL */
function FnJsonToInMemoryUrl(jsonData: unknown): string {
    try {
        const blob = new Blob([JSON.stringify(jsonData, null, 2)], {
            type: "application/json",
        });
        return URL.createObjectURL(blob);
    } catch (error) {
        console.error("Error converting JSON to in-memory URL:", error);
        return "";
    }
}

export { FnJsonToInMemoryUrl, FnInMemoryUrlToJson };
