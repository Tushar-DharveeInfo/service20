import React, { useEffect, useRef, useState } from 'react'
import { Key } from 'rc-tree/lib/interface'
import '../allcss/DCExplorerContainer.css'
import { formControlsBusinessFilter } from '../../../sampledata/formcontrol/formControlsBusinessFilter.ts'
import { sampleBusinesses } from '../../../sampledata/tree/BusinessesSampleData.ts'
import { sampleContacts } from '../../../sampledata/tree/ContactsSampleData.ts'
import {
  filterBusinessRecords,
  filterContactRecords,
  getAppliedFilterJson,
  hasActiveContactFilters,
  normalizeFilterFieldName,
} from '../allcommon/searchfilter/FnFilterBusinessContactRecords.ts'
import { FnAddSubNode } from '../allcommon/tree/FnAddSubNode.ts'
import { FnMapBusinessesToTreeNodes } from '../allcommon/tree/FnMapBusinessesToTreeNodes.ts'
import { FnMapContactsToTreeNodes } from '../allcommon/tree/FnMapContactsToTreeNodes.ts'
import { FnSearchKeywordInLocalTree } from '../allcommon/FnSearchKeywordInLocalTree.ts'
import { IDCFilterControlValues } from '../allinterface/searchfilter/IFilterFormContainer.ts'
import { IDcExplorerContainer } from '../allinterface/IDcExplorerContainer.ts'
import { IExpandedNodeInfo, ISelectedNodeInfo, ITreeNode } from '../allinterface/tree/ITreeControl.ts'
import { IFeatureTree, ITreeForFlatDataContainer } from '../allinterface/tree/ITreeForFlatDataContainer.ts'
import { FilterFormContainer } from '../searchfilter/filterformcontainer/FilterFormContainer.tsx'
import { SearchControl } from '../searchfilter/searchcontrol/SearchControl.tsx'
import { TreeControl } from '../tree/treecontrol/TreeControl.tsx'

function buildFeatureTreeProps(): IFeatureTree {
  return {
    hideKebabMenu: true,
    allowCheckbox: false,
    allowIcon: false,
    hideCopyIcon: true,
    reuseFromCache: false,
    instanceName: 'dc_explorer_tree',
    isAllowDrag: false,
    isAllowDrop: false,
    allowCheckStrictly: false,
    allowInternalDrag: false,
    multiRootNode: false,
    openAllNodes: false,
    allowCustomCheck: false,
    disableSelection: false,
  }
}

const DcExplorerContainer = (dcExplorerContainerProps: IDcExplorerContainer) => {
  const [featureTreeProps, setFeatureTreeProps] = useState<IFeatureTree | null>(null)
  const [treeContainerFlatDataProps, setTreeContainerFlatDataProps] = useState<ITreeForFlatDataContainer>()
  const [treeData, setTreeData] = useState<ITreeNode[]>()
  /** Cached business tree including any contacts loaded on expand. */
  const [originalTreeData, setOriginalTreeData] = useState<ITreeNode[]>([])
  const [defaultExpandedKeys, setDefaultExpandedKeys] = useState<Key[]>([])
  const [defaultSelectedKeys, setDefaultSelectedKeys] = useState<Key[]>([])
  const [defaultSelectedNodeInfo, setDefaultSelectedNodeInfo] = useState<ISelectedNodeInfo | null>(null)
  const [searchText, setSearchText] = useState<string | null>(null)
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [isShowFilterForm, setIsShowFilterForm] = useState(false)
  const [isFilterChange, setIsFilterChange] = useState(false)
  const [filterFormData, setFilterFormData] = useState<IDCFilterControlValues>({})
  const filterFormDataRef = useRef<IDCFilterControlValues>({})
  const isFilterChangeRef = useRef(false)

  const prevFeatureIdRef = useRef<string>(undefined)

  useEffect(() => {
    filterFormDataRef.current = filterFormData
  }, [filterFormData])

  useEffect(() => {
    isFilterChangeRef.current = isFilterChange
  }, [isFilterChange])

  const selectNode = (
    node: ITreeNode,
    expandedKeys: Key[],
    currentTree: ITreeNode[],
    event: ISelectedNodeInfo['event'] = 'auto-select'
  ) => {
    const info: ISelectedNodeInfo = {
      event,
      selected: true,
      node,
      selectedNodes: [node],
    }
    setDefaultSelectedKeys([node.key])
    setDefaultSelectedNodeInfo(info)
    dcExplorerContainerProps.handleNodeSelect?.([node.key], info, expandedKeys, currentTree)
  }

  const setBusinessTree = (nodes: ITreeNode[]) => {
    setTreeData(nodes)
    setOriginalTreeData(nodes)
    setDefaultExpandedKeys([])
    if (nodes.length > 0) {
      selectNode(nodes[0], [], nodes)
    } else {
      setDefaultSelectedKeys([])
      setDefaultSelectedNodeInfo(null)
    }
  }

  /** Filters sample businesses (and contact-gated businesses) then maps to tree nodes. */
  const applyBusinessTreeFromFilter = (
    form: IDCFilterControlValues,
    featureProps: IFeatureTree,
    featureId: string
  ) => {
    let businesses = filterBusinessRecords(sampleBusinesses, form)
    if (hasActiveContactFilters(form)) {
      const matchingBids = new Set(
        filterContactRecords(sampleContacts, form).map((contact) => contact.bid)
      )
      businesses = businesses.filter((business) => matchingBids.has(business.bid))
    }
    setBusinessTree(FnMapBusinessesToTreeNodes(businesses, featureProps, featureId))
  }

  // Reload business tree when featureId changes.
  useEffect(() => {
    if (!dcExplorerContainerProps.featureId) return
    if (prevFeatureIdRef.current === dcExplorerContainerProps.featureId) return
    prevFeatureIdRef.current = dcExplorerContainerProps.featureId

    const featureProps = buildFeatureTreeProps()
    setFeatureTreeProps(featureProps)
    setIsShowFilterForm(false)
    setIsFilterChange(false)
    setFilterFormData({})
    setTreeContainerFlatDataProps({
      uniqueName: `${dcExplorerContainerProps.uniqueName}-dce-flat`,
      flatAPIData: null,
      featureId: dcExplorerContainerProps.featureId,
      featureTreeProps: featureProps,
    })

    // TODO: replace sampleBusinesses with API response when available
    setBusinessTree(
      FnMapBusinessesToTreeNodes(sampleBusinesses, featureProps, dcExplorerContainerProps.featureId)
    )
  }, [dcExplorerContainerProps.featureId, dcExplorerContainerProps.uniqueName])

  const handleNodeExpand = async (expandedNodeKeys: Key[], info: IExpandedNodeInfo) => {
    if (!info?.expanded || !info.node || !treeContainerFlatDataProps || !featureTreeProps) return
    if (info.node.NodeType !== 'Business') {
      setDefaultExpandedKeys(expandedNodeKeys)
      return
    }

    // Reuse cached children when already loaded.
    if (info.node.children?.length) {
      setDefaultExpandedKeys(expandedNodeKeys)
      selectNode(info.node.children[0], expandedNodeKeys, treeData ?? [], 'select')
      return
    }

    // TODO: replace sampleContacts with API response when available
    const contactsForBusiness = filterContactRecords(
      sampleContacts,
      filterFormData,
      info.node.NodeEntID ?? info.node.key
    )
    const contactNodes = FnMapContactsToTreeNodes(
      contactsForBusiness,
      featureTreeProps,
      treeContainerFlatDataProps.featureId,
      info.node.NodeEntID
    )
    const updatedTreeData = await FnAddSubNode(
      treeData ?? [],
      info.node.key,
      contactNodes,
      featureTreeProps,
      treeContainerFlatDataProps.featureId,
      false,
      info.node.stepNo
    )
    const updatedOriginalData = await FnAddSubNode(
      originalTreeData,
      info.node.key,
      contactNodes,
      featureTreeProps,
      treeContainerFlatDataProps.featureId,
      true,
      info.node.stepNo
    )
    setTreeData(updatedTreeData)
    setOriginalTreeData(updatedOriginalData)
    setDefaultExpandedKeys(expandedNodeKeys)

    if (contactNodes.length > 0) {
      selectNode(contactNodes[0], expandedNodeKeys, updatedTreeData, 'select')
    }
  }

  const handleNodeSelect = (selectedKeys: Key[], info: ISelectedNodeInfo, expandedNodeKeys?: Key[]) => {
    setDefaultSelectedKeys(selectedKeys)
    setDefaultSelectedNodeInfo(info)
    dcExplorerContainerProps.handleNodeSelect?.(
      selectedKeys,
      info,
      expandedNodeKeys ?? defaultExpandedKeys,
      treeData
    )
  }

  const handleFilterActionClick = (
    event: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>,
    actionCode?: string
  ) => {
    if (!event) return
    if (actionCode === 'close') {
      setFilterFormData({})
      filterFormDataRef.current = {}
      isFilterChangeRef.current = false
      setIsFilterChange(false)
      setIsShowFilterForm(false)
      if (featureTreeProps && dcExplorerContainerProps.featureId) {
        applyBusinessTreeFromFilter({}, featureTreeProps, dcExplorerContainerProps.featureId)
      }
      return
    }
    handleFilterClick()
  }

  const handleFilterFormChange = (value: string | undefined, name: string) => {
    if (value === undefined) return
    const field = normalizeFilterFieldName(name)
    if (!field) return
    setFilterFormData((prev) => {
      const next = { ...prev, [field]: value }
      filterFormDataRef.current = next
      return next
    })
    isFilterChangeRef.current = true
    setIsFilterChange(true)
  }

  const handleFilterClick = () => {
    if (isShowFilterForm) {
      if (isFilterChangeRef.current && featureTreeProps && dcExplorerContainerProps.featureId) {
        const appliedFilterJson = getAppliedFilterJson(filterFormDataRef.current)
        setFilterFormData(appliedFilterJson)
        filterFormDataRef.current = appliedFilterJson
        applyBusinessTreeFromFilter(appliedFilterJson, featureTreeProps, dcExplorerContainerProps.featureId)
      }
      // Clear dirty after apply/close — yellow only while filter form has pending edits
      isFilterChangeRef.current = false
      setIsFilterChange(false)
      setIsShowFilterForm(false)
      return
    }
    setIsShowFilterForm(true)
  }

  const handleKeywordSearch = (value: string) => {
    if (!treeData) return
    const foundedNode = FnSearchKeywordInLocalTree(value, treeData, searchHistory)
    if (foundedNode?.foundNode) {
      const parentKeys = foundedNode.parentNodes?.map((node) => node.key) ?? []
      setDefaultExpandedKeys(parentKeys)
      selectNode(foundedNode.foundNode, parentKeys, treeData, 'found-select')
      setSearchHistory((prev) => [...prev, value])
    }
  }

  if (treeData === undefined) {
    return <div className="nz-wh-100 nz-d-flex-hv-left">Loading...</div>
  }

  const displayTreeData = treeData

  return (
    <div className="nz-dc-explorer-container">
      {!isShowFilterForm ? (
        <div className="nz-wh-100 nz-dce-search-tree-container">
          <div className="nz-dce-search-container">
            <SearchControl
              uniqueName={`${dcExplorerContainerProps.uniqueName}-search`}
              isShowFilterControl={!dcExplorerContainerProps.subTreeFeatureId}
              lensDirty={(searchText || '').length > 0}
              filterDirty={isFilterChange}
              searchInputValue={searchText || ''}
              hideSearchControl={false}
              hideRightMouseMenu={!!dcExplorerContainerProps.subTreeFeatureId}
              searchValueChange={(value: string) => {
                setSearchText(value)
                setSearchHistory([])
              }}
              handleFilterMouse={handleFilterClick}
              handleLensMouse={() => {
                if (searchText && searchText.length > 0) {
                  handleKeywordSearch(searchText)
                }
              }}
            />
          </div>
          <div className="nz-dce-tree-container">
            {featureTreeProps &&
              treeContainerFlatDataProps &&
              displayTreeData.length > 0 ? (
              <TreeControl
                uniqueName={treeContainerFlatDataProps.uniqueName}
                treeData={displayTreeData}
                featureId={treeContainerFlatDataProps.featureId}
                autoFocus={!dcExplorerContainerProps.subTreeFeatureId}
                defaultExpandedKeys={defaultExpandedKeys}
                defaultSelectedKeys={defaultSelectedKeys}
                defaultCheckedKeys={[]}
                defaultSelectedNodeInfo={defaultSelectedNodeInfo || undefined}
                allowCheckbox={false}
                allowIcon={false}
                allowInternalDrag={false}
                allowMultiple={false}
                className="nz-dce-tree-for-flat-data"
                handleNodeExpand={handleNodeExpand}
                handleNodeSelect={handleNodeSelect}
              />
            ) : null}
          </div>
        </div>
      ) : (
        <FilterFormContainer
          uniqueName={`${dcExplorerContainerProps.uniqueName}-filter-form`}
          allowHeader={true}
          controls={formControlsBusinessFilter}
          isFilterChange={isFilterChange}
          controlValues={filterFormData}
          headerText="Filter Business / Contact"
          handleActionImageClick={handleFilterActionClick}
          handleFilterFormChange={handleFilterFormChange}
        />
      )}
    </div>
  )
}

export { DcExplorerContainer }
