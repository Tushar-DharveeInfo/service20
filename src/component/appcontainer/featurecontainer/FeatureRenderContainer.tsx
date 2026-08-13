
import { lazy, Suspense } from 'react'
import { DownloadEnums, BuyEnums, ProfileEnums, ServicesEnums, FaqEnums, PurchaseEnums } from '../../constants/Feature.ts'
import ErrorBoundary from '../../shared/errorboundary/ErrorBoundary.tsx'
import { Loader } from '../../shared/loader/Loader.tsx'
import { IFeatureRenderContainer } from '../allinterface/IFeatureRenderContainer.ts'
import { GenerateReport } from '../../features/buy/generatereport/GenerateReport.tsx'
import { useResourceContext } from '../../shared/context/hooks/ResourceHooks.ts'
import {
    sampleOrderAddressFields,
    sampleOrderDataset1,
    sampleOrderDataset2,
    sampleOrderDocType,
} from '../../../sampledata/genaretreport/OrderFormSampleData.ts'

/** Shown when a feature route has no component yet. */
const FeaturePendingInfo = () => <p>Y will provide information.</p>

/* Passes context-loaded OrderForm.json sample order data into GenerateReport. */
const GenerateReportHost = () => {
    const { orderFormJson } = useResourceContext()
    const reportTemplate = orderFormJson && typeof orderFormJson === 'object'
        ? orderFormJson as Record<string, unknown>
        : null

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

const Eula = lazy(() => import('../../features/buy/eula/Eula.tsx'))
const MyProfile = lazy(() => import('../../features/profile/myprofile/MyProfile.tsx'))
const MyActivities = lazy(() => import('../../features/profile/myactivities/MyActivities.tsx'))
const MySubscriptions = lazy(() => import('../../features/profile/mysubscriptions/MySubscriptions.tsx'))

const NetZoom = lazy(() => import('../../features/buy/netzoom/NetZoom.tsx'))
const VisioStencils = lazy(() => import('../../features/buy/visiostencils/VisioStencils.tsx'))

const RequestVisioStencils = lazy(() => import('../../features/services/requestvisiostencils/RequestVisioStencils.tsx'))
const RequestDeviceModelsContainer = lazy(() => import('../../features/services/requestdevicemodels/RequestDeviceModels.tsx'))
const RequestSupport = lazy(() => import('../../appqa/AppQaContactUs.tsx'))

const DownloadVisioStencils = lazy(() => import('../../features/download/downloadvisiostencils/DownloadVisioStencils.tsx'))
const DownloadNetZoom = lazy(() => import('../../features/download/downloadnetzoom/DownloadNetZoom.tsx'))
const TicketExplorerContainer = lazy(() => import('../../shared/ticketexplorercontainer/TicketExplorerContainer.tsx'))

/* Features that own the whole content area instead of the explorer tree.
   FeatureContainer reads this list to decide which side to render. */
const FeaturesWithOwnLayout: string[] = [
    ProfileEnums.MyProfile,
    ProfileEnums.MyActivities,
    ProfileEnums.MySubscriptions,
    BuyEnums.EULA,
    BuyEnums.Purchase,
    BuyEnums.NetZoom,
    BuyEnums.VisioStencils,
    BuyEnums.Other,
    PurchaseEnums.Cart,
    PurchaseEnums.Orders,
    ServicesEnums.RequestSupport,
    ServicesEnums.RequestVisioStencils,
    ServicesEnums.RequestDeviceModels,
    ServicesEnums.MyRequests,
    DownloadEnums.DownloadVisioStencils,
    DownloadEnums.DownloadNetZoom,
    FaqEnums.VisioStencils,
    FaqEnums.NetZoom,
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

        case BuyEnums.EULA:
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

        case BuyEnums.Purchase:
            return (
                <ErrorBoundary>
                    <Suspense fallback={<Loader />}>
                        <FeaturePendingInfo />
                    </Suspense>
                </ErrorBoundary>
            );

        case PurchaseEnums.Cart:
        case PurchaseEnums.Orders:
            return (
                <ErrorBoundary>
                    <Suspense fallback={<Loader />}>
                        <FeaturePendingInfo />
                    </Suspense>
                </ErrorBoundary>
            );

        case BuyEnums.NetZoom:
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

        case BuyEnums.VisioStencils:
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

        case BuyEnums.Other:
            return (
                <ErrorBoundary>
                    <Suspense fallback={<Loader />}>
                        <GenerateReportHost />

                    </Suspense>
                </ErrorBoundary>
            );

        case ServicesEnums.MyRequests:
            return (
                <ErrorBoundary>
                    <Suspense fallback={<Loader />}>
                        {/*<MyRequests />*/}
                        <TicketExplorerContainer uniqueName={'request-support'} headerText={featureContainerProps.headerText ?? "Service Request"} />
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
                        <RequestDeviceModelsContainer formData={{ searchText: "", AndOr: "AND", Mfg: "", EqType: "", ProdNo: "", MoreInfo: "" }}
                            onSearchClick={function (searchText?: string, AndOr?: 'AND' | 'OR', mfg?: string, eqtype?: string, pno?: string): void {
                                throw new Error('Function not implemented.')
                            }} />
                    </Suspense>
                </ErrorBoundary>
            );

        case ServicesEnums.RequestSupport:
            return (
                <ErrorBoundary>
                    <Suspense fallback={<Loader />}>
                        <RequestSupport
                            uniqueName={'feature-request-support'}
                            headerText={"Request Support"} />
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

        case FaqEnums.VisioStencils:
        case FaqEnums.NetZoom:
            return (
                <ErrorBoundary>
                    <Suspense fallback={<Loader />}>
                        <FeaturePendingInfo />
                    </Suspense>
                </ErrorBoundary>
            );

        default:
            return <FeaturePendingInfo />;
    }
}

export { FeatureRenderContainer, FeaturesWithOwnLayout }
