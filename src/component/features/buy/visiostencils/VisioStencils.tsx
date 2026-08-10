
import { BuyBrochureDocs } from '../../alldefaultprops/DefaultPropsPrivatePdf.ts'
import { BuyContainer } from '../buycontainer/BuyContainer.tsx'
import { IBuyFeature } from '../../allinterface/buy/IBuyFeature.ts'

const VisioStencils = (visioStencilsProps: IBuyFeature) => {
    return (
        <BuyContainer
            uniqueName={`${visioStencilsProps.uniqueName}-product`}
            brochureFileName={BuyBrochureDocs.VisioStencils}
            brochureTitle={'Visio Stencils Brochure'}
            headerText={visioStencilsProps.headerText} />
    )
}

export { VisioStencils }
export default VisioStencils
