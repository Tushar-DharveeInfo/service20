import type { ITreeNode } from "../allinterface/tree/ITreeControl";
import type { TReportLayoutJson } from "../../appqa/allinterface/IGeneratePdf";

type GeneratePdfProps = {
	uniqueName: string;
	isOpen: boolean;
	reportJson?: TReportLayoutJson | null;
	title?: string;
	selectedNode?: ITreeNode;
	onClose: () => void;
};

/** Stub PDF dialog — full generatepdf stack not ported to service20. */
const GeneratePdf = (_props: GeneratePdfProps) => null;

export { GeneratePdf };
