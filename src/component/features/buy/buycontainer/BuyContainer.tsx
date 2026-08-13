
import { useEffect, useState } from 'react'
import '../../allcss/buy/BuyContainer.css'
import { PdfDocumentViewer } from '../../pdfviewer/PdfDocumentViewer.tsx'
import { PdfDownloadOverlay } from '../../pdfviewer/PdfDownloadOverlay.tsx'
import { FnGetPrivatePdfUrl } from '../../allcommon/FnGetPrivatePdfUrl.ts'
import { IBuyContainer } from '../../allinterface/buy/IBuyContainer.ts'
import { Loader } from '../../../shared/loader/Loader.tsx'

/* Shared brochure view for Buy EULA / NetZoom / Visio Stencils (local public folder). */
const BuyContainer = (buyContainerProps: IBuyContainer) => {
    const [pdfUrl, setPdfUrl] = useState<string>('')
    const [loadError, setLoadError] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(true)

    useEffect(() => {
        let isActive = true

        const loadPublicUrl = () => {
            setIsLoading(true)
            setLoadError('')
            setPdfUrl('')

            try {
                const url = FnGetPrivatePdfUrl(buyContainerProps.brochureFileName)
                if (isActive) {
                    setPdfUrl(url)
                }
            } catch (error) {
                if (isActive) {
                    setLoadError(
                        error instanceof Error
                            ? error.message
                            : `Failed to load ${buyContainerProps.brochureFileName}`
                    )
                }
            } finally {
                if (isActive) {
                    setIsLoading(false)
                }
            }
        }

        loadPublicUrl()

        return () => {
            isActive = false
        }
    }, [buyContainerProps.brochureFileName])

    if (isLoading) {
        return <Loader />
    }

    if (loadError || !pdfUrl) {
        return (
            <div key={buyContainerProps.uniqueName} className='nz-buy-container'>
                <div className='nz-buy-container-content' style={{ color: 'var(--error-color, #b00020)', padding: 12 }}>
                    {loadError || 'PDF url unavailable.'}
                </div>
            </div>
        )
    }

    return (
        <div key={buyContainerProps.uniqueName} className='nz-buy-container'>
            <PdfDownloadOverlay
                uniqueName={`${buyContainerProps.uniqueName}-download`}
                headerText={buyContainerProps.headerText ?? buyContainerProps.brochureTitle}
                pdfUrl={pdfUrl}
                downloadFileName={buyContainerProps.brochureFileName} />
            <div className='nz-buy-container-content'>
                <PdfDocumentViewer
                    uniqueName={`${buyContainerProps.uniqueName}-brochure`}
                    fileName={buyContainerProps.brochureFileName}
                    pdfUrl={pdfUrl}
                    documentTitle={buyContainerProps.brochureTitle} />
            </div>
        </div>
    )
}

export { BuyContainer }
export default BuyContainer
