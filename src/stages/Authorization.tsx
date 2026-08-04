
import { useEffect, useRef } from "react";
import { getRuntimeConfig } from '@n20a/libauth'
import {
    IApiResponse,
    IAuthorization,
    ICreateSessionResponse,
    IIsSessionOpenResponse,
    IJsonSessionOutput
} from "./IAuthorization";
import { ISession } from "../component/shared/context/allinterface/ISession";
// SAMPLE DATA: create_session / is_session_open / server status APIs disabled.
import {
    sampleCreateSessionResponse,
    sampleIsSessionOpenResponse,
    sampleServerStatusResponse,
    sampleSessionId
} from "../sampledata/auth/AuthorizationSampleData";


const FnCheckServerStatus = async (): Promise<{
    ok: boolean;
    error?: string;
}> => {
    const cached = sessionStorage.getItem("server_status_ok");

    if (cached) {
        return { ok: true };
    }

    // SAMPLE DATA: API call commented out — sample status returned below.
    // try {
    //     // Determine base URL
    //     const produrl = window.location.origin;
    //     const isProd = import.meta.env.PROD;
    //     const baseUrl = isProd
    //         ? `${produrl}/expapi`
    //         : "/expapi";
    //
    //     // POST API call
    //     const res = await fetch(`${baseUrl}/server/status`, {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json"
    //         },
    //         body: JSON.stringify({
    //             prefixString: "SERVER_"
    //         })
    //     });
    //
    //     if (!res.ok) {
    //         return {
    //             ok: false,
    //             error: `No configuration found for the server (${res.status})`
    //         };
    //     }
    //
    //     const apiResponse = await res.json();
    //
    //     if (!apiResponse) {
    //         return {
    //             ok: false,
    //             error: "No configuration found for the server"
    //         };
    //     }
    //
    //     // Cache success
    //     sessionStorage.setItem("server_status_ok", "1");
    //
    //     return { ok: true };
    // } catch (err: any) {
    //     return {
    //         ok: false,
    //         error: err?.message ?? "Unknown server error"
    //     };
    // }

    if (!sampleServerStatusResponse.ok) {
        return {
            ok: false,
            error: sampleServerStatusResponse.error ?? "No configuration found for the server"
        };
    }

    // Cache success
    sessionStorage.setItem("server_status_ok", "1");

    return { ok: true };
};

const Authorization = ({ onSuccess, onError, apiBaseUrl, userData }: IAuthorization) => {
    const { API_AT } = getRuntimeConfig();
    const initializedRef = useRef(false);
    const produrl = window.location.origin;
    const isProd = import.meta.env.PROD;
    const baseUrl = isProd
        ? `${produrl}/${API_AT ?? "n20api"}`
        : apiBaseUrl ?? "";

    /* ---------------- FETCH ---------------- */

    // SAMPLE DATA: real fetch disabled — create/open session use sample responses instead.
    // const fetchJson = async <T,>(
    //     url: string,
    //     options?: RequestInit
    // ): Promise<IApiResponse<T>> => {
    //     const res = await fetch(`${baseUrl}${url}`, {
    //         headers: {
    //             "Content-Type": "application/json",
    //             ...(options?.headers || {})
    //         },
    //         ...options
    //     });
    //
    //     if (!res.ok) {
    //         let errMsg = `API failed: ${res.status}`;
    //         try {
    //             const errJson = await res.json();
    //             errMsg = errJson?.errData?.map((e: any) => e.errString).join("\n") ?? errMsg;
    //         } catch { /* response body is not JSON (e.g. 502 HTML page) */ }
    //         throw new Error(errMsg);
    //     }
    //
    //     const json = await res.json();
    //
    //     return json;
    // };
    void baseUrl;
    void userData;

    const fail = (message: string) => {
        onError?.(message);
    };
    /* ---------------- HELPERS ---------------- */

    const parseJsonSessionOutput = (
        json?: string
    ): ISession[] => {
        if (!json) return [];

        try {
            const parsed = JSON.parse(json) as IJsonSessionOutput;

            if (Array.isArray(parsed.SessionValues)) {
                return parsed.SessionValues;
            }
            if (Array.isArray((parsed as any).SessionVariables)) {
                return (parsed as any).SessionVariables;
            }
        } catch (error) {
            console.error('Error in parse json string :', error);
            /* ignore */
        }
        return [];
    };

    const handleErrData = (resp: { errData?: any[] }) => {
        if (resp.errData?.length) {
            const msg = resp.errData
                .filter(e => e.isErr)
                .map(e => e.errString)
                .join("\n");

            if (msg) throw new Error(msg);
        }
    };

    /* ---------------- API ---------------- */
    const searchParams = new URLSearchParams(window.location.search);

    const isNewParam = searchParams.get("isnew");
    const idParam = searchParams.get("id");
    // const impUserParam = searchParams.get("impuser");
    // const impUserIdParam = searchParams.get("impuserid");
    // const featureId = searchParams.get("location");

    // SAMPLE DATA: create_session API commented out.
    // const createSession = async (sessionId?: string) =>
    //     fetchJson<ICreateSessionResponse>('/session/create_session', {
    //         method: "POST",
    //         headers: {
    //             Authorization: sessionId ? `nzSessionId ${sessionId}` : "",
    //             nz_jsonsession: impUserParam && impUserIdParam
    //                 ? JSON.stringify([
    //                     {
    //                         VariableContext: "Impersonation",
    //                         VariableName: "ImpersonatedUserID",
    //                         SessionValue: impUserIdParam
    //                     },
    //                     {
    //                         VariableContext: "Impersonation",
    //                         VariableName: "ImpersonatedUserName",
    //                         SessionValue: impUserParam
    //                     }
    //                 ])
    //                 : userData?.email || userData?.username ? JSON.stringify([{
    //                     VariableContext: "RequestedBy",
    //                     VariableName: "LoginUserName",
    //                     SessionValue: userData.username
    //                 },
    //                 {
    //                     VariableContext: "RequestedBy",
    //                     VariableName: "LoginUserEmail",
    //                     SessionValue: userData.email
    //                 }]) : featureId ? JSON.stringify([{
    //                     VariableContext: "Feature",
    //                     VariableName: "FeatureID",
    //                     SessionValue: featureId
    //                 }])
    //                     : "",
    //
    //             nz_issystemsessionid: 'false',
    //             Nz_isfromui: 'true'
    //         }
    //     });

    // SAMPLE DATA: is_session_open API commented out.
    // const isSessionOpen = async (sessionId: string) =>
    //     fetchJson<IIsSessionOpenResponse>('/session/is_session_open', {
    //         method: "POST",
    //         body: JSON.stringify({ sessionId })
    //     });


    /* ---------------- SESSION HANDLER ---------------- */

    const handleCreateSessionResponse = async (
        resp: IApiResponse<ICreateSessionResponse>
    ) => {
        handleErrData(resp);

        const { newSessionID, jsonSessionOutput } = resp.data;

        if (!newSessionID) {
            throw new Error("Session ID missing");
        }

        sessionStorage.setItem("user_session", newSessionID);
        const isValid = await FnCheckServerStatus();
        if (!isValid.ok && isValid.error) {
            fail(isValid.error);
            return;
        }

        onSuccess({
            sessionId: newSessionID ?? "",
            sessionVariables: parseJsonSessionOutput(jsonSessionOutput),
            isNewSession: true
        });
    };

    const handleOpenSessionResponse = async (
        resp: IApiResponse<IIsSessionOpenResponse>,
        sessionId: string
    ) => {
        handleErrData(resp);
        const isValid = await FnCheckServerStatus();
        if (!isValid.ok && isValid.error) {
            fail(isValid.error);
            return;
        }

        onSuccess({
            sessionId,
            sessionVariables: parseJsonSessionOutput(resp.data.jsonStringOutput),
            isNewSession: false
        });
    };


    /* ---------------- INIT ---------------- */

    const init = async () => {
        const storedSession = sessionStorage.getItem("user_session");
        if (isNewParam === "false" && idParam) {
            // SAMPLE DATA: isSessionOpen API skipped — sample open response used.
            // const openResp = await isSessionOpen(idParam);
            const openResp = sampleIsSessionOpenResponse;

            if (openResp.data.isOpen === true) {
                sessionStorage.setItem("user_session", idParam);
                handleOpenSessionResponse(openResp, idParam);
                return;
            }

            fail("Session is not open or invalid");
            return;
        }
        if (storedSession) {
            // SAMPLE DATA: isSessionOpen API skipped — sample open response used.
            // const openResp = await isSessionOpen(storedSession);
            const openResp = sampleIsSessionOpenResponse;

            if (openResp.data.isOpen === true) {
                handleOpenSessionResponse(openResp, storedSession);
                return;
            }

            sessionStorage.removeItem("user_session");
        }

        // SAMPLE DATA: createSession API skipped — sample create response used.
        // const createResp = await createSession(idParam ?? undefined);
        const createResp = sampleCreateSessionResponse;
        console.warn("[sample-data] create_session / is_session_open not called — using sample session", sampleSessionId);

        if (createResp.status === 100) {
            const errorData = createResp.errData?.find((item) => item.errCode > 0);
            fail(errorData?.errString ?? "Session not found")
            return
        }
        handleCreateSessionResponse(createResp);
    };


    /* ---------------- EFFECT ---------------- */

    useEffect(() => {
        if (initializedRef.current) return;
        initializedRef.current = true;

        init().catch(err => {
            console.error("Authorization failed:", err);
            fail(err.message);
        });
    }, []);

    return null;
};

export { Authorization };
