import { FnGetSessionStorageItem } from "../../shared/allcommon/basic/FnGetSessionStorageItem";
import { FnGetSessionVariableFromStorage } from "../../shared/allcommon/basic/FnGetSessionVariableFromStorage";
import { IStatusBar } from "../../shared/context/allinterface/IStatusBar";
import { ISession } from "../../shared/context/allinterface/ISession";
import { IFnCreateForensiclog } from "../allinterface/IFnCreateForensiclog"

function splitForensicPayload(payload: any) {
    const MAX_LENGTH = 1020;

    const logs = payload?._ForensicLog;

    if (!Array.isArray(logs) || logs.length === 0) {
        return payload;
    }

    const originalLog = logs[0]; // assuming single object like your example
    const logString = originalLog?.LogString;

    // If small → return same payload
    if (!logString || logString.length <= MAX_LENGTH) {
        return payload;
    }

    const newLogs = [];
    let start = 0;

    while (start < logString.length) {
        let chunk = logString.substring(start, start + MAX_LENGTH);

        // Add ... if more content exists
        if (start + MAX_LENGTH < logString.length) {
            chunk += "...";
        }

        newLogs.push({
            ...originalLog,
            LogString: chunk
        });

        start += MAX_LENGTH;
    }

    return {
        ...payload,
        _ForensicLog: newLogs
    };
}
/* SAMPLE DATA: forensic log write API is disabled. */
const callAddUpdateAPI = (payload: Record<string, any>, _statusBarContext: IStatusBar) => {
    const data = splitForensicPayload(payload);
    console.warn("[sample-data] EM.AddTableRecord not called for forensic log", data);
    return Promise.resolve(null);
};

const getSessionValue = (
    sessionList: ISession[],
    variableContext: string,
    variableName: string
): string => {
    const sessionValueByContext = FnGetSessionVariableFromStorage(variableContext, variableName, sessionList);
    const sessionValue = sessionValueByContext?.[0]?.SessionValue
        || sessionList.find((item) => item.VariableName?.toLowerCase() === variableName.toLowerCase())?.SessionValue;

    return sessionValue || "";
};

const FnCreateForensiclog = (props: IFnCreateForensiclog) => {
    try {
        const siteName = props.site || getSessionValue(props.sessionContext.SessionList, 'Location', "SiteName");
        const tenantName = props.tenant || getSessionValue(props.sessionContext.SessionList, 'Filter', "TenantName");
        const userName = props.userName || getSessionValue(props.sessionContext.SessionList, 'RequestedBy', "LoginShortName");
        if (!siteName || !userName) {
            console.error(`Missing site and user session data`)
            // throw new Error("Missing site and user session data");
        }
        // find message template from ref table 
        let msgTemplate = '';
        if (props.GroupName && props.SubGroupName && props.RefTableItems.length) {
            const filteredItems = props.RefTableItems.find((item: any) =>
                item.GroupName === props.GroupName
                && item.SubGroupName === props.SubGroupName
                && item.Name === props.LogName);
            if (filteredItems) {
                msgTemplate = filteredItems.RefValue;
            } else {
                // throw new Error(`No message template found for ${props.GroupName} and ${props.SubGroupName}`);
                console.error(`No message template found for ${props.GroupName} and ${props.SubGroupName}`)
            }
        }
        const actionObject = props.actionObject ? { ...props.actionObject, UserName: userName } : { UserName: userName }
        // create message based on passed message name and action object
        const message = props.LogString ? props.LogString :
            msgTemplate ? getMessgeTempleteForForensicAndReplaceVariables(msgTemplate, actionObject) : "";
        if (message.length) {
            const sessionid = FnGetSessionStorageItem("user_session");
            const payload = {
                logType: props.logType,
                _Forensiclog: props._Forensiclog,
                LogString: message,
                LogOwnerEntID: props.LogOwnerEntID,
                LogOwnerEntitiyName: props.LogOwnerEntitiyName,
                UserSessionID: sessionid,
                SiteName: siteName,
                UserName: userName,
                TenantName: tenantName
            }
            // Add Record in _ForensicLog table 
            const data = callAddUpdateAPI({ "_ForensicLog": [payload] }, props.statusBarContext);
            return data;
        } else {
            console.error("Message not found.")
            return;
        }

    } catch (error) {
        console.error("Error in FnCreateForensiclog:", error);
        throw error;
    }
}

const getMessgeTempleteForForensicAndReplaceVariables = (
    msgTemplate: string,
    data: Record<string, any>
): string => {
    const dataByLowerCaseKey = Object.keys(data).reduce<Record<string, any>>((acc, key) => {
        acc[key.toLowerCase()] = data[key];
        return acc;
    }, {});

    const replaceVariable = (_match: string, key: string): string => {
        const value = dataByLowerCaseKey[key.trim().toLowerCase()];
        return value === undefined || value === null ? "" : String(value);
    };

    const hasValue = (key: string): boolean => {
        const value = dataByLowerCaseKey[key.trim().toLowerCase()];
        return value !== undefined && value !== null && String(value) !== "";
    };

    const replaceOptionalSection = (_match: string, content: string): string => {
        const keys = Array.from(content.matchAll(/<([^>]+)>|\$\{([^}]+)\}/g), (match) => match[1] || match[2]);

        if (!keys.length || keys.some((key) => !hasValue(key))) {
            return "";
        }

        return content
            .replace(/<([^>]+)>/g, replaceVariable)
            .replace(/\$\{([^}]+)\}/g, replaceVariable);
    };

    return msgTemplate
        // Handle optional sections like [, Room: <room>]
        .replace(/\[([^\[\]]+)\]/g, replaceOptionalSection)

        // Handle <key>
        .replace(/<([^>]+)>/g, replaceVariable)

        // Handle ${key}
        .replace(/\$\{([^}]+)\}/g, replaceVariable);
};
export { getMessgeTempleteForForensicAndReplaceVariables, FnCreateForensiclog }
