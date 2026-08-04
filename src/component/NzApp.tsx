
import { useCallback, useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, useSearchParams } from 'react-router-dom';

import { ThemeProvider } from 'styled-components';
import { DefaultTheme } from 'styled-components';

// Constants for session data keys
// const SESSION_DATA_KEYS = {
//     AP_JSON: 'APJson',
//     FEATURES_JSON: 'FeaturesJson',
//     EM_PG_JSON: 'EmPgJson',
//     SITE_HIERARCHY_JSON: 'SiteHierarchyJson',
//     AP_PROFILE_JSON: 'approfilejson',
//     ALERT_PROFILE_JSON: 'alertprofilejson',
//     CHART_PROFILE_JSON: 'chartprofilejson',
//     NZ_PG_REF_JSON: 'nzpgrefjson',
//     API_PROFILE_JSON: 'apiprofilejson',
//     FLOOR_DEVICES_JSON: 'floordevicesjson',
//     FLOOR_JSON: 'floorjson',
//     DCI_JSON: 'dcijson',
//     LOGIN_USER_JSON: 'LoginUserJson',
//     IMP_USER_JSON: 'ImpersonatedUserJson'
// } as const;

// const SESSION_VARIABLE_NAMES = {
//     SITE_ID: 'siteid',
//     LOGIN_USER_NAME: 'LoginUserName',
//     IMPERSONATED_USER_NAME: 'ImpersonatedUserName',
//     LOGIN_USER_EMAIL: `LoginUserEmail`,
//     LOGIN_USER_ID: `LoginUserID`,
//     IMPERSONATED_USER_ID: 'ImpersonatedUserID'
// } as const;
//  AG Grid
import { ModuleRegistry as GridModuleRegistry, AllCommunityModule as GridAllCommunityModule } from 'ag-grid-community';
import './allcss/NzApp.css'
import themes from './theme/theme-provider.json'
import { useSessionContext } from './shared/context/hooks/SessionHooks';
import { useStatusBarContext } from './shared/context/hooks/StatusBarHooks';
import { useMainAppContext } from './shared/context/hooks/MainAppHooks';
import { useChartProfileContext } from './shared/context/hooks/ChartProfileHooks';
import { useExplorerTreeContext } from './shared/context/hooks/ExplorerTreeHooks';
import { AppContextWrapper } from './shared/context/AppContextWrapper';
// SAMPLE DATA: expapi deployment env call removed, interceptor no longer needed here.
// import { axiosInterceptorForPostResponse } from './shared/interceptors/Interceptor';
import { NodeHeight, SubMenuHeight } from '../component/appcontainer/alldefaultprops/DefaultPropsAppContainer';
import { GlobalStyles } from './theme/GlobalStyles';
// import { SettingSubgroups, SettingGroups } from './constants/Feature';
import { FnHandleAPIResponse } from './shared/allcommon/basic/FnHandleAPIResponse';
import { INzApp } from './allinterface/INzApp';
import { IApItem, IFeatureItem } from './shared/context/allinterface/IMainApp';
import { IDeploymentEnv, IDeploymentEnvResponse } from './shared/allinterface/IApiResponse';
import { ISession } from './shared/context/allinterface/ISession';
import { AppContainer } from '../component/appcontainer/AppContainer'
import { FnSetSessionStorageItem } from './appcontainer/allcommon/FnSetSessionStorageItem';
// import { SettingApNames } from './constants/AppqaEnums';
// SAMPLE DATA: feature records from ServiceFeature.json (InitSession replacement).
import { sampleFeatureRecords } from '../sampledata/auth/ServiceFeatureSampleData';
// SAMPLE DATA: site hierarchy from SiteHierarchy.json (InitSession replacement).
import { sampleSiteHierarchyRecords } from '../sampledata/auth/SiteHierarchySampleData';
// SAMPLE DATA: LoginUserJson from InitSession replacement.
import { sampleLoginUserJson } from '../sampledata/auth/LoginUserSampleData';
// SAMPLE DATA: deployment variables normally served by expapi /deployment/env.
import { sampleDeploymentEnvResponse } from '../sampledata/auth/DeploymentEnvSampleData';

//  Register modules ONCE (always keep these registration/code calls after import)
GridModuleRegistry.registerModules([GridAllCommunityModule]);

function NzLoadContextAndVariables({ uniqueName, sessionId, sessionVariables, apiBaseUrl, isNewSession, onError, onSuccess }: INzApp) {
    // Initialize with default theme instead of null to avoid extra render
    // const [searchParams] = useSearchParams();
    // const siteToSearchId = searchParams.get("siteid");

    const [selectedTheme, setSelectedTheme] = useState<DefaultTheme>(themes.data.light);
    const [isSessionCreated, setIsSessionCreated] = useState(false);
    const [isDeploymentVarsLoaded, setIsDeploymentVarsLoaded] = useState(false);

    const sessionContext = useSessionContext();
    const mainAppContext = useMainAppContext();
    // const CommonVariableContext = useCommonVariableContext();
    const statusBarContext = useStatusBarContext();
    const chartProfileContext = useChartProfileContext();
    const explorerTreeContext = useExplorerTreeContext();

    // Use constants instead of arbitrary strings for session variable names
    // const siteId = (
    //     sessionContext?.SessionList?.length
    //         ? sessionContext.SessionList
    //         : sessionVariables
    // )?.find(
    //     (item: Record<string, any>) => item.VariableName?.toLowerCase() === SESSION_VARIABLE_NAMES.SITE_ID
    // )?.SessionValue;

    // const prevSiteIdRef = useRef<string | null>(null);


    const reportFatalError = useCallback(
        (message: string, err?: unknown) => {
            console.error("NzApp fatal error:", message, err);
            onError?.(message);
        },
        [onError]
    );

    useEffect(() => {
        // Save themes in local storage
        setSelectedTheme(themes.data.light);
    }, [])

    useEffect(() => {
        /*
        The API (expapi) is the authoritative source for deployment configuration. window.APP_CONFIG 
        is only a local fallback (e.g., for keys the API doesn't know about, like DEPLOYMENT_EXPSERVER_API_URL itself 
        which is needed just to reach the API).
        So the rule is: API values win, local config only fills gaps. 
        */
        // Load Env variables from expapi

        const isDeploymentEnvResponse = (
            response: unknown
        ): response is IDeploymentEnvResponse => {
            return (
                typeof response === "object" &&
                response !== null &&
                "valid" in response &&
                "env" in response &&
                Array.isArray((response as { env: unknown }).env)
            );
        };

        const loadDeploymentVars = async () => {
            try {
                const appConfig: IDeploymentEnv[] = Object.entries(window.APP_CONFIG ?? {}).map(
                    ([key, value]) => ({
                        key,
                        value: String(value)
                    })
                );

                const expApiUrl = appConfig.find(
                    item =>
                        item.key.toLowerCase() ===
                        "deployment_expserver_api_url"
                );

                // SAMPLE DATA: expapi /deployment/env API commented out.
                // const apiResponse = await axiosInterceptorForPostResponse(
                //     `${expApiUrl?.value ?? "/expapi"}/deployment/env`,
                //     {
                //         prefixString: "DEPLOYMENT_"
                //     }
                // );
                //
                // if (apiResponse.status !== 200) {
                //     throw new Error(`Server returned status ${apiResponse.status}`);
                // }
                void expApiUrl;
                const apiResponse: { status: number; response: unknown } = {
                    status: 200,
                    response: sampleDeploymentEnvResponse
                };

                if (!isDeploymentEnvResponse(apiResponse.response)) {
                    throw new Error("Invalid environment response.");
                }

                const { valid, env } = apiResponse.response;

                if (!valid) {
                    throw new Error("Invalid environment response.");
                }

                if (env.length === 0) {
                    throw new Error("Environment configuration not found.");
                }

                const mergedEnv = [
                    ...env,
                    ...appConfig.filter(
                        appItem =>
                            !env.some(apiItem => apiItem.key === appItem.key)
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
        const controller = new AbortController();
        const isMountedRef = { current: true };

        if (sessionId && sessionVariables.length) {
            initializeSessionData(sessionVariables, sessionId, controller.signal, isMountedRef)
        }
        const root = document.documentElement;
        root.style.setProperty("--node_height", NodeHeight);
        root.style.setProperty("--submenu_height", SubMenuHeight);

        return () => {
            isMountedRef.current = false;
            controller.abort();
        };
    }, [sessionId, sessionVariables.length, isDeploymentVarsLoaded])

    // useEffect(() => {
    //     if (!siteId || prevSiteIdRef.current === siteId || !isSessionCreated) return;

    //     prevSiteIdRef.current = siteId;
    //     const controller = new AbortController();
    //     let isMounted = true;

    //     axiosInterceptorWithoutUI({
    //         FetchProps: {
    //             url: NODE.GetKebabMenuData,
    //             data: {
    //                 "entID": siteId,
    //                 "entityName": "Site",
    //                 "kebabMenuTableName": "_Site",
    //             },
    //             customBaseUrl: apiBaseUrl,
    //             setFetchData: async (response: unknown, status?: string) => {
    //                 if (!isMounted) return;

    //                 if (
    //                     status !== "200" ||
    //                     !response ||
    //                     typeof response !== "object" ||
    //                     !("propertyJson" in response)
    //                 ) return;

    //                 try {
    //                     const parsed = FnParseJsonSafely(response.propertyJson as string);

    //                     const tableData = parsed["_Site"];

    //                     if (Array.isArray(tableData) && tableData.length) {
    //                         const siteData = tableData[0]; //  get first object

    //                         //  Save full object to context
    //                         if (isMounted) {
    //                             mainAppContext.setSiteProperties(siteData);
    //                         }
    //                     }

    //                 } catch (err) {
    //                     console.error("Failed to parse user profile data", err);
    //                 }
    //             }
    //         }, setFetchDataError: (err: IFetchInterceptorErrorData[] | null) => {
    //             if (isMounted && err?.length) {
    //                 reportFatalError(err.map(e => e.errString).join("\n"));
    //             }
    //         }, setFetchError: (err) => {
    //             if (isMounted && err) {
    //                 if (Array.isArray(err) && err.length)
    //                     reportFatalError(err[0])
    //                 else if (typeof err === "string")
    //                     reportFatalError(err)
    //             };
    //         },
    //         signal: controller.signal
    //     })

    //     return () => {
    //         isMounted = false;
    //         controller.abort();
    //     };
    // }, [siteId, isSessionCreated]);

    // Replace any with proper type (keeping unknown per IAppContainer interface)
    const handleThemeChange = useCallback(
        (theme: unknown) => {

            // Type guard to ensure theme has required properties
            if (typeof theme !== 'object' || theme === null || !('name' in theme)) {
                console.error('Invalid theme object');
                return;
            }

            const typedTheme = theme as DefaultTheme & { name: string };
            FnSetSessionStorageItem("selected_theme", typedTheme.name)
            setSelectedTheme(typedTheme);

            // if (mainAppContext.impUserProfileRecord || mainAppContext.userProfileRecord) {
            //     const userRecord = mainAppContext.impUserProfileRecord ? { ...mainAppContext.impUserProfileRecord } : { ...mainAppContext.userProfileRecord }
            //     userRecord.DisplayTheme = typedTheme.name
            //     axiosInterceptor(
            //         {
            //             url: EM.AddUpdateTableRecord,
            //             customBaseUrl: apiBaseUrl,
            //             allowShowLoader: true,
            //             data: {
            //                 jsonString: JSON.stringify({
            //                     [`_${EntityNameEnums.User}`]: userRecord
            //                 })
            //             },
            //             setFetchData: async (_resp: unknown, status?: string) => {
            //                 if (status !== "200") {
            //                     return;
            //                 }

            //                 if (mainAppContext.impUserProfileRecord) {
            //                     mainAppContext.setImpUserProfileRecord({
            //                         ...mainAppContext.impUserProfileRecord,
            //                         DisplayTheme: typedTheme.name
            //                     });
            //                 } else if (mainAppContext.userProfileRecord) {
            //                     mainAppContext.setUserProfileRecord({
            //                         ...mainAppContext.userProfileRecord,
            //                         DisplayTheme: typedTheme.name
            //                     });
            //                 }
            //             }
            //         },
            //         statusBarContext
            //     );
            // }
        },
        [mainAppContext.userProfileRecord, mainAppContext.impUserProfileRecord, statusBarContext, apiBaseUrl]
    );

    // Added proper types and return type
    // async function applyCommonSettings(
    //     sessionVars: ISession[],
    //     apTableData: IApItem[],
    //     isMountedRef: { current: boolean }
    // ): Promise<void> {
    //     // if (!isMountedRef.current) return;
    //     // const loginUser = sessionVars.find(
    //     //     (i) => i.VariableName === SESSION_VARIABLE_NAMES.LOGIN_USER_NAME
    //     // );
    //     // const getConfigValue = (
    //     //     name: string,
    //     //     isApplyUserValue: boolean = false,
    //     //     applyCanChange: number | null = null,
    //     //     userName: string = ""
    //     // ) =>
    //     //     FnGetApplicationParameter(
    //     //         SettingGroups.AdminConfiguration,
    //     //         SettingSubgroups.Configure,
    //     //         apTableData,
    //     //         undefined,
    //     //         name,
    //     //         isApplyUserValue,
    //     //         applyCanChange,
    //     //         userName
    //     //     );

    //     // const Measurement = getConfigValue(
    //     //     SettingApNames.Measurement
    //     // );

    //     // const DisplayTheme = getConfigValue(
    //     //     SettingApNames.DisplayTheme,
    //     //     true,
    //     //     null,
    //     //     loginUser?.SessionValue as string
    //     // );

    //     // const DiagnosticLevel = getConfigValue(
    //     //     SettingApNames.DiagnosticLevel
    //     // );

    //     // const hideFloorLayout = getConfigValue(
    //     //     SettingApNames.HideFloorLayout
    //     // );

    //     // if (!isMountedRef.current) return;

    //     // if (DisplayTheme?.length) {
    //     //     const theme =
    //     //         DisplayTheme[0].Value?.toLowerCase() === "system"
    //     //             ? window.matchMedia("(prefers-color-scheme: dark)").matches
    //     //                 ? "dark"
    //     //                 : "light"
    //     //             : DisplayTheme[0].Value?.toLowerCase() ?? "light";

    //     //     setSelectedTheme(themes.data[theme as keyof typeof themes.data]);
    //     //     FnSetSessionStorageItem("selected_theme", theme)
    //     // }
    //     // if (Measurement?.length) {
    //     //     CommonVariableContext.setMeasurement(
    //     //         Measurement[0].Value ?? Measurement[0].DefaultAPValue
    //     //     );
    //     // }

    //     // if (DiagnosticLevel?.length) {
    //     //     CommonVariableContext.setDiagnosticLevel(
    //     //         DiagnosticLevel[0].Value ?? DiagnosticLevel[0].DefaultAPValue
    //     //     );
    //     // }

    //     // if (hideFloorLayout?.length) {
    //     //     CommonVariableContext.setHideFloorLayout(
    //     //         hideFloorLayout[0].Value === "1"
    //     //     );
    //     // }
    // }

    // const validateSiteToSearch = useCallback(
    //     async (): Promise<boolean> => {

    //         // Nothing to process
    //         if (!siteToSearchId) {
    //             return true;
    //         }

    //         try {
    //             // STEP 1: Wait for authorization
    //             const isAuthorized = await new Promise<boolean>(
    //                 (resolve, reject) => {
    //                     axiosInterceptor(
    //                         {
    //                             url: AUTH.IsAuthorized,
    //                             data: {
    //                                 entityName: EntityNameEnums.Site,
    //                                 entID: siteToSearchId
    //                             },
    //                             setFetchData: (
    //                                 authResp: unknown,
    //                                 status?: string
    //                             ) => {
    //                                 if (
    //                                     status !== "200" ||
    //                                     !authResp ||
    //                                     typeof authResp !== "object" ||
    //                                     !("isAuthorized" in authResp)
    //                                 ) {
    //                                     resolve(false);
    //                                     return;
    //                                 }

    //                                 resolve(
    //                                     Boolean(authResp.isAuthorized)
    //                                 );
    //                             }
    //                         },
    //                         statusBarContext
    //                     ).catch(reject);
    //                 }
    //             );

    //             // Stop here if authorization failed
    //             if (!isAuthorized) {
    //                 reportFatalError(
    //                     "You are not authorized to access the selected site."
    //                 );

    //                 return false;
    //             }

    //             // STEP 2: Wait for UpdateSession
    //             const updatedSession =
    //                 await new Promise<ISession[] | null>(
    //                     (resolve, reject) => {
    //                         axiosInterceptor(
    //                             {
    //                                 url: SESSION.UpdateSession,
    //                                 data: {
    //                                     jsonSession: JSON.stringify([
    //                                         {
    //                                             VariableContext: "Location",
    //                                             VariableName: "SiteID",
    //                                             SessionValue: siteToSearchId
    //                                         },
    //                                         {
    //                                             VariableContext: "Location",
    //                                             VariableName: "SiteName",
    //                                             SessionValue: ""
    //                                         }
    //                                     ])
    //                                 },
    //                                 setFetchData: (
    //                                     updateSessionApiResponse: unknown,
    //                                     updateStatus?: string
    //                                 ) => {
    //                                     if (
    //                                         updateStatus !== "200" ||
    //                                         !updateSessionApiResponse ||
    //                                         typeof updateSessionApiResponse !==
    //                                         "object" ||
    //                                         !(
    //                                             "jsonSessionOutput" in
    //                                             updateSessionApiResponse
    //                                         )
    //                                     ) {
    //                                         resolve(null);
    //                                         return;
    //                                     }

    //                                     const extractedData =
    //                                         FnHandleAPIResponse(
    //                                             updateSessionApiResponse
    //                                                 .jsonSessionOutput,
    //                                             "Dataset"
    //                                         );

    //                                     if (
    //                                         !extractedData ||
    //                                         !Array.isArray(extractedData)
    //                                     ) {
    //                                         resolve(null);
    //                                         return;
    //                                     }

    //                                     resolve(
    //                                         extractedData as ISession[]
    //                                     );
    //                                 }
    //                             },
    //                             statusBarContext
    //                         ).catch(reject);
    //                     }
    //                 );

    //             // Stop if UpdateSession failed
    //             if (!updatedSession) {
    //                 reportFatalError(
    //                     "Unable to update site session."
    //                 );

    //                 return false;
    //             }

    //             // STEP 3: Update React session state
    //             sessionContext.setSessionList(
    //                 updatedSession
    //             );

    //             // STEP 4: Allow further processing/rendering

    //             return true;
    //         } catch (error) {
    //             console.error(
    //                 "Failed to process URL session:",
    //                 error
    //             );

    //             reportFatalError(
    //                 "Unable to process site session."
    //             );

    //             return false;
    //         }
    //     },
    //     [
    //         searchParams,
    //         statusBarContext,
    //         sessionContext.setSessionList
    //     ]
    // );

    //Added proper types and return type
    async function initializeSessionData(
        sessionVarResponse: ISession[],
        newSessionId: string | null,
        signal: AbortSignal,
        isMountedRef: { current: boolean }
    ): Promise<void> {
        if (!sessionVarResponse.length || !newSessionId) return;

        const safeParseDataset = (val: any, type: string) => {
            return typeof val === "string"
                ? FnHandleAPIResponse(val, type)
                : FnHandleAPIResponse(JSON.stringify(val), type);
        };

        let apTableData: IApItem[] | null = null;
        let featureTableData: IFeatureItem[] | null = null;

        // Extract validation functions to reduce nesting
        const validateRequiredField = (_fieldName: string, data: any, errorMsg: string): boolean => {
            if (!data) {
                reportFatalError(errorMsg);
                return false;
            }
            return true;
        };

        // await validateSiteToSearch();

        // SAMPLE DATA: InitSession API commented out — only feature records loaded from ServiceFeature.json.
        // const handleInitSessionResponse = (
        //     data: Record<string, any>
        // ): boolean => {
        //     if (!isMountedRef.current) return false;
        //
        //     const accumulatedContextData: Record<string, any> = {};
        //
        //     try {
        //
        //         // APJson (Required)
        //         // Use constants for key names
        //         if (!validateRequiredField('APJson', data[SESSION_DATA_KEYS.AP_JSON], "AP data not found")) {
        //             return false;
        //         }
        //         const apResult = safeParseDataset(
        //             data[SESSION_DATA_KEYS.AP_JSON],
        //             "Dataset"
        //         );
        //
        //         //Add runtime validation before type assertion
        //         if (!Array.isArray(apResult) || !apResult.length) {
        //             reportFatalError("AP table is empty");
        //             return false;
        //         }
        //
        //         accumulatedContextData.APJson = apResult;
        //         apTableData = apResult as IApItem[];
        //
        //         // FeaturesJson (Required)
        //         if (!validateRequiredField('FeaturesJson', data[SESSION_DATA_KEYS.FEATURES_JSON]?.Features, "Features data not found")) {
        //             return false;
        //         }
        //
        //         if (
        //             !Array.isArray(data[SESSION_DATA_KEYS.FEATURES_JSON].Features) ||
        //             !data[SESSION_DATA_KEYS.FEATURES_JSON].Features.length
        //         ) {
        //             reportFatalError("Features table is empty");
        //             return false;
        //         }
        //
        //         accumulatedContextData.FeaturesJson =
        //             data[SESSION_DATA_KEYS.FEATURES_JSON].Features;
        //
        //         featureTableData =
        //             data[SESSION_DATA_KEYS.FEATURES_JSON].Features;
        //
        //         // EmPgJson (Required)
        //         if (!validateRequiredField('EmPgJson', data[SESSION_DATA_KEYS.EM_PG_JSON]?.["NZ.Em.Pg"], "EmPgJson data not found")) {
        //             return false;
        //         }
        //
        //         if (
        //             !Array.isArray(data[SESSION_DATA_KEYS.EM_PG_JSON]["NZ.Em.Pg"]) ||
        //             !data[SESSION_DATA_KEYS.FEATURES_JSON].Features.length
        //         ) {
        //             reportFatalError("EmPgJson table is empty");
        //             return false;
        //         }
        //
        //         accumulatedContextData.EmPgJson =
        //             data[SESSION_DATA_KEYS.EM_PG_JSON]["NZ.Em.Pg"];
        //
        //         // SiteHierarchyJson (Required)
        //         if (!validateRequiredField('SiteHierarchyJson', data[SESSION_DATA_KEYS.SITE_HIERARCHY_JSON], "SiteHierarchy data not found")) {
        //             return false;
        //         }
        //
        //         accumulatedContextData.SiteHierarchyJson =
        //             data[SESSION_DATA_KEYS.SITE_HIERARCHY_JSON];
        //
        //         // LoginUserJson (Required)
        //         if (!validateRequiredField('LoginUserJson', data[SESSION_DATA_KEYS.LOGIN_USER_JSON], "User data not found")) {
        //             return false;
        //         }
        //
        //         accumulatedContextData.LoginUserJson =
        //             data[SESSION_DATA_KEYS.LOGIN_USER_JSON];
        //
        //         const userProfileRecord = FnHandleAPIResponse(accumulatedContextData.LoginUserJson, "Dataset")
        //
        // if (typeof userProfileRecord === "object" && "_User" in userProfileRecord && Array.isArray(userProfileRecord["_User"]) && userProfileRecord["_User"].length) {
        //     mainAppContext.setUserProfileRecord(userProfileRecord["_User"][0])
        // } else {
        //     reportFatalError("User profile data not found.");
        //     return false;
        // }
        //         // Check if component is still mounted before setting context
        //         if (!isMountedRef.current) return false;
        //
        //         // Load required context first; transfer data from accumulatedContextData
        //         mainAppContext.setApRecords(
        //             accumulatedContextData.APJson
        //         );
        //
        //         mainAppContext.setFeatureRecords(
        //             accumulatedContextData.FeaturesJson
        //         );
        //
        //         mainAppContext.setAllFeatureRecords(
        //             accumulatedContextData.FeaturesJson
        //         );
        //
        //         mainAppContext.setEmRecords(
        //             accumulatedContextData.EmPgJson
        //         );
        //
        //         explorerTreeContext.setSiteHierarchyRecords(
        //             accumulatedContextData.SiteHierarchyJson
        //         );
        //
        //         // Optional tables processing starts here
        //         for (const key in data) {
        //             // Check if component is still mounted
        //             if (!isMountedRef.current) return false;
        //
        //             try {
        //
        //                 const keyToFind = key.toLowerCase();
        //
        //                 //  Use constants instead of magic strings
        //                 if (keyToFind === SESSION_DATA_KEYS.AP_PROFILE_JSON) {
        //
        //                     const parsedData = safeParseDataset(
        //                         data[key],
        //                         "Dataset"
        //                     );
        //
        //                     if (
        //                         typeof parsedData === "object" &&
        //                         parsedData["PG.APProfile"]
        //                     ) {
        //
        //                         mainAppContext.setApProfileRecords(
        //                             parsedData["PG.APProfile"]
        //                         );
        //                     }
        //                 }
        //
        //                 else if (keyToFind === SESSION_DATA_KEYS.ALERT_PROFILE_JSON) {
        //
        //                     const parsedData = safeParseDataset(
        //                         data[key],
        //                         "Dataset"
        //                     );
        //
        //                     if (
        //                         typeof parsedData === "object" &&
        //                         parsedData["_AlertProfile"]
        //                     ) {
        //
        //                         mainAppContext.setAlertProfileRecords(
        //                             parsedData["_AlertProfile"]
        //                         );
        //                     }
        //                 }
        //
        //                 else if (keyToFind === SESSION_DATA_KEYS.CHART_PROFILE_JSON) {
        //
        //                     const parsedData = safeParseDataset(
        //                         data[key],
        //                         "Dataset"
        //                     );
        //
        //                     if (parsedData &&
        //                         typeof parsedData === "object" &&
        //                         parsedData["_ChartProfile"]
        //                     ) {
        //
        //                         chartProfileContext.setChartProfiles(
        //                             parsedData["_ChartProfile"]
        //                         );
        //                     }
        //                 }
        //
        //                 else if (keyToFind === SESSION_DATA_KEYS.NZ_PG_REF_JSON) {
        //
        //                     const parsedData = safeParseDataset(
        //                         data[key],
        //                         "Data"
        //                     );
        //
        //                     if (Array.isArray(parsedData)) {
        //
        //                         mainAppContext.setRefTableRecords(
        //                             parsedData
        //                         );
        //                     }
        //                 }
        //
        //                 else if (keyToFind === SESSION_DATA_KEYS.API_PROFILE_JSON) {
        //
        //                     const parsedData = safeParseDataset(
        //                         data[key],
        //                         "Dataset"
        //                     );
        //
        //                     if (
        //                         parsedData &&
        //                         typeof parsedData === "object" &&
        //                         Array.isArray(parsedData._ApiProfile)
        //                     ) {
        //
        //                         const filterAutoExecuteWorkorder =
        //                             parsedData._ApiProfile.filter(
        //                                 (ele: any) =>
        //                                     ele.Name === "AutoExecuteWorkorder"
        //                             );
        //
        //                         mainAppContext.setApiProfileRecords(
        //                             parsedData._ApiProfile
        //                         );
        //
        //                         // Check array length before accessing index
        //                         mainAppContext.setAutoExecuteWorkorder(
        //                             filterAutoExecuteWorkorder.length > 0 &&
        //                             Number(filterAutoExecuteWorkorder[0].Value) !== 0
        //                         );
        //                     }
        //                 }
        //
        //                 else if (keyToFind === SESSION_DATA_KEYS.FLOOR_DEVICES_JSON) {
        //
        //                     if (
        //                         data[key] &&
        //                         typeof data[key] === "object"
        //                     ) {
        //
        //                         explorerTreeContext.setFloorDeviceHierarchyRecords(
        //                             data[key]
        //                         );
        //                     }
        //                 }
        //
        //                 else if (keyToFind === SESSION_DATA_KEYS.FLOOR_JSON) {
        //
        //                     if (
        //                         data[key] &&
        //                         typeof data[key] === "object"
        //                     ) {
        //
        //                         mainAppContext.setFloorLayoutRecord(
        //                             data[key]
        //                         );
        //                     }
        //                 }
        //
        //                 else if (keyToFind === SESSION_DATA_KEYS.DCI_JSON) {
        //
        //                     const parsedData = data[key];
        //
        //                     if (
        //                         parsedData &&
        //                         typeof parsedData === "object" &&
        //                         Array.isArray(parsedData._DCI)
        //                     ) {
        //
        //                         mainAppContext.setDciRecords(
        //                             parsedData._DCI
        //                         );
        //                     }
        //                 }
        //                 else if (keyToFind === SESSION_DATA_KEYS.IMP_USER_JSON) {
        //
        //                     if (
        //                         data[key] &&
        //                         typeof data[key] === "object"
        //                     ) {
        //                         const impUserProfileRecord = FnHandleAPIResponse(data[key], "Dataset")
        //
        //                         if (typeof impUserProfileRecord === "object" && "_User" in impUserProfileRecord && Array.isArray(impUserProfileRecord["_User"]) && impUserProfileRecord["_User"].length) {
        //                             mainAppContext.setImpUserProfileRecord(impUserProfileRecord["_User"][0])
        //                         }
        //
        //                     }
        //                 }
        //
        //             } catch (error) {
        //                 // Don't fail for optional data processing errors
        //                 console.warn(`Failed to process optional data ${key}:`, error);
        //                 // Continue processing other keys instead of returning false
        //             }
        //         }
        //
        //         return true;
        //
        //     } catch (error) {
        //
        //         reportFatalError(
        //             "Failed to initialize session",
        //             error
        //         );
        //
        //         return false;
        //     }
        // };
        //
        // axiosInterceptorWithoutUI({
        //     FetchProps: {
        //         url: SESSION.InitSession,
        //         data: {},
        //         customBaseUrl: apiBaseUrl,
        //         setFetchData: async (handleApiResponse: unknown, status?: string) => {
        //             if (!isMountedRef.current) return;
        //
        //             if (status === "200" && handleApiResponse && typeof handleApiResponse === "object" && 'initDataJson' in handleApiResponse) {
        //
        //                 try {
        //                     //Add validation before
        //                     if (typeof handleApiResponse.initDataJson !== 'string') {
        //                         reportFatalError("Invalid session data format: initDataJson must be a string");
        //                         return;
        //                     }
        //
        //                     const parsed = FnParseJsonSafely(handleApiResponse.initDataJson);
        //
        //                     if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        //                         const isValidSessionData =
        //                             handleInitSessionResponse(parsed);
        //
        //                         if (!isValidSessionData) {
        //                             return;
        //                         }
        //                     }
        //
        //                     if (apTableData) {
        //                         await applyCommonSettings(sessionVarResponse, apTableData, isMountedRef);
        //                     }
        //
        //                     // Add error message for missing required data
        //                     if (!featureTableData) {
        //                         reportFatalError("Feature data is required but missing after session initialization");
        //                         return;
        //                     }
        //
        //                     if (isMountedRef.current) {
        //                         sessionContext.setSessionList(sessionVarResponse);
        //                         setIsSessionCreated(true);
        //
        //                         // Add try-catch for onSuccess callback
        //                         try {
        //                             onSuccess();
        //                         } catch (error) {
        //                             console.error("Error in onSuccess callback:", error);
        //                         }
        //                     }
        //                 } catch (error) {
        //                     reportFatalError("Failed to initialize session", error);
        //
        //                 }
        //
        //             }
        //         }
        //     }, setFetchDataError: (err: IFetchInterceptorErrorData[] | null) => {
        //         if (isMountedRef.current && Array.isArray(err) && err.length > 0) {
        //             const errorMessage = err
        //                 .filter((item) => item.errCode > 0)
        //                 .map((item) => item.errString ?? "")
        //                 .filter(Boolean)
        //                 .join("\n");
        //
        //             if (errorMessage) {
        //                 reportFatalError(errorMessage);
        //             }
        //         }
        //     }, setFetchError: (err) => {
        //         if (isMountedRef.current && err) {
        //             if (Array.isArray(err) && err.length)
        //                 reportFatalError(err[0])
        //             else if (typeof err === "string")
        //                 reportFatalError(err)
        //         };
        //     },
        //     signal: signal
        // })

        if (!isMountedRef.current) return;

        if (!sampleFeatureRecords.length) {
            reportFatalError("Features table is empty");
            return;
        }

        if (
            !sampleSiteHierarchyRecords ||
            !Array.isArray(sampleSiteHierarchyRecords.Site) ||
            !sampleSiteHierarchyRecords.Site.length
        ) {
            reportFatalError("SiteHierarchy data not found");
            return;
        }

        featureTableData = sampleFeatureRecords;
        mainAppContext.setFeatureRecords(sampleFeatureRecords);
        mainAppContext.setAllFeatureRecords(sampleFeatureRecords);
        explorerTreeContext.setSiteHierarchyRecords(sampleSiteHierarchyRecords);

        // SAMPLE DATA: LoginUserJson replaces InitSession user profile payload.
        const userProfileRecord = FnHandleAPIResponse(sampleLoginUserJson, "Dataset");
        if (
            typeof userProfileRecord === "object"
            && userProfileRecord
            && "_User" in userProfileRecord
            && Array.isArray(userProfileRecord["_User"])
            && userProfileRecord["_User"].length
        ) {
            mainAppContext.setUserProfileRecord(userProfileRecord["_User"][0]);
        } else {
            reportFatalError("User profile data not found.");
            return;
        }

        console.warn("[sample-data] SESSION.InitSession not called — features, site hierarchy, and LoginUserJson loaded from sample JSON");

        sessionContext.setSessionList(sessionVarResponse);
        setIsSessionCreated(true);

        try {
            onSuccess();
        } catch (error) {
            console.error("Error in onSuccess callback:", error);
        }

        void signal;
        void safeParseDataset;
        void validateRequiredField;
        void apTableData;
        void featureTableData;
        // void applyCommonSettings;
        void chartProfileContext;
    }

    return (
        <ThemeProvider theme={selectedTheme}>
            <GlobalStyles />

            {isSessionCreated && isDeploymentVarsLoaded && (
                <AppContainer
                    isNewSession={isNewSession}
                    uniqueName={uniqueName}
                    handleThemeChange={handleThemeChange}
                />
            )}
        </ThemeProvider>
    );
}

// Combined NzApp component with context and routing wrapper
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
