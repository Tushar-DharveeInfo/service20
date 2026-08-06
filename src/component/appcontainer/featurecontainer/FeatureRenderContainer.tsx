import { lazy, Suspense } from 'react'
import { DownloadEnums, ProductsEnums, FeatureEnums, ServicesEnums } from '../../constants/Feature.ts'
import ErrorBoundary from '../../shared/errorboundary/ErrorBoundary.tsx'
import { Loader } from '../../shared/loader/Loader.tsx'
import { IFeatureRenderContainer } from '../allinterface/IFeatureRenderContainer.ts'

const Eula = lazy(() => import('../../features/profile/eula/Eula.tsx'))
const MyProfile = lazy(() => import('../../features/profile/myprofile/MyProfile.tsx'))
const MyActivities = lazy(() => import('../../features/profile/myactivities/MyActivities.tsx'))
const MySubscriptions = lazy(() => import('../../features/profile/mysubscriptions/MySubscriptions.tsx'))
const VisioStencils = lazy(() => import('../../features/products/visiostencils/VisioStencils.tsx'))
const OtherProducts = lazy(() => import('../../features/products/other/OtherProducts.tsx'))
const RequestSupport = lazy(() => import('../../features/services/requestsupport/RequestSupport.tsx'))
const RequestVisioStencils = lazy(() => import('../../features/services/requestvisiostencils/RequestVisioStencils.tsx'))
const RequestDeviceModels = lazy(() => import('../../features/services/requestdevicemodels/RequestDeviceModels.tsx'))
const DownloadVisioStencils = lazy(() => import('../../features/download/downloadvisiostencils/DownloadVisioStencils.tsx'))

/* Features that own the whole content area instead of the explorer tree.
   FeatureContainer reads this list to decide which side to render. */
const FeaturesWithOwnLayout: string[] = [
    FeatureEnums.Other,
    FeatureEnums.Profile,
    FeatureEnums.VisioStencils,
    FeatureEnums.ProductVisioStencils,
    FeatureEnums.ProductOther,
    FeatureEnums.ClientIdentityManagement,
    FeatureEnums.NetZoom,
    FeatureEnums.ProductNetZoom,

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
        case FeatureEnums.Profile:
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

        case FeatureEnums.Other:
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

        case FeatureEnums.VisioStencils:
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
                        <OtherProducts
                            uniqueName={'feature-products-other'}
                            featureId={featureContainerProps.featureId}
                            headerText={featureContainerProps.headerText}
                            handleShowUserMessage={handleShowUserMessage} />
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

        default:
            return <ErrorBoundary>
                <Suspense fallback={<Loader />}>
                    <Eula
                        uniqueName={'feature-profile-eula'}
                        featureId={featureContainerProps.featureId}
                        headerText={featureContainerProps.headerText}
                        handleShowUserMessage={handleShowUserMessage} />
                </Suspense>
            </ErrorBoundary>;
    }
}

export { FeatureRenderContainer, FeaturesWithOwnLayout }
