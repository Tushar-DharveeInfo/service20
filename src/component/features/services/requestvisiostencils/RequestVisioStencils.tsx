import { useMemo } from 'react';
import { Splitter, SplitterPanel } from 'primereact/splitter';
import { ServicesEnums } from '../../../constants/Feature';
import { DeviceModel } from '../../../shared/devicemodel/DeviceModel';
import { Helptip } from '../../../shared/Help';
import { useHelpTipContext } from '../../../shared/context/hooks/HelptipHooks';
import { ITreeNode } from '../../../shared/allinterface/tree/ITreeControl';
import './RequestVisioStencils.css';

interface IRequestVisioStencils {
    uniqueName?: string;
    featureId?: string;
    helpTipText?: string;
    isShowHelptip?: boolean;
}

const DEFAULT_HELP_TIP =
    'Use the **Device Model** pane to browse and search the NetZoom device library for Visio stencil shapes. Request and Download panes will support stencil request workflows.';

/** Minimal explorer node so DeviceModel SearchTab can mount outside an inventory tree. */
const EMPTY_SELECTED_NODE: ITreeNode = {
    key: 'request-visio-stencils-root',
    NodeEntityname: null,
    NodeEntID: null,
    stepNo: 0,
    parentEntID: null,
    NodeState: null,
    Description: null,
    title: 'Request Visio Stencils',
    children: [],
    treetype: 'Feature',
    Name: 'Request Visio Stencils',
    Type: 'Feature',
    icon: null,
    HasChildren: 0,
};

const RequestVisioStencils = (props: IRequestVisioStencils = {}) => {
    const uniqueName = props.uniqueName ?? 'request-visio-stencils';
    const featureId = props.featureId ?? ServicesEnums.RequestVisioStencils;
    const showHelptip = props.isShowHelptip !== false;
    const helpTipsContext = useHelpTipContext();

    const helpTipText = useMemo(() => {
        if (props.helpTipText) {
            return props.helpTipText;
        }
        const tip = helpTipsContext.helpTipRecords?.find((item) =>
            item.featureid.startsWith(`${featureId}_`)
        );
        return tip?.tip ?? DEFAULT_HELP_TIP;
    }, [props.helpTipText, helpTipsContext.helpTipRecords, featureId]);

    return (
        <div className="nz-request-visio-stencils nz-wh-100 nz-d-flex-column" id={uniqueName}>
            {showHelptip && (
                <div className="nz-request-visio-helptip-div">
                    <Helptip
                        uniqueName={`${uniqueName}-helptip`}
                        mdString={helpTipText}
                    />
                </div>
            )}
            <div className="nz-request-visio-panes">
                <Splitter
                    tabIndex={-1}
                    className="nz-w-100 nz-h-100 nz-feature-container-splitter"
                    layout="horizontal"
                >
                    <SplitterPanel
                        tabIndex={-1}
                        size={40}
                        minSize={20}
                        className="nz-d-flex-column nz-pane-1 nz-request-visio-pane"
                    >
                        <DeviceModel
                            uniqueName={`${uniqueName}-device-model`}
                            featureId={featureId}
                            selectedNode={EMPTY_SELECTED_NODE}
                            treeData={null}
                            ShowOnlyLibraryRedio={true}
                            addToDownloadCart={(mfg, prodno, EQID) => {
                                alert(`mfg: ${mfg}\nprodno: ${prodno}\nEQID: ${EQID}`);
                            }}
                        />
                    </SplitterPanel>
                    <SplitterPanel
                        tabIndex={-1}
                        size={30}
                        minSize={15}
                        className="nz-d-flex-column nz-pane-2 nz-request-visio-pane"
                    >
                        <div className="nz-request-visio-empty-pane" />
                    </SplitterPanel>
                    <SplitterPanel
                        tabIndex={-1}
                        size={30}
                        minSize={15}
                        className="nz-d-flex-column nz-pane-3 nz-request-visio-pane"
                    >
                        <div className="nz-request-visio-empty-pane" />
                    </SplitterPanel>
                </Splitter>
            </div>
        </div>
    );
};

export { RequestVisioStencils };
export default RequestVisioStencils;
