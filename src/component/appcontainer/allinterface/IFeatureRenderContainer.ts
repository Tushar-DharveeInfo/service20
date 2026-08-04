
import { IFeatureContainer } from "./IFeatureContainer";

interface IFeatureRenderContainer {
    allowFeatureToRender: boolean;
    featureContainerProps: IFeatureContainer;
    handleShowUserMessage: (messageText: string, container?: HTMLDivElement) => void;
}

export type { IFeatureRenderContainer }
