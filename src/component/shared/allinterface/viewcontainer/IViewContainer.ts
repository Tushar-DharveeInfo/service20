import type { MouseEvent } from "react";
import { IView } from "../deviceview/IView";
import { IImage } from "../basic/IImage";

interface IViewImageItem {
    uniqueName: string;
    label: string;
    tabName: string;
    image: IImage;
    className?: string;
}

interface IViewContainer {
    uniqueName: string;
    entID: string;
    views: IView[];
    viewLabel?: string;
    title?: string;
    selectedTabName?: string;
    disableZoom?: boolean;
    isEncrypted?: boolean;
    handleMouse?: (event: MouseEvent | null, actionCode?: string) => void;
}

export type { IViewContainer, IViewImageItem }
