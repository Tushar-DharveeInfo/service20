import { ITreeNode } from "../../allinterface/entity/ITreeNode";

/** Returns immediate parent entity node from DOM node-info attribute. */
const FnGetImmediateParentTreeInfoUsingDiv = (info: ITreeNode) => {
    if (info.parentEntID) {
        const nodeDiv: HTMLElement | null = document.getElementById(info.parentEntID);
        if (nodeDiv) {
            const attr = nodeDiv.getAttribute("node-info");
            if (attr) {
                return JSON.parse(attr);
            }
            return null;
        }
        return null;
    }
    return null;
};

export { FnGetImmediateParentTreeInfoUsingDiv };
