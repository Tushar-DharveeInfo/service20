import type { FC } from "react";

/** Minimal stub for @n20a/libbox3d so ViewContainer / ThreeDView can compile without the full package. */
export type ParentJSON = Record<string, unknown>;

export type DeviceSvg3dProps = {
	boxJson?: ParentJSON;
	dataProp?: string;
	initialAngle?: number;
	fnSelectDcExplorer?: (entId: string) => void;
};

export const DeviceSvg3d: FC<DeviceSvg3dProps> = () => null;
