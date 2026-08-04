
import { lazy, Suspense, useEffect, useState } from 'react'
import { DownloadEnums, ProductsEnums, ProfileEnums, ServicesEnums } from '../../constants/Feature.ts'
import ErrorBoundary from '../../shared/errorboundary/ErrorBoundary.tsx'
import { Loader } from '../../shared/loader/Loader.tsx'
import { IFeatureRenderContainer } from '../allinterface/IFeatureRenderContainer.ts'
import { GenerateReport } from '../../features/generatereport/GenerateReport.tsx'

/* Loads public/reportTemplate.json and passes it as required GenerateReport prop. */
const GenerateReportHost = () => {
    const [reportTemplate, setReportTemplate] = useState<Record<string, unknown> | null>(null);

    useEffect(() => {
        let cancelled = false;
        void fetch(`${import.meta.env.BASE_URL}reportTemplate.json`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to load reportTemplate.json (${response.status})`);
                }
                return response.json() as Promise<Record<string, unknown>>;
            })
            .then((json) => {
                if (!cancelled) setReportTemplate(json);
            })
            .catch((error) => {
                console.error('GenerateReportHost: failed to load public/reportTemplate.json', error);
            });
        return () => {
            cancelled = true;
        };
    }, []);

    if (!reportTemplate) {
        return <Loader />;
    }

    return (
        <GenerateReport
            uniqueName="feature-generate-report"
            reportTemplate={reportTemplate}
        />
    );
};

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
