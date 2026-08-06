
interface IFeaturePermission {
    AppQAName: string;
    AppQAMenuName: string;
    AppQAFeatureName: string;
}

const editableEntityPermissions: IFeaturePermission[] = []

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
        return editableEntityPermissions.some(permission =>
            permission.AppQAName === (session as IFeaturePermission).AppQAName &&
            (permission.AppQAMenuName === "" ||
                permission.AppQAMenuName === (session as IFeaturePermission).AppQAMenuName) &&
            (permission.AppQAFeatureName === "" ||
                permission.AppQAFeatureName === (session as IFeaturePermission).AppQAFeatureName)
        );
    }
};

export { FnCheckPermissionToEditName };
export type { IFeaturePermission }