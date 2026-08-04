import { createContext, useMemo, useState, useCallback } from "react";
import { IAppContextWrapper } from "../allinterface/IAppContextWrapper";
import { IStatusBar } from "../allinterface/IStatusBar";
import { IErrorData } from "../../allinterface/IApiResponse";

const StatusBarContext = createContext<IStatusBar | undefined>(undefined);

function StatusBarProvider({ children }: IAppContextWrapper) {
    const [fetchDataError, setFetchDataError] = useState<IErrorData[] | null>(null);
    const [fetchError, setFetchError] = useState<string[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [loadingLabel, setLoadingLabel] = useState<string>();
    const [userActionData, setUserActionData] = useState<string>();
    const [testApiData, setTestApiData] = useState<string>();
    const [actionLogData, setActionLogData] = useState<IErrorData[]>();
    const [statusBarStringData, setStatusBarStringData] = useState<string[]>();

    const clearAllStatus = useCallback(() => {
        try {
            setUserActionData(undefined);
            setFetchDataError(null);
            setFetchError(null);
            setTestApiData(undefined);
            setIsLoading(false);
            setLoadingLabel(undefined);
            setActionLogData(undefined);
            setStatusBarStringData(undefined);
        } catch (error) {
            console.error("Error clearing status:", error);
        }
    }, []);

    const contextValue = useMemo(() => ({
        IsLoading: isLoading,
        LoadingLabel: loadingLabel,
        FetchError: fetchError,
        FetchDataError: fetchDataError,
        UserActionData: userActionData,
        TestApiData: testApiData,
        actionLogData,
        statusBarStringData,
        setIsLoading,
        setLoadingLabel,
        setFetchError,
        setFetchDataError,
        setUserActionData,
        setTestApiData,
        clearAllStatus,
        setActionLogData,
        setStatusBarStringData,
    }), [
        isLoading,
        fetchError,
        fetchDataError,
        userActionData,
        testApiData,
        actionLogData,
        statusBarStringData,
        loadingLabel,
        clearAllStatus
    ]);

    return (
        <StatusBarContext.Provider value={contextValue}>
            {children}
        </StatusBarContext.Provider>
    );
}

export {
    StatusBarContext,
    StatusBarProvider,
};
