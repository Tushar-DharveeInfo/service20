
import '../../allcss/profile/Eula.css'
import { PrivatePdfDocs } from '../../alldefaultprops/DefaultPropsPrivatePdf.ts'
import { PdfDocumentViewer } from '../../pdfviewer/PdfDocumentViewer.tsx'
import { IEula } from '../../allinterface/profile/IEula.ts'

const Eula = (eulaProps: IEula) => {
    return (
        <div key={eulaProps.uniqueName} className='nz-eula-container nz-wh-100'>
            <PdfDocumentViewer
                uniqueName={`${eulaProps.uniqueName}-pdf`}
                fileName={PrivatePdfDocs.Eula}
                documentTitle={'NetZoom End User License Agreement'}
                headerText={eulaProps.headerText}
                scale={eulaProps.scale} />
        </div>
    )
}

export { Eula }
export default Eula
