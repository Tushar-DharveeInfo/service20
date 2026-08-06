import { FnGetSessionStorageItem } from "../../shared/allcommon/basic/FnGetSessionStorageItem";
import { FnGetSessionVariableFromStorage } from "../../shared/allcommon/basic/FnGetSessionVariableFromStorage";
import { IStatusBar } from "../../shared/context/allinterface/IStatusBar";
import { ISession } from "../../shared/context/allinterface/ISession";
import { IFnCreateForensiclog } from "../allinterface/IFnCreateForensiclog";

function splitForensicPayload(payload: any) {
    const MAX_LENGTH = 1020;
    const logs = payload?._ForensicLog;

    if (!Array.isArray(logs) || logs.length === 0) {
        return payload;
    }

    const originalLog = logs[0];
    const logString = originalLog?.LogString;

    if (!logString || logString.length <= MAX_LENGTH) {
        return payload;
    }

    const newLogs = [];
    let start = 0;

    while (start < logString.length) {
        let chunk = logString.substring(start, start + MAX_LENGTH);
        if (start + MAX_LENGTH < logString.length) {
            chunk += "...";
        }
        newLogs.push({
            ...originalLog,
            LogString: chunk,
        });
        start += MAX_LENGTH;
    }

    return {
        ...payload,
        _ForensicLog: newLogs,
    };
}

/* Remote EM write removed with interceptors — logs locally only. */
const callAddUpdateAPI = (payload: Record<string, any>, _statusBarContext: IStatusBar) => {
    const data = splitForensicPayload(payload);
    console.warn("[sample] forensic log API disabled", data);
    return Promise.resolve(null);
};

const getSessionValue = (
    sessionList: ISession[],
    variableContext: string,
    variableName: string
): string => {
    const sessionValueByContext = FnGetSessionVariableFromStorage(
        variableContext,
        variableName,
        sessionList
    );
    const sessionValue =
        sessionValueByContext?.[0]?.SessionValue ||
        sessionList.find(
            (item) => item.VariableName?.toLowerCase() === variableName.toLowerCase()
        )?.SessionValue;

    return sessionValue || "";
};

const FnCreateForensiclog = (props: IFnCreateForensiclog) => {
    try {
        const siteName =
            props.site ||
            getSessionValue(props.sessionContext.SessionList, "Location", "SiteName");
        const tenantName =
            props.tenant ||
            getSessionValue(props.sessionContext.SessionList, "Filter", "TenantName");
        const userName =
            props.userName ||
            getSessionValue(
                props.sessionContext.SessionList,
                "RequestedBy",
                "LoginShortName"
            );
        if (!siteName || !userName) {
            console.error(`Missing site and user session data`);
        }
        let msgTemplate = "";
        if (props.GroupName && props.SubGroupName && props.RefTableItems.length) {
            const filteredItems = props.RefTableItems.find(
                (item: any) =>
                    item.GroupName === props.GroupName &&
                    item.SubGroupName === props.SubGroupName &&
                    item.Name === props.LogName
            );
            if (filteredItems) {
                msgTemplate = filteredItems.RefValue;
            } else {
                console.error(
                    `No message template found for ${props.GroupName} and ${props.SubGroupName}`
                );
            }
        }
        const actionObject = props.actionObject
            ? { ...props.actionObject, UserName: userName }
            : { UserName: userName };
        const message = props.LogString
            ? props.LogString
            : msgTemplate
                ? getMessgeTempleteForForensicAndReplaceVariables(msgTemplate, actionObject)
                : "";
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
                TenantName: tenantName,
            };
            return callAddUpdateAPI({ _ForensicLog: [payload] }, props.statusBarContext);
        }
        console.error("Message not found.");
        return;
    } catch (error) {
        console.error("Error in FnCreateForensiclog:", error);
        throw error;
    }
};

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
        const keys = Array.from(
            content.matchAll(/<([^>]+)>|\$\{([^}]+)\}/g),
            (match) => match[1] || match[2]
        );

        if (!keys.length || keys.some((key) => !hasValue(key))) {
            return "";
        }

        return content
            .replace(/<([^>]+)>/g, replaceVariable)
            .replace(/\$\{([^}]+)\}/g, replaceVariable);
    };

    return msgTemplate
        .replace(/\[([^\[\]]+)\]/g, replaceOptionalSection)
        .replace(/<([^>]+)>/g, replaceVariable)
        .replace(/\$\{([^}]+)\}/g, replaceVariable);
};

export { getMessgeTempleteForForensicAndReplaceVariables, FnCreateForensiclog };
