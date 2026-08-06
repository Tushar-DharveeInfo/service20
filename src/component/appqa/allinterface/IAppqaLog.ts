interface IAppqaLog {
    uniqueName: string;
    featureId: string;
    headerText?: string;
    handleShowUserMessage?: (messageText: string) => void;
}

export type { IAppqaLog };
