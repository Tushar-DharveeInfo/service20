
import { SimplePdfViewer } from '@n20a/libflippdf'
import '@n20a/libflippdf/style.css'
import '../allcss/PdfDocumentViewer.css'
import { Label } from '../../shared/basic/label/Label.tsx'
import { DefaultPdfScale } from '../alldefaultprops/DefaultPropsPrivatePdf.ts'
import { FnGetPrivatePdfUrl } from '../allcommon/FnGetPrivatePdfUrl.ts'
import { IPdfDocumentViewer } from '../allinterface/IPdfDocumentViewer.ts'

/* Read only pdf host used by EULA and the brochure features.
   SimplePdfViewer is the standard renderer; use FlipPdf (see shared/Help.tsx)
   only when a table of contents is needed. */
const PdfDocumentViewer = (pdfDocumentViewerProps: IPdfDocumentViewer) => {
    const pdfUrl = FnGetPrivatePdfUrl(pdfDocumentViewerProps.fileName);
    const documentTitle = pdfDocumentViewerProps.documentTitle
        ?? pdfDocumentViewerProps.headerText
        ?? pdfDocumentViewerProps.fileName.replace(/\.pdf$/i, "");

    return (
        <div key={pdfDocumentViewerProps.uniqueName} className='nz-pdf-document-viewer'>
            {pdfDocumentViewerProps.headerText
                ? <div className='nz-sub-header'>
                    <Label
                        uniqueName={`${pdfDocumentViewerProps.uniqueName}-header`}
                        label={pdfDocumentViewerProps.headerText}
                        fontWeight='600' />
                </div>
                : <></>}
            <div className='nz-pdf-document-viewer-content'>
                <SimplePdfViewer
                    documentTitle={documentTitle}
                    pdfUrl={pdfUrl}
                    scale={pdfDocumentViewerProps.scale ?? DefaultPdfScale} />
            </div>
        </div>
    )
}

export { PdfDocumentViewer }
export default PdfDocumentViewer
