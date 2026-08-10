
/* Buy brochure PDFs stored under sm/brochures in cloud storage. */
enum BuyBrochureDocs {
    Eula = "eula-service.pdf",
    NetZoom = "brochure-netzoom.pdf",
    VisioStencils = "brochure-visiostencils.pdf",
}

/* Pdf documents shipped with the app under public/privatepdf (legacy / other). */
enum PrivatePdfDocs {
    Eula = "NetZoom End User License Agreement.pdf",
    EnterpriseBrochure = "NetZoom Enterprise Brochure.pdf",
    VisioStencilsBrochure = "Visio Stencils Brochure.pdf",
}

/* Public folder that holds the documents above. */
const PrivatePdfFolder = "/privatepdf";

/* Render scale used when a feature does not ask for its own. */
const DefaultPdfScale = 1.6;

export { BuyBrochureDocs, PrivatePdfDocs, PrivatePdfFolder, DefaultPdfScale }
