
interface IEula {
    uniqueName: string;//uniqueName for the control and required
    featureId: string;// feature id
    headerText?: string;// header text coming from the selected menu item
    scale?: number;// pdf render scale
    handleShowUserMessage?: (messageText: string) => void;
}

export type { IEula }
