
/* Builds the browser url for a document in public/privatepdf.
   The shipped file names contain spaces, so the name must be encoded
   before pdf.js can fetch it. Absolute urls are passed through as is. */
const FnGetPrivatePdfUrl = (fileName: string): string => {
    const documentName = fileName.trim().replace(/^\/+/, "");

    if (/^(https?:)?\/\//i.test(documentName)) {
        return documentName;
    }

    const baseUrl = import.meta.env.BASE_URL.endsWith('/')
        ? import.meta.env.BASE_URL
        : `${import.meta.env.BASE_URL}/`;
    const folder = "privatepdf";

    return `${baseUrl}${folder}/${encodeURIComponent(documentName)}`;
};

export { FnGetPrivatePdfUrl }
