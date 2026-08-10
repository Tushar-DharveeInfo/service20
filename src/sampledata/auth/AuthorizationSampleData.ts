/*
 * SAMPLE DATA: stand-in responses for the Authorization stage while the
 * session/server APIs are disabled.
 */
import type { ISession } from "../../component/shared/context/allinterface/ISession";
import type {
    IApiResponse,
    ICreateSessionResponse,
    IIsSessionOpenResponse,
    IJsonSessionOutput
} from "../../stages/IAuthorization";

const sampleSessionId = "SAMPLE-SESSION-0000-1111-2222";

/* Session variables the app reads after authorization succeeds. */
const sampleSessionVariables: ISession[] = [
    { VariableContext: "RequestedBy", VariableName: "LoginUserID", SessionValue: "SAMPLE-USER-0001" },
    { VariableContext: "RequestedBy", VariableName: "LoginUserName", SessionValue: "demo.user" },
    { VariableContext: "RequestedBy", VariableName: "LoginUserEmail", SessionValue: "demo.user@example.com" },
    { VariableContext: "RequestedBy", VariableName: "LoginShortName", SessionValue: "Admin" },
    { VariableContext: "RequestedBy", VariableName: "LoginUserBasicRoleName", SessionValue: "Administrator" },

    { VariableContext: "Location", VariableName: "RoomID", SessionValue: "SAMPLE-ROOM-0001" },
    { VariableContext: "Location", VariableName: "RoomName", SessionValue: "sample R 1" },
    { VariableContext: "Location", VariableName: "FloorID", SessionValue: "SAMPLE-FLOOR-0001" },
    { VariableContext: "Location", VariableName: "FloorName", SessionValue: "test data 1" },
    { VariableContext: "Location", VariableName: "LocationID", SessionValue: "SAMPLE-LOC-0001" },
    { VariableContext: "Location", VariableName: "LocationName", SessionValue: "" },

    { VariableContext: "Filter", VariableName: "TenantName", SessionValue: null },

    { VariableContext: "Node", VariableName: "SelectedNodeID", SessionValue: null },
    { VariableContext: "Node", VariableName: "SelectedNodeEntity", SessionValue: null },
    { VariableContext: "Node", VariableName: "SelectedNodeName", SessionValue: null },

    { VariableContext: "Feature", VariableName: "FeatureID", SessionValue: "" }
];

const sampleJsonSessionOutput: IJsonSessionOutput = {
    TotalOpenSessions: 1,
    SessionValues: sampleSessionVariables
};

/* sample the `/server/status` check result. */
const sampleServerStatusResponse: { ok: boolean; error?: string } = { ok: true };

/* sample `/session/create_session`. */
const sampleCreateSessionResponse: IApiResponse<ICreateSessionResponse> = {
    status: 200,
    data: {
        newSessionID: sampleSessionId,
        jsonSessionOutput: JSON.stringify(sampleJsonSessionOutput)
    },
    errData: []
};

/* sample `/session/is_session_open`. */
const sampleIsSessionOpenResponse: IApiResponse<IIsSessionOpenResponse> = {
    status: 200,
    data: {
        isOpen: true,
        jsonStringOutput: JSON.stringify(sampleJsonSessionOutput)
    },
    errData: []
};

/* Resolves the sample response for a session endpoint path. */
const FnGetSampleAuthApiResponse = (url: string): IApiResponse<unknown> => {
    if (url.includes("is_session_open")) {
        return sampleIsSessionOpenResponse;
    }
    if (url.includes("create_session")) {
        return sampleCreateSessionResponse;
    }
    return { status: 200, data: {}, errData: [] };
};

export {
    sampleSessionId,
    sampleSessionVariables,
    sampleJsonSessionOutput,
    sampleServerStatusResponse,
    sampleCreateSessionResponse,
    sampleIsSessionOpenResponse,
    FnGetSampleAuthApiResponse
};
