
import '../../allcss/products/ProductContainer.css'
import { PdfDocumentViewer } from '../../pdfviewer/PdfDocumentViewer.tsx'
import { PdfDownloadOverlay } from '../../pdfviewer/PdfDownloadOverlay.tsx'
import { FnGetPrivatePdfUrl } from '../../allcommon/FnGetPrivatePdfUrl.ts'
import { IProductContainer } from '../../allinterface/products/IProductContainer.ts'

/* Shared brochure view for NetZoom and Visio Stencils products. */
const ProductContainer = (productContainerProps: IProductContainer) => {
    const pdfUrl = FnGetPrivatePdfUrl(productContainerProps.brochureFileName);

    return (
        <div key={productContainerProps.uniqueName} className='nz-product-container'>
            <PdfDownloadOverlay
                uniqueName={`${productContainerProps.uniqueName}-download`}
                headerText={productContainerProps.headerText ?? productContainerProps.brochureTitle}
                pdfUrl={pdfUrl}
                downloadFileName={productContainerProps.brochureFileName} />
            <div className='nz-product-container-content'>
                <PdfDocumentViewer
                    uniqueName={`${productContainerProps.uniqueName}-brochure`}
                    fileName={productContainerProps.brochureFileName}
                    documentTitle={productContainerProps.brochureTitle} />
            </div>
        </div>
    )
}

export { ProductContainer }
export default ProductContainer
