
import { FEnums } from "../../../constants/Feature"

const ExcludeFeaturesFromFilterNodes: string[] = [
  
]

const GoogleMapTreeRootNode = {
    RootEntID: "320da511-9b4d-4f0c-b171-cbef89d57971",
    RootName: "Tenants by Site",
    RootDescription: "DataCenter sites",
    RootNodeType: "AllDataCenters",
    RootHasChildren: 1,
}
const GoogleMapTenantRootNode = {
    RootEntID: "320da511-9b4d-4f0c-b171-cbef89d57971",
    RootName: "Sites by Tenant",
    RootDescription: "Tenants",
    RootNodeType: "AllDataCenters",
    RootHasChildren: 1,
}
const GoogleMapAllSiteRootNode = {
    RootEntID: "320da511-9b4d-4f0c-b171-cbef89d57971",
    RootName: "All Sites",
    RootDescription: "All Sites",
    RootNodeType: "AllDataCenters",
    RootHasChildren: 1,
}

// Hierarchy definition for FeatureIds
const FeatureHierarchies: Record<string, string[]> = {
  
}

// Explicit featureId → minimum expand NodeType/treetype when session lacks location detail.
// Add entries here per feature; inventory and generic DC features are intentionally omitted.
const FeatureMinimumExpandNodeTypes: Record<string, string> = {
  
};

const ReuseDataForFeatures: string[] = [
 
];

const NormalDCExplorerFeatures: string[] = [

]

const FeaturesThatNeedToUpdateInSession = [
 
];

export { ExcludeFeaturesFromFilterNodes, GoogleMapTreeRootNode, GoogleMapAllSiteRootNode, FeaturesThatNeedToUpdateInSession, GoogleMapTenantRootNode, FeatureHierarchies, FeatureMinimumExpandNodeTypes, ReuseDataForFeatures, NormalDCExplorerFeatures }