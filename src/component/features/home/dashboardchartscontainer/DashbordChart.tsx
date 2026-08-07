import type { ITreeNode } from "../../../shared/allinterface/tree/ITreeControl";

type DashboardChartProps = {
	uniqueName: string;
	featureId: string;
	outputFormat: "data" | "jsx" | "png" | "svg";
	hideHeader?: boolean;
	displayPerRow?: number;
	title?: string;
	isDashboard?: boolean;
	selectedNode?: ITreeNode;
	parentClassName?: string;
	handleFinishApiCall?: () => void;
};

/** Stub chart host — dashboard charts stack not ported to service20. */
const DashboardChart = (_props: DashboardChartProps) => null;

export { DashboardChart };
