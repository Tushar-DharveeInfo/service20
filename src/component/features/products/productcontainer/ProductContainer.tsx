
import '../../allcss/products/ProductContainer.css'
import { Label } from '../../../shared/basic/label/Label.tsx'
import { PdfDocumentViewer } from '../../pdfviewer/PdfDocumentViewer.tsx'
import { IProductContainer } from '../../allinterface/products/IProductContainer.ts'

/* Shared brochure view for NetZoom and Visio Stencils products. */
const ProductContainer = (productContainerProps: IProductContainer) => {
    return (
        <div key={productContainerProps.uniqueName} className='nz-product-container'>
            <div className='nz-sub-header'>
                <Label
                    uniqueName={`${productContainerProps.uniqueName}-header`}
                    label={productContainerProps.headerText ?? productContainerProps.brochureTitle}
                    fontWeight='600' />
            </div>
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
