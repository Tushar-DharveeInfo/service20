
import { PrivatePdfDocs } from '../../alldefaultprops/DefaultPropsPrivatePdf.ts'
import { ProductContainer } from '../productcontainer/ProductContainer.tsx'
import { IProductFeature } from '../../allinterface/products/IProductFeature.ts'

const NetZoom = (netZoomProps: IProductFeature) => {
    return (
        <ProductContainer
            uniqueName={`${netZoomProps.uniqueName}-product`}
            brochureFileName={PrivatePdfDocs.EnterpriseBrochure}
            brochureTitle={'NetZoom Enterprise Brochure'}
            headerText={netZoomProps.headerText} />
    )
}

export { NetZoom }
export default NetZoom
