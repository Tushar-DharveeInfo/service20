
import { lazy, Suspense, useEffect, useState } from 'react'
import { DownloadEnums, ProductsEnums, ProfileEnums, ServicesEnums } from '../../constants/Feature.ts'
import ErrorBoundary from '../../shared/errorboundary/ErrorBoundary.tsx'
import { Loader } from '../../shared/loader/Loader.tsx'
import { IFeatureRenderContainer } from '../allinterface/IFeatureRenderContainer.ts'
import { GenerateReport } from '../../features/generatereport/GenerateReport.tsx'
import { FnGetPublicAssetUrl } from '../../features/allcommon/FnGetPublicAssetUrl.ts'
import {
    sampleOrderAddressFields,
    sampleOrderDataset1,
    sampleOrderDataset2,
    sampleOrderDocType,
} from '../../../sampledata/genaretreport/OrderFormSampleData.ts'

const ORDER_FORM_JSON = 'OrderForm.json'

/* Loads OrderForm.json from public and passes sample order data into GenerateReport. */
const GenerateReportHost = () => {
    const [reportTemplate, setReportTemplate] = useState<Record<string, unknown> | null>(null)
    const [loadError, setLoadError] = useState('')

    useEffect(() => {
        let isActive = true

        const loadOrderFormTemplate = async () => {
            setLoadError('')
            setReportTemplate(null)

            try {
                const response = await fetch(FnGetPublicAssetUrl(ORDER_FORM_JSON))

                if (!response.ok) {
                    throw new Error(`Failed to load ${ORDER_FORM_JSON} (${response.status})`)
                }

                const template = await response.json() as Record<string, unknown>

                if (isActive) {
                    setReportTemplate(template)
                }
            } catch (error) {
                if (isActive) {
                    setLoadError(
                        error instanceof Error ? error.message : `Failed to load ${ORDER_FORM_JSON}`
                    )
                }
            }
        }

        loadOrderFormTemplate()

        return () => {
            isActive = false
        }
    }, [])

    if (loadError) {
        return <div style={{ color: 'var(--error-color, #b00020)', padding: 12 }}>{loadError}</div>
    }

    if (!reportTemplate) {
        return <Loader />
    }

    return (
        <GenerateReport
            uniqueName="feature-generate-report"
            reportTemplate={reportTemplate}
            addressFields={sampleOrderAddressFields}
            docType={sampleOrderDocType}
            dataset1={sampleOrderDataset1}
            dataset2={sampleOrderDataset2}
        />
    )
}

const Eula = lazy(() => import('../../features/profile/eula/Eula.tsx'))
const MyProfile = lazy(() => import('../../features/profile/myprofile/MyProfile.tsx'))
const MyActivities = lazy(() => import('../../features/profile/myactivities/MyActivities.tsx'))
const MySubscriptions = lazy(() => import('../../features/profile/mysubscriptions/MySubscriptions.tsx'))
const NetZoom = lazy(() => import('../../features/products/netzoom/NetZoom.tsx'))
const VisioStencils = lazy(() => import('../../features/products/visiostencils/VisioStencils.tsx'))
const OtherProducts = lazy(() => import('../../features/products/other/OtherProducts.tsx'))
const RequestSupport = lazy(() => import('../../features/services/requestsupport/RequestSupport.tsx'))
const RequestVisioStencils = lazy(() => import('../../features/services/requestvisiostencils/RequestVisioStencils.tsx'))
const RequestDeviceModels = lazy(() => import('../../features/services/requestdevicemodels/RequestDeviceModels.tsx'))
const DownloadVisioStencils = lazy(() => import('../../features/download/downloadvisiostencils/DownloadVisioStencils.tsx'))
const DownloadNetZoom = lazy(() => import('../../features/download/downloadnetzoom/DownloadNetZoom.tsx'))

/* Features that own the whole content area instead of the explorer tree.
   FeatureContainer reads this list to decide which side to render. */
const FeaturesWithOwnLayout: string[] = [
    ProfileEnums.MyProfile,
    ProfileEnums.MyActivities,
    ProfileEnums.MySubscriptions,
    ProductsEnums.EULA,
    ProductsEnums.NetZoom,
    ProductsEnums.VisioStencils,
    ProductsEnums.Other,
    ServicesEnums.RequestSupport,
    ServicesEnums.RequestVisioStencils,
    ServicesEnums.RequestDeviceModels,
    DownloadEnums.DownloadVisioStencils,
    DownloadEnums.DownloadNetZoom
];

/* Renders feature modules dynamically based on featureId.
   Returns null if no matching feature module exists. */
function FeatureRenderContainer(featureRenderContainerProps: IFeatureRenderContainer) {
    const {
        allowFeatureToRender,
        featureContainerProps,
        handleShowUserMessage
    } = featureRenderContainerProps;

    if (!allowFeatureToRender) {
        return null;
    }

    switch (featureContainerProps.featureId) {

        case ProfileEnums.MyProfile:
            return (
                <ErrorBoundary>
                    <Suspense fallback={<Loader />}>
                        <MyProfile
                            uniqueName={'feature-profile-my-profile'}
                            featureId={featureContainerProps.featureId}
                            headerText={featureContainerProps.headerText}
                            handleShowUserMessage={handleShowUserMessage} />
                    </Suspense>
                </ErrorBoundary>
            );

        case ProfileEnums.MyActivities:
            return (
                <ErrorBoundary>
                    <Suspense fallback={<Loader />}>
                        <MyActivities
                            uniqueName={'feature-profile-my-activities'}
                            featureId={featureContainerProps.featureId}
                            headerText={featureContainerProps.headerText}
                            handleShowUserMessage={handleShowUserMessage} />
                    </Suspense>
                </ErrorBoundary>
            );

        case ProfileEnums.MySubscriptions:
            return (
                <ErrorBoundary>
                    <Suspense fallback={<Loader />}>
                        <MySubscriptions
                            uniqueName={'feature-profile-my-subscriptions'}
                            featureId={featureContainerProps.featureId}
                            headerText={featureContainerProps.headerText}
                            handleShowUserMessage={handleShowUserMessage} />
                    </Suspense>
                </ErrorBoundary>
            );

        case ProductsEnums.EULA:
            return (
                <ErrorBoundary>
                    <Suspense fallback={<Loader />}>
                        <Eula
                            uniqueName={'feature-products-eula'}
                            featureId={featureContainerProps.featureId}
                            headerText={featureContainerProps.headerText}
                            handleShowUserMessage={handleShowUserMessage} />
                    </Suspense>
                </ErrorBoundary>
            );

        case ProductsEnums.NetZoom:
            return (
                <ErrorBoundary>
                    <Suspense fallback={<Loader />}>
                        <NetZoom
                            uniqueName={'feature-products-netzoom'}
                            featureId={featureContainerProps.featureId}
                            headerText={featureContainerProps.headerText}
                            handleShowUserMessage={handleShowUserMessage} />
                    </Suspense>
                </ErrorBoundary>
            );

        case ProductsEnums.VisioStencils:
            return (
                <ErrorBoundary>
                    <Suspense fallback={<Loader />}>
                        <VisioStencils
                            uniqueName={'feature-products-visio-stencils'}
                            featureId={featureContainerProps.featureId}
                            headerText={featureContainerProps.headerText}
                            handleShowUserMessage={handleShowUserMessage} />
                    </Suspense>
                </ErrorBoundary>
            );

        case ProductsEnums.Other:
            return (
                <ErrorBoundary>
                    <Suspense fallback={<Loader />}>
                        <GenerateReportHost />
                        {/* <OtherProducts
                            uniqueName={'feature-products-other'}
                            featureId={featureContainerProps.featureId}
                            headerText={featureContainerProps.headerText}
                            handleShowUserMessage={handleShowUserMessage} /> */}
                    </Suspense>
                </ErrorBoundary>
            );

        case ServicesEnums.RequestSupport:
            return (
                <ErrorBoundary>
                    <Suspense fallback={<Loader />}>
                        <RequestSupport />
                    </Suspense>
                </ErrorBoundary>
            );

        case ServicesEnums.RequestVisioStencils:
            return (
                <ErrorBoundary>
                    <Suspense fallback={<Loader />}>
                        <RequestVisioStencils />
                    </Suspense>
                </ErrorBoundary>
            );

        case ServicesEnums.RequestDeviceModels:
            return (
                <ErrorBoundary>
                    <Suspense fallback={<Loader />}>
                        <RequestDeviceModels />
                    </Suspense>
                </ErrorBoundary>
            );

        case DownloadEnums.DownloadVisioStencils:
            return (
                <ErrorBoundary>
                    <Suspense fallback={<Loader />}>
                        <DownloadVisioStencils
                            uniqueName={'feature-download-visio-stencils'}
                            featureId={featureContainerProps.featureId}
                            headerText={featureContainerProps.headerText}
                            handleShowUserMessage={handleShowUserMessage} />
                    </Suspense>
                </ErrorBoundary>
            );

        case DownloadEnums.DownloadNetZoom:
            return (
                <ErrorBoundary>
                    <Suspense fallback={<Loader />}>
                        <DownloadNetZoom
                            uniqueName={'feature-download-netzoom'}
                            featureId={featureContainerProps.featureId}
                            headerText={featureContainerProps.headerText}
                            handleShowUserMessage={handleShowUserMessage} />
                    </Suspense>
                </ErrorBoundary>
            );

        default:
            return null;
    }
}

export { FeatureRenderContainer, FeaturesWithOwnLayout }
