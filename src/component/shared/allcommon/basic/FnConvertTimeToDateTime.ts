

const FnConvertTimeToDateTime = (
    time?: string | null
): string | null => {
    try {
        if (!time || typeof time !== "string") return null;

        const parts = time.split(":");
        if (parts.length < 2) return null;

        const hours = parts[0].padStart(2, "0");
        const minutes = parts[1].padStart(2, "0");

        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}T${hours}:${minutes}:00`;
    } catch {
        return null;
    }
};

export { FnConvertTimeToDateTime }