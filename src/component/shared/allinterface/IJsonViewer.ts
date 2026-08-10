interface IJsonViewer {
    uniqueName: string;
    jsonData: { [key: string]: any };
    showAsDiv?: boolean;
    width?: string;
    height?: string;
}

export type { IJsonViewer }