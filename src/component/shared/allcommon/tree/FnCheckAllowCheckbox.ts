
import { ITreeNode } from "../../allinterface/tree/ITreeControl";

//This function return whether checkbox on node allowed or not
const FnCheckAllowCheckbox = (treeNode: ITreeNode, featureId: string, instanceName?: string) => {
    try {

        const showCheckbox = treeNode.NodeType === "Site" || treeNode.NodeType === "Room"
            || treeNode.NodeType === "Floor" || treeNode.NodeType === "Location"
            || ((treeNode.NodeType === "Device" || treeNode.NodeType === "MountedDevice"))
            || treeNode.NodeType === "FrontView"
            || treeNode.NodeType === "Rack"
            || treeNode.NodeType === "RearView"
            || treeNode.NodeType?.toLowerCase() === "slot"
            || treeNode.NodeType?.toLowerCase() === "ru"
            || treeNode.NodeType?.toLowerCase() === "inoutplug"
            || treeNode.NodeType?.toLowerCase() === "port"
            || treeNode.NodeType === "EntityVsTable" ? false : true;

        return showCheckbox;
    } catch (error) {
        console.error(
            "Error in function(FnCheckAllowCheckbox): ",
            error
        );
        return false;
    }
}
export { FnCheckAllowCheckbox }