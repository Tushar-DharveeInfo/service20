import { lazy, Suspense } from 'react';
import { AppQA } from '../../constants/Feature.ts';
import ErrorBoundary from '../../shared/errorboundary/ErrorBoundary.tsx';
import { IAppqaContainer } from '../allinterface/IAppqaContainer.ts';
import { Loader } from '../../shared/loader/Loader.tsx';
import Help from '../../shared/Help.tsx';

const AppqaSignout = lazy(() => import('../../appqa/AppqaSignout.tsx'));
const AppqaLog = lazy(() => import('../../appqa/AppqaLog.tsx'));
const AppqaAlerts = lazy(() => import('../../appqa/AppqaAlerts.tsx'));
const AppqaNotify = lazy(() => import('../../appqa/AppqaNotify.tsx'));
const AppqaReport = lazy(() => import('../../appqa/AppqaReport.tsx'));

function AppQaContainer(appQaContainerProps: IAppqaContainer) {
    const {
        allowAppQaToRender,
        featureContainerProps,
        selectedFeatureNameForHelp,
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
                        handleShowUserMessage={handleShowUserMessage}
                    />
                </ErrorBoundary>
            );

        case AppQA.Log:
            return (
                <ErrorBoundary>
                    <Suspense fallback={<Loader />}>
                        <AppqaLog
                            uniqueName={'app-qa-log'}
                            featureId={featureContainerProps.appqaId}
                            headerText={featureContainerProps.headerText || 'Log'}
                            handleShowUserMessage={handleShowUserMessage}
                        />
                    </Suspense>
                </ErrorBoundary>
            );

        case AppQA.Alerts:
            return (
                <ErrorBoundary>
                    <Suspense fallback={<Loader />}>
                        <AppqaAlerts
                            uniqueName={'app-qa-alerts'}
                            headerText={featureContainerProps.headerText || 'Alerts'}
                            handleShowUserMessage={handleShowUserMessage}
                        />
                    </Suspense>
                </ErrorBoundary>
            );

        case AppQA.Notify:
            return (
                <ErrorBoundary>
                    <Suspense fallback={<Loader />}>
                        <AppqaNotify
                            uniqueName={'app-qa-notify'}
                            headerText={featureContainerProps.headerText || 'Notify'}
                            handleShowUserMessage={handleShowUserMessage}
                        />
                    </Suspense>
                </ErrorBoundary>
            );

        case AppQA.Report:
            return (
                <ErrorBoundary>
                    <Suspense fallback={<Loader />}>
                        <AppqaReport
                            uniqueName={'app-qa-report'}
                            featureId={featureContainerProps.appqaId}
                            handleShowUserMessage={handleShowUserMessage}
                        />
                    </Suspense>
                </ErrorBoundary>
            );

        default:
            return null;
    }
}

export { AppQaContainer };
