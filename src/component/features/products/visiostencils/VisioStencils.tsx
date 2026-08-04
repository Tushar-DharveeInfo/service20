
import { PrivatePdfDocs } from '../../alldefaultprops/DefaultPropsPrivatePdf.ts'
import { ProductContainer } from '../productcontainer/ProductContainer.tsx'
import { IProductFeature } from '../../allinterface/products/IProductFeature.ts'

const VisioStencils = (visioStencilsProps: IProductFeature) => {
    return (
        <ProductContainer
            uniqueName={`${visioStencilsProps.uniqueName}-product`}
            brochureFileName={PrivatePdfDocs.VisioStencilsBrochure}
            brochureTitle={'Visio Stencils Brochure'}
            headerText={visioStencilsProps.headerText} />
    )
}

export { VisioStencils }
export default VisioStencils
