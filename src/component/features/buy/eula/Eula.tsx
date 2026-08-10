
import { BuyBrochureDocs } from '../../alldefaultprops/DefaultPropsPrivatePdf.ts'
import { BuyContainer } from '../buycontainer/BuyContainer.tsx'
import { IEula } from '../../allinterface/profile/IEula.ts'

const Eula = (eulaProps: IEula) => {
    return (
        <BuyContainer
            uniqueName={`${eulaProps.uniqueName}-product`}
            brochureFileName={BuyBrochureDocs.Eula}
            brochureTitle={'NetZoom End User License Agreement'}
            headerText={eulaProps.headerText} />
    )
}

export { Eula }
export default Eula
