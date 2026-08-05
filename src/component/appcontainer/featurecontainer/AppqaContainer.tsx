import { lazy, Suspense } from 'react';
import { AppQA } from '../../constants/Feature.ts';
import ErrorBoundary from '../../shared/errorboundary/ErrorBoundary.tsx';
import { IAppqaContainer } from '../allinterface/IAppqaContainer.ts';
import { Loader } from '../../shared/loader/Loader.tsx';
import Help from '../../shared/Help.tsx';
import AppQaContactUs from '../../appqa/AppQaContactUs.tsx';

const AppqaSignout = lazy(() => import('../../appqa/AppqaSignout.tsx'))

function AppQaContainer(appQaContainerProps: IAppqaContainer) {
    const {
        allowAppQaToRender,
        featureContainerProps,
        featureRecords,
        selectedFeatureNameForHelp,
        handleSelectedMenuItem,
        handleShowUserMessage
    } = appQaContainerProps;

    if (!allowAppQaToRender || !featureContainerProps.appqaId) {
        return null;
    }

    switch (featureContainerProps.appqaId) {


        case AppQA.Signout:
            return (
                <ErrorBoundary>
                    <Suspense fallback={<Loader />}>
                        <AppqaSignout uniqueName={'app-qa-signout'} />
                        {/* <AppqaReport uniqueName={'app-qa-signout'} featureId={'app-qa-signout'} /> */}
                    </Suspense>
                </ErrorBoundary>
            );


        case AppQA.Help:
            return (
                <ErrorBoundary>
                    <Help
                        uniqueName={'app-qa-user'}
                        headerText={featureContainerProps.headerText}
                        featureId={featureContainerProps.appqaId}
                        featureName={selectedFeatureNameForHelp ?? "Help"}
                        hideDownloadIcon={true}
                        handleShowUserMessage={handleShowUserMessage}
                    />
                </ErrorBoundary>
            );

        case AppQA.ContactUs:
            return (
                <ErrorBoundary>
                    <Suspense fallback={<Loader />}>
                        <AppQaContactUs
                            uniqueName={'app-qa-contact-us'}
                            headerText={featureContainerProps.headerText || 'ContactUs'}
                            handleShowUserMessage={handleShowUserMessage}
                        />
                    </Suspense>
                </ErrorBoundary>
            );

        default:
            return null;
    }
}

export { AppQaContainer }
