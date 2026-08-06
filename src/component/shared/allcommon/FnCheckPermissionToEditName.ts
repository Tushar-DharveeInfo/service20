
interface IFeaturePermission {
    AppQAName: string;
    AppQAMenuName: string;
    AppQAFeatureName: string;
}


const editableFeaturePermissions: string[] = [
    "Configure Device",
    "Move Add Change",
    "Inventory Management",
    "Inventory Configuration",
    "Edit Floor Layout"
]

const FnCheckPermissionToEditName = (
    session: IFeaturePermission | string,
    isFeature?: boolean
): boolean => {
    if (isFeature && typeof session === "string") {
        return editableFeaturePermissions.includes(session)
    }
    else {
        return false
    }
};

export { FnCheckPermissionToEditName };
export type { IFeaturePermission }