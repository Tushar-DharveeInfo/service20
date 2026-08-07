import React from "react";
import { IImage } from "../basic/IImage";

interface IDevicePreview {
    uniqueName: string;
    image: IImage;
    label: string;
    className?: string;
    /** When true, zoom/pan is disabled (matches nz20 naming). */
    allowZoom?: boolean;
    handleMouse?: (event: React.MouseEvent, actionCode?: string) => void;
}

export type { IDevicePreview };
