import { ISession } from "../shared/context/allinterface/ISession";


interface IDeploymentVar {
    [key: string]: string | number | boolean | null;
}

interface INzApp {
    uniqueName: string;
    sessionId: string;
    sessionVariables: ISession[];
    deploymentVars: IDeploymentVar[];
    apiBaseUrl: string;
    isNewSession: boolean
    onSuccess: () => void;
    onError: (error: string) => void;
}

export type { INzApp, IDeploymentVar }