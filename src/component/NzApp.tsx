import { useCallback, useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider, DefaultTheme } from 'styled-components';
import { ModuleRegistry as GridModuleRegistry, AllCommunityModule as GridAllCommunityModule } from 'ag-grid-community';

import './allcss/NzApp.css';
import themes from './theme/theme-provider.json';
import { useSessionContext } from './shared/context/hooks/SessionHooks';
import { useMainAppContext } from './shared/context/hooks/MainAppHooks';
import { AppContextWrapper } from './shared/context/AppContextWrapper';
import { NodeHeight, SubMenuHeight } from '../component/appcontainer/alldefaultprops/DefaultPropsAppContainer';
import { GlobalStyles } from './theme/GlobalStyles';
import { FnHandleAPIResponse } from './shared/allcommon/basic/FnHandleAPIResponse';
import { INzApp } from './allinterface/INzApp';
import { IDeploymentEnv, IDeploymentEnvResponse } from './shared/allinterface/IApiResponse';
import { AppContainer } from '../component/appcontainer/AppContainer';
import { FnSetSessionStorageItem } from './appcontainer/allcommon/FnSetSessionStorageItem';
import { sampleFeatureRecords } from '../sampledata/auth/ServiceFeatureSampleData';
import { sampleLoginUserJson } from '../sampledata/auth/LoginUserSampleData';
import { sampleDeploymentEnvResponse } from '../sampledata/auth/DeploymentEnvSampleData';
import { sampleSessionId, sampleSessionVariables } from '../sampledata/auth/AuthorizationSampleData';

GridModuleRegistry.registerModules([GridAllCommunityModule]);

function isDeploymentEnvResponse(response: unknown): response is IDeploymentEnvResponse {
    return (
        typeof response === "object"
        && response !== null
        && "valid" in response
        && "env" in response
        && Array.isArray((response as { env: unknown }).env)
    );
}

function NzLoadContextAndVariables({ uniqueName, user, onError, onSuccess }: INzApp) {
    console.log('NzApp received user:', user);

    const [selectedTheme, setSelectedTheme] = useState<DefaultTheme>(themes.data.light);
    const [isSessionCreated, setIsSessionCreated] = useState(false);
    const [isDeploymentVarsLoaded, setIsDeploymentVarsLoaded] = useState(false);

    const sessionContext = useSessionContext();
    const mainAppContext = useMainAppContext();

    const reportFatalError = useCallback(
        (message: string, err?: unknown) => {
            console.error("NzApp fatal error:", message, err);
            onError?.(message);
        },
        [onError]
    );

    useEffect(() => {
        const loadDeploymentVars = async () => {
            try {
                const appConfig: IDeploymentEnv[] = Object.entries(window.APP_CONFIG ?? {}).map(
                    ([key, value]) => ({
                        key,
                        value: String(value)
                    })
                );

                // SAMPLE DATA: expapi /deployment/env not called
                const apiResponse = sampleDeploymentEnvResponse;

                if (!isDeploymentEnvResponse(apiResponse)) {
                    throw new Error("Invalid environment response.");
                }

                const { valid, env } = apiResponse;
                if (!valid) {
                    throw new Error("Invalid environment response.");
                }
                if (env.length === 0) {
                    throw new Error("Environment configuration not found.");
                }

                const mergedEnv = [
                    ...env,
                    ...appConfig.filter(
                        appItem => !env.some(apiItem => apiItem.key === appItem.key)
                    )
                ];

                mainAppContext.setDeploymentVars(mergedEnv);
                setIsDeploymentVarsLoaded(true);
            } catch (error) {
                reportFatalError(
                    error instanceof Error
                        ? error.message
                        : "Failed to load environment configuration."
                );
                setIsDeploymentVarsLoaded(false);
                setIsSessionCreated(false);
            }
        };

        void loadDeploymentVars();
    }, []);

    useEffect(() => {
        if (!isDeploymentVarsLoaded) return;

        const isMountedRef = { current: true };

        const initializeData = async () => {
            if (!sampleSessionVariables.length || !sampleSessionId) return;
            if (!isMountedRef.current) return;

            if (!sampleFeatureRecords.length) {
                reportFatalError("Features table is empty");
                return;
            }



            mainAppContext.setFeatureRecords(sampleFeatureRecords);
            mainAppContext.setAllFeatureRecords(sampleFeatureRecords);

            const userProfileRecord = FnHandleAPIResponse(sampleLoginUserJson, "Dataset");
            if (
                typeof userProfileRecord === "object"
                && userProfileRecord
                && "_User" in userProfileRecord
                && Array.isArray(userProfileRecord["_User"])
                && userProfileRecord["_User"].length
            ) {
                mainAppContext.setUserProfileRecord(userProfileRecord["_User"][0]);
            mainAppContext.setAuthSession(user);
            } else {
                reportFatalError("User profile data not found.");
                return;
            }

            console.warn("[sample-data] SESSION.InitSession not called — features, site hierarchy, and LoginUserJson loaded from sample JSON");

            sessionContext.setSessionList(sampleSessionVariables);
            setIsSessionCreated(true);

            try {
                onSuccess();
            } catch (error) {
                console.error("Error in onSuccess callback:", error);
            }
        };

        void initializeData();

        const root = document.documentElement;
        root.style.setProperty("--node_height", NodeHeight);
        root.style.setProperty("--submenu_height", SubMenuHeight);

        return () => {
            isMountedRef.current = false;
        };
    }, [isDeploymentVarsLoaded]);

    const handleThemeChange = useCallback((theme: unknown) => {
        if (typeof theme !== 'object' || theme === null || !('name' in theme)) {
            console.error('Invalid theme object');
            return;
        }

        const typedTheme = theme as DefaultTheme & { name: string };
        FnSetSessionStorageItem("selected_theme", typedTheme.name);
        setSelectedTheme(typedTheme);
    }, []);

    return (
        <ThemeProvider theme={selectedTheme}>
            <GlobalStyles />
            {isSessionCreated && isDeploymentVarsLoaded && (
                <AppContainer
                    isNewSession={true}
                    uniqueName={uniqueName}
                    handleThemeChange={handleThemeChange}
                />
            )}
        </ThemeProvider>
    );
}

function NzApp(props: INzApp) {
    return (
        <AppContextWrapper>
            <Router>
                <NzLoadContextAndVariables {...props} />
            </Router>
        </AppContextWrapper>
    );
}

export default NzApp
