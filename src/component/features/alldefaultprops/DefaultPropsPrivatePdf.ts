
/* Pdf documents shipped with the app under public/privatepdf.
   Values are the exact file names on disk, spaces included. */
enum PrivatePdfDocs {
    Eula = "NetZoom End User License Agreement.pdf",
    EnterpriseBrochure = "NetZoom Enterprise Brochure.pdf",
    VisioStencilsBrochure = "Visio Stencils Brochure.pdf",
}

/* Public folder that holds the documents above. */
const PrivatePdfFolder = "/privatepdf";

/* Render scale used when a feature does not ask for its own. */
const DefaultPdfScale = 1.6;

export { PrivatePdfDocs, PrivatePdfFolder, DefaultPdfScale }
