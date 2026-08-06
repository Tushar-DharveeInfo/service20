import { Check } from '@n20a/libicon'
import { FnGetCssVariable } from '../../../appcontainer/allcommon/FnGetCssVariable'
import { IActionImageForSubMenu } from '../../allinterface/basic/IActionImageList'
import { ISelectedNodeInfo, ITreeNode } from '../../allinterface/tree/ITreeControl'
import { IFeatureTree } from '../../allinterface/tree/ITreeForFlatDataContainer'
import { Image } from '../../basic/image/Image'

/**
 * Renders tree node title text and optional verified check icon.
 * Extra icons can be added later when needed.
 * Unused params kept for call-site compatibility.
 */
const TreeNodeTitle = (
    treeNode: ITreeNode,
    _treeDataProps?: IFeatureTree,
    _featureId?: string,
    _showKebabIcon?: boolean,
    _showCopyIcon?: boolean,
    _selectedNodeExplorer?: ISelectedNodeInfo,
    _handleKebabMenuSelect?: (selectedItem: IActionImageForSubMenu) => void
) => {
    const titleText = treeNode.Name ?? ''
    const tooltip = treeNode.Description ?? ''

    const renderCheckIcon = () => {
        if (!treeNode.IsAuthorized && !treeNode.verified) {
            return null
        }
        return (
            <span className="nz-tree-node-auth-icon" style={{ marginLeft: 6 }}>
                <Image
                    source={
                        <Check
                            size={FnGetCssVariable('--image-size-1')}
                            fill="none"
                            strokeWidth={1}
                        />
                    }
                    uniqueName={`${treeNode.key}-icheck`}
                    w={'var(--image-size-2)'}
                    tooltip="Verified"
                    type="svg"
                />
            </span>
        )
    }

    return (
        <span
            key={`node-title-${treeNode.key}`}
            rel="tooltip"
            title={tooltip}
            className="nz-tree-node-title"
            id={treeNode.EntID || treeNode.key}
        >
            <span className="nz-tree-node-content">
                <span key={`node-title-name-${treeNode.key}`}>
                    {titleText}
                </span>
                {renderCheckIcon()}
            </span>
        </span>
    )
}

export { TreeNodeTitle }
