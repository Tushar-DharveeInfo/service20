import type { ISession } from "../../../component/shared/context/allinterface/ISession";
import type { ITreeNode } from "../../../component/shared/allinterface/tree/ITreeControl";

/** Sample selected device node used by AppQA Report (static). */
const selectedNode = {
    key: "A56C94C1-E6DE-475D-9EAE-E192FF0816E0",
    NodeEntID: "A56C94C1-E6DE-475D-9EAE-E192FF0816E0",
    EntID: "A56C94C1-E6DE-475D-9EAE-E192FF0816E0",
    Name: "COLO-UPS-1",
    NodeEntityname: "__UPS",
    title: "COLO-UPS-1",
    children: [],
    treetype: "device",
    stepNo: 0,
    parentEntID: null,
    NodeState: null,
    Description: null,
    Type: "Device",
    icon: null,
    HasChildren: 0,
} as ITreeNode;

/** Minimal session values for report filters / PdfMaker session vars. */
const sessionList: ISession[] = [
    {
        VariableContext: "Session",
        VariableName: "SessionID",
        SessionValue: null,
    },
    {
        VariableContext: "Node",
        VariableName: "SelectedNodeID",
        SessionValue: selectedNode.NodeEntID,
    },
    {
        VariableContext: "Node",
        VariableName: "SelectedNodeName",
        SessionValue: selectedNode.Name,
    },
    {
        VariableContext: "Node",
        VariableName: "SelectedNodeEntity",
        SessionValue: selectedNode.NodeEntityname,
    },
    {
        VariableContext: "Feature",
        VariableName: "FeatureName",
        SessionValue: "Assets",
    },
    {
        VariableContext: "Feature",
        VariableName: "MenuName",
        SessionValue: "DC",
    },
    {
        VariableContext: "Location",
        VariableName: "SiteName",
        SessionValue: "Chicago",
    },
];

export { selectedNode, sessionList };
