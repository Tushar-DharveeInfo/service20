import type { ITreeNode } from "../allinterface/tree/ITreeControl";
import type { ISession } from "../context/allinterface/ISession";

type AIContainerProps = {
	uniqueName: string;
	featureId: string;
	selectedNode?: ITreeNode;
	sessionVars?: ISession[];
	selectedAllProperties?: object;
};

/** Stub AI panel — full AI stack not ported to service20. */
const AIContainer = (_props: AIContainerProps) => null;

export { AIContainer };
