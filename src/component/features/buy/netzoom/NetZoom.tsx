
import { BuyBrochureDocs } from '../../alldefaultprops/DefaultPropsPrivatePdf.ts'
import { BuyContainer } from '../buycontainer/BuyContainer.tsx'
import { IBuyFeature } from '../../allinterface/buy/IBuyFeature.ts'

const NetZoom = (netZoomProps: IBuyFeature) => {
    return (
        <BuyContainer
            uniqueName={`${netZoomProps.uniqueName}-product`}
            brochureFileName={BuyBrochureDocs.NetZoom}
            brochureTitle={'NetZoom Enterprise Brochure'}
            headerText={netZoomProps.headerText} />
    )
}

export { NetZoom }
export default NetZoom
