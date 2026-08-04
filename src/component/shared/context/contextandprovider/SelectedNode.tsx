
import { useState, createContext, useMemo, useCallback } from "react";
import { IAppContextWrapper } from "../allinterface/IAppContextWrapper";
import { ITreeNode } from "../../allinterface/entity/ITreeNode";
import { INodeToRefresh, ISearchParams, ISelectedNode, ISelectedNodeProperty } from "../allinterface/ISelectedNode";

const SelectedNodeContext = createContext<ISelectedNode | undefined>(undefined);

function SelectedNodeProvider({ children }: IAppContextWrapper) {
    const [selectedNode, setSelectedNode] = useState<ITreeNode>();
    const [checkedNode, setCheckedNode] = useState<ITreeNode>();
    const [selectedNodeProperty, setSelectedNodeProperty] = useState<ISelectedNodeProperty>();
    const [selectedNodeAllProperties, setSelectedNodeAllProperties] = useState<{
        [key: string]: string | number | boolean | undefined;
    }>();
    const [selectedNodeExplorer, setSelectedNodeExplorer] = useState<ITreeNode>();
    const [searchParaToSelect, setSearchParaToSelect] = useState<ISearchParams>();
    const [dcNodeToRefresh, setDcNodeToRefresh] = useState<INodeToRefresh>();

    const FnAvailableNodeVariables = useCallback(() => {
        return selectedNodeAllProperties;
    }, [selectedNodeAllProperties]);

    const contextValue = useMemo(() => ({
        selectedNode,
        checkedNode,
        selectedNodeProperty,
        selectedNodeAllProperties,
        searchParaToSelect,
        selectedNodeExplorer,
        dcNodeToRefresh,
        setSelectedNode,
        setSelectedNodeProperty,
        setSelectedNodeAllProperties,
        setSelectedNodeExplorer,
        setSearchParaToSelect,
        setCheckedNode,
        FnAvailableNodeVariables,
        setDcNodeToRefresh
    }), [
        selectedNode,
        checkedNode,
        selectedNodeProperty,
        selectedNodeAllProperties,
        searchParaToSelect,
        selectedNodeExplorer,
        dcNodeToRefresh,
        FnAvailableNodeVariables
    ]);

    return (
        <SelectedNodeContext.Provider value={contextValue}>
            {children}
        </SelectedNodeContext.Provider>
    );
}

export { SelectedNodeProvider, SelectedNodeContext };
