
interface IMyActivities {
    uniqueName: string;//uniqueName for the control and required
    featureId: string;// feature id
    headerText?: string;// header text coming from the selected menu item
    allowSort?: boolean;// allow grid column sort, defaults to true
    handleShowUserMessage?: (messageText: string) => void;
}

export type { IMyActivities }
