
import { useEffect, useMemo, useRef, useState } from 'react'
import { useMainAppContext } from '../context/hooks/MainAppHooks'
import { useCommonVariableContext } from '../context/hooks/CommonVariableHooks'
import { useSessionContext } from '../context/hooks/SessionHooks'
import { useStatusBarContext } from '../context/hooks/StatusBarHooks'
import '../allcss/sidebar/SidebarContainer.css'
import { SidebarEnum } from '../../constants/Feature'
import { DropableControlElementEnums } from '../../appcontainer/alldefaultprops/Enums'
import { ITreeNode } from '../allinterface/tree/ITreeControl'
import { IControl } from '../allinterface/settingsform/ISettingsLibForm'
import { IErrorData } from '../allinterface/IApiResponse'
import { FnMapTableToFormControl } from '../allcommon/settingsform/FnMapTableToFormControl'
import { ISidebarContent } from '../allinterface/sidebar/ISidebarContent'
// import { DeviceModel } from './devicemodel/DeviceModel'
import { ForensicLog } from './forensiclog/ForensicLog'
// import { DiagnosticLogContainer } from './diagnosticlogcontainer/DiagnosticLogContainer'
import { FqaNotes } from './notes/FqaNotes'
import { Key } from 'rc-tree/lib/interface'
import { PropertyFormContainer } from './propertyformcontainer/PropertyFormContainer'
import { useHelpTipContext } from '../context/hooks/HelptipHooks'
// import { Assign } from './assign/Assign'
import { AlertLog } from './alertlog/AlertLog'
import { buildPropertyFormDataFromSelectedNode } from '../../../sampledata/sidebar/PropertySampleData'


const SidebarContent = (sidebarProps: ISidebarContent) => {
    const [Label, setLabel] = useState<string>("");
    const [selectedNode, setSelectedNode] = useState<ITreeNode>();
    const [formControls, setFormControls] = useState<IControl[]>();
    const [actionlog, setActionlog] = useState<IErrorData[]>();
    const [auditFormKey, setAuditFormKey] = useState(() => `audit-form-0`);
    const [isReadOnly, setIsReadOnly] = useState<boolean>(false);

    const mainAppContext = useMainAppContext();
    const commonVariableContext = useCommonVariableContext();
    const statusBarContext = useStatusBarContext();
    const sessionContext = useSessionContext();
    const helpTipsContext = useHelpTipContext();

    const lastSelectedNodeKeyRef = useRef<Key>(undefined);


    // Initialize form controls and entity information based on selected sidebar action.
    useEffect(() => {
        if (sidebarProps.Label) {
            setLabel(sidebarProps.Label)
        }

    }, [sidebarProps.Label, sidebarProps.featureId, helpTipsContext.helpTipRecords, mainAppContext.emRecords])

    // Update selected node state and determine readonly mode when node selection changes.
    useEffect(() => {
        if (sidebarProps.selectedNode) {
            if (lastSelectedNodeKeyRef.current !== sidebarProps.selectedNode.key) {
                setActionlog([]);
            }
            const nodeType = sidebarProps.selectedNode.NodeType?.toLowerCase();
            if (nodeType && ["site", "room", "floor", "inventory", "store", "bin"].includes(nodeType)) {
                setIsReadOnly(true);
            }
            else if (sidebarProps.selectedNode.NodeType?.toLowerCase() === "businessservices" || sidebarProps.selectedNode.ParentNodeType?.toLowerCase()?.includes("in-use")) {
                setIsReadOnly(true);
            }
            else {
                setIsReadOnly(false)
            }
            setSelectedNode(sidebarProps.selectedNode)
            lastSelectedNodeKeyRef.current = sidebarProps.selectedNode.key;
        }
    }, [sidebarProps.selectedNode]);



    // Populate audit form fields based on the currently dropped hierarchy nodes.
    useEffect(() => {
        if (commonVariableContext.dragNodeDetails.length) {
            const droppedNodes = commonVariableContext.dragNodeDetails;
            setFormControls(prevControls => {
                if (!prevControls) return prevControls;

                // detect what was dropped
                const hasFloor = droppedNodes.some(
                    (n: any) => n.NodeType?.toLowerCase() === "floor"
                );

                const hasLocation = droppedNodes.some(
                    (n: any) => n.NodeType?.toLowerCase() === "location"
                );

                return prevControls.map(control => {
                    let updatedValue = control.Value;

                    //  Clear dependent fields first
                    if (hasFloor) {
                        if (
                            control._AP === DropableControlElementEnums.DeviceName ||
                            control._AP === DropableControlElementEnums.LocationName
                        ) {
                            updatedValue = "";
                        }
                    }

                    if (hasLocation) {
                        if (control._AP === DropableControlElementEnums.DeviceName) {
                            updatedValue = "";
                        }
                    }

                    //  Apply dropped values
                    droppedNodes.forEach((item: any) => {
                        const nodeType = item.NodeType?.toLowerCase();
                        const type = item.Type?.toLowerCase();

                        if (nodeType === "site" && control._AP === DropableControlElementEnums.SiteName) {
                            updatedValue = item.Name;
                        }
                        else if (nodeType === "room" && control._AP === DropableControlElementEnums.RoomName) {
                            updatedValue = item.Name;
                        }
                        else if (nodeType === "floor" && control._AP === DropableControlElementEnums.FloorName) {
                            updatedValue = item.Name;
                        }
                        else if (nodeType === "location" && control._AP === DropableControlElementEnums.LocationName) {
                            updatedValue = item.Name;
                        }
                        else if (type === "floordevice" && control._AP === DropableControlElementEnums.DeviceName) {
                            updatedValue = item.Name;
                        }
                    });

                    return {
                        ...control,
                        Value: updatedValue
                    };
                });
            });

            setAuditFormKey(`audit-form-${selectedNode?.key}`);
        }
    }, [commonVariableContext.dragNodeDetails]);

    // Append action log entries and location details whenever new log data arrives.
    useEffect(() => {
        const newData = statusBarContext.actionLogData;
        if (!newData?.length) return;

        const existingLog: IErrorData[] = actionlog ?? [];



        const locationData = sessionContext.FnGetLocationData(isInventory);

        // Find max id in O(n)
        let lastId = 0;
        for (const item of existingLog) {
            if (item.id != null && item.id > lastId) lastId = item.id;
        }

        // Sort incoming once (desc)
        const incoming = newData.slice().sort((a, b) => (b.id ?? 0) - (a.id ?? 0));

        const result: IErrorData[] = [];

        //  ADD location row (use latest incoming row as base)
        if (locationData && incoming.length > 0) {
            const base = incoming[0];

            result.push({
                ...base,
                errString:
                    typeof locationData === "string"
                        ? locationData
                        : JSON.stringify(locationData),
                id: ++lastId
            });
        }

        // Add incoming rows
        for (const item of incoming) {
            result.push({
                ...item,
                id: ++lastId
            });
        }

        // Append existing log
        for (const item of existingLog) {
            result.push(item);
        }

        setActionlog(result);
    }, [statusBarContext.actionLogData, sidebarProps.featureId]);



    // SAMPLE DATA: build EditTextControl property form from selected-node key/value record.
    const propertyFormPackage = useMemo(() => {
        if (!selectedNode) {
            return undefined;
        }
        return buildPropertyFormDataFromSelectedNode(selectedNode);
    }, [
        selectedNode?.key,
        selectedNode?.NodeEntID,
        selectedNode?.EntID,
        selectedNode?.Name,
        selectedNode?.Description,
        selectedNode?.NodeEntityname,
        selectedNode?.NodeType,
        selectedNode?.Type,
        selectedNode?.bname,
        selectedNode?.bid,
        selectedNode?.cid,
        selectedNode?.status,
        selectedNode?.verified,
        selectedNode?.salesExec,
        selectedNode?.country,
        selectedNode?.state,
        selectedNode?.daysNoticePeriod,
        selectedNode?.mmFinYear,
        selectedNode?.relatedBids,
        selectedNode?.contact,
        selectedNode?.email,
        selectedNode?.phone1,
        selectedNode?.phone2,
        selectedNode?.address_street,
        selectedNode?.address_city,
        selectedNode?.address_state,
        selectedNode?.address_zip,
        selectedNode?.address_country,
        selectedNode?.dateCreated,
        selectedNode?.dateUpdated,
    ]);

    const renderPropertyContainer = () => {
        const shouldShowPropertyContainer =
            selectedNode &&
            sidebarProps.isPropertyFound &&
            (Label === SidebarEnum.Property || Label === SidebarEnum.Profile) &&
            !selectedNode.NodeType?.toLowerCase().includes("helptip");

        if (!shouldShowPropertyContainer || !propertyFormPackage) {
            return null;
        }

        return (
            <div
                style={{
                    height: "100%",
                    width: "100%"
                }}
            >
                <PropertyFormContainer
                    uniqueName={`property-container-${sidebarProps.Label}`}
                    treeData={sidebarProps.treeData ?? undefined}
                    featureId={sidebarProps.featureId}
                    subTreeFeatureId={sidebarProps.subTreeFeatureId}
                    selectedNode={selectedNode}
                    isReadOnly={mainAppContext.siteProperties?.Locked || isReadOnly}
                    isAllowCustomAction={false}
                    selectedNodeMenu={sidebarProps.selectedNodeMenu}
                    entityTables={propertyFormPackage.entityTables}
                    kebabMenuData={propertyFormPackage.kebabMenuData}
                    handleValueChange={sidebarProps.apValueChange}
                    handleRefreshUpdatedRecord={(
                        newAddedId: string,
                        newAddedName: string,
                        action?: "save" | "back"
                    ) => {
                        if (
                            newAddedId &&
                            action === "save" &&
                            !sidebarProps.subTreeFeatureId
                        ) {
                            commonVariableContext.setReloadTreeFor({
                                featureId: sidebarProps.featureId,
                                entId: newAddedId
                            });
                        } else {
                            sidebarProps.handleReloadTree?.(
                                sidebarProps.featureId,
                                newAddedId
                            );
                        }
                    }}
                />
            </div>
        );
    };

    // Render sidebar content based on selected sidebar tab.
    const renderSidebarContent = () => {
        switch (Label) {
            case SidebarEnum.Alerts:
                return (
                    <AlertLog
                        uniqueName="appqa-alerts"
                        headerText='Alert Log'
                        selectedNode={selectedNode}
                    />
                );

            case SidebarEnum.Log:
                return (
                    <ForensicLog
                        featureId={sidebarProps.featureId}
                        isSetting={true}
                        loginType="node"
                        selectedNode={selectedNode}
                        uniqueName={`${Label}-forensic-log`}
                    />
                );

            case SidebarEnum.Notes:
                return (
                    <FqaNotes
                        uniqueName="Notes"
                        hideSearchControl={false}
                        selectedNode={sidebarProps.selectedNode}
                    />
                );
            default:
                return null;
        }
    };


    return (
        <div className="nz-sidebar-container">
            {renderPropertyContainer()}
            {renderSidebarContent()}
        </div>
    );

}

export { SidebarContent }
