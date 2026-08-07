/*
 * Host wiring for the portable fetch interceptor.
 *
 * Rest of the app keeps importing from this file.
 * When moving FetchInterceptorCore to a library, change ONLY this file:
 *   - import createFetchInterceptor from the library package
 *   - keep the same exports below (typed with host IApiResponse / IFetchProps / IStatusBar)
 */
import { FnGetEnvVariableByKey } from "../../appcontainer/allcommon/FnGetEnvVariableByKey";
import { envVarEnums } from "../../appcontainer/alldefaultprops/DefaultPropsAppContainer";
import { FnGetEntityErrorMessage } from "../allcommon/FnGetEntityErrorMessage";
import { FnGetTodayTimeString } from "../allcommon/FnGetTodayTimeString";
import { getDiagnosticLevelData } from "../context/contextandprovider/CommonVariable";
import { createAxiosInterceptor } from '@n20a/libaxios'

const getBaseApiUrl = (customBaseUrl?: string): string => {
    if (customBaseUrl) return customBaseUrl;

    const envBaseUrl = FnGetEnvVariableByKey(envVarEnums.USER_GUIDE_URL);
    if (envBaseUrl) return envBaseUrl;

    const prodUrl = window?.location?.origin ?? "";
    const isProd = import.meta.env.PROD;
    return isProd ? `${prodUrl}/n20api` : "https://n20a.netzoom.com/n20api";
};



const interceptorApi = createAxiosInterceptor({
    getSessionId: () => { return null },
    getBaseApiUrl,
    getDiagnosticLevel: getDiagnosticLevelData,
    getTodayTimeString: FnGetTodayTimeString,
    getEntityErrorMessage: FnGetEntityErrorMessage,
    sessionStorageKey: "user_session",
    sessionHeaderName: "Authorization",
    defaultTimeoutMs: 60000,
});

const {
    axiosInterceptorToGetFileFromPublic,
    axiosInterceptorForThirdPartyApis,
} = interceptorApi;

export {

    axiosInterceptorToGetFileFromPublic,
    axiosInterceptorForThirdPartyApis,
};
