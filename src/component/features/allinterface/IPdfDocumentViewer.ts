
interface IPdfDocumentViewer {
    uniqueName: string;//uniqueName for the control and required
    fileName: string;// file name inside public/privatepdf, or an absolute url
    documentTitle?: string;// title rendered by the pdf viewer header
    headerText?: string;// feature header shown above the viewer
    scale?: number;// render scale, defaults to DefaultPdfScale
}

export type { IPdfDocumentViewer }
