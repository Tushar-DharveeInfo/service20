/*
* SAMPLE DATA: Context folder removed — local fallbacks for sidebar sample app.
*/
import { sampleSessionList } from './SiderBar';
import type { ISession, ISessionContextProps } from '../../component/shared/context/allinterface/ISession';
import type { IStatusBar } from '../../component/shared/context/allinterface/IStatusBar';
import type { IMainApp } from '../../component/shared/context/allinterface/IMainApp';
import type { IApProfile } from '../../component/shared/context/allinterface/IApProfile';
import type { IAppqaSettingsVar } from '../../component/shared/context/allinterface/IAppqaSettingsVar';

const noop = (): void => { };
const noopAsync = async (): Promise<boolean> => true;
const noopSetState = <T,>(_value?: T | ((prev: T) => T)): void => { };

export const sampleStatusBarFallback: IStatusBar = {
    IsLoading: false,
    FetchError: null,
    FetchDataError: null,
    UserActionData: undefined,
    TestApiData: undefined,
    setFetchDataError: noopSetState,
    setFetchError: noopSetState,
    setIsLoading: noopSetState,
    setLoadingLabel: noopSetState,
    setTestApiData: noopSetState,
    setUserActionData: noopSetState,
    setActionLogData: noopSetState,
    setStatusBarStringData: noopSetState,
    clearAllStatus: noop,
};

let _sessionList: ISession[] = [...sampleSessionList];

export const sampleSessionContextFallback: ISessionContextProps = {
    get SessionList() {
        return _sessionList;
    },
    setSessionList: (list: ISession[]) => {
        _sessionList = [...list];
    },
    UpdateRowName: (row: ISession) => {
        _sessionList = _sessionList.map((thisRow) =>
            thisRow.VariableName === row.VariableName &&
                thisRow.VariableContext === row.VariableContext
                ? { ...thisRow, SessionValue: row.SessionValue }
                : thisRow
        );
    },
    FnAvailableSessionVariables: () => _sessionList,
    FnGetLocationData: (isInventory: boolean) => {
        const context = isInventory ? 'inventory' : 'location';
        return _sessionList
            .filter(
                (item) =>
                    item.VariableContext?.toLowerCase() === context &&
                    item.VariableName?.toLowerCase().endsWith('name')
            )
            .reduce((acc, item) => {
                if (item.VariableName) {
                    acc[item.VariableName] = item.SessionValue;
                }
                return acc;
            }, {} as Record<string, unknown>);
    },
};

export const setSampleSidebarWidth = (_width: number): void => { };

export const sampleMainAppFallback: IMainApp = {
    apRecords: [],
    setApRecords: noopSetState,
    featureRecords: [],
    setFeatureRecords: noopSetState,
    allFeatureRecords: [],
    setAllFeatureRecords: noopSetState,
    emRecords: [],
    setEmRecords: noopSetState,
    userProfileRecord: undefined,
    setUserProfileRecord: noopSetState,
    authSession: undefined,
    setAuthSession: noopSetState,
    impUserProfileRecord: undefined,
    setImpUserProfileRecord: noopSetState,
    apProfileRecords: [],
    setApProfileRecords: noopSetState,
    alertProfileRecords: [],
    setAlertProfileRecords: noopSetState,
    alertRecords: [],
    setAlertRecords: noopSetState,
    refTableRecords: [],
    setRefTableRecords: noopSetState,
    apiProfileRecords: [],
    setApiProfileRecords: noopSetState,
    deploymentVars: [],
    setDeploymentVars: noopSetState,
    floorLayoutRecord: {},
    setFloorLayoutRecord: noopSetState,
    isInternetAvailable: true,
    setIsInternetAvailable: noopSetState,
    siteProperties: { Locked: false, Managed: true } as IMainApp['siteProperties'],
    setSiteProperties: noopSetState,
    dciRecords: [],
    setDciRecords: noopSetState,
    autoExecuteWorkorder: false,
    setAutoExecuteWorkorder: noopSetState,
    selectedFeatureForHelp: undefined,
    setSelectedFeatureForHelp: noopSetState,
    fetchFeatures: noop,
    fetchApRecords: async () => noop(),
    fetchApProfileRecords: noop,
    fetchAlertProfileRecords: noop,
    checkIsInternetAvailable: noopAsync,
};

export const sampleApProfileFallback: IApProfile = {
    apProfileRecords: [],
    setApProfileRecords: noop,
    fetchApProfile: noop,
};

export const sampleAppqaSettingsFallback: IAppqaSettingsVar = {
    selectedProfileItem: null,
    setSelectedProfileItem: noopSetState,
    formControls: [],
    setFormControls: noopSetState,
    jsonStringForViewer: undefined,
    setJsonStringForViewer: noopSetState,
    isFormValid: undefined,
    setIsFormValid: noopSetState,
};

export const getMuForSite = (): string => 'USA';
export const getDiagnosticLevelData = (): string | undefined => undefined;
export const getDeploymentVars = (): Record<string, unknown>[] | null => null;

export const sampleSelectedNodeFallback = {
    setSelectedNode: noop,
    setCheckedNode: noop,
    setSelectedNodeProperty: (_selectedNodeProperty?: unknown) => noop(),
    setSelectedNodeAllProperties: noop,
    setSelectedNodeExplorer: noop,
    setSearchParaToSelect: noop,
    setDcNodeToRefresh: noop,
    FnAvailableNodeVariables: () => undefined,
};
