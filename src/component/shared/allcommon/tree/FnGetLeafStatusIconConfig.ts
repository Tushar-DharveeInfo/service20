import type { ComponentType } from "react";
import {
    Accepted_24x24,
    Received_24x24,
    Released_24x24,
} from "../../icons/TicketStatusIcons";

type ILeafStatusIconConfig = {
    Icon: ComponentType<{ size?: number | string; fill?: string; strokeWidth?: number }>;
    tooltip: string;
};

const LEAF_STATUS_ICON_MAP: Record<string, ILeafStatusIconConfig> = {
    Released: { Icon: Released_24x24, tooltip: "Released" },
    Accepted: { Icon: Accepted_24x24, tooltip: "Accepted" },
    Received: { Icon: Received_24x24, tooltip: "Received" },
};

const FnGetLeafStatus = (treeNode: {
    isLeaf?: boolean;
    Status?: string;
    NodeState?: string | null;
    ticketRecord?: { Status?: string };
}): string | undefined => {
    if (!treeNode.isLeaf) return undefined;

    const status =
        treeNode.Status
        ?? treeNode.ticketRecord?.Status
        ?? treeNode.NodeState
        ?? undefined;

    return typeof status === "string" && status.trim() ? status.trim() : undefined;
};

const FnGetLeafStatusIconConfig = (
    treeNode: Parameters<typeof FnGetLeafStatus>[0]
): ILeafStatusIconConfig | null => {
    const status = FnGetLeafStatus(treeNode);
    if (!status) return null;
    return LEAF_STATUS_ICON_MAP[status] ?? null;
};

export { FnGetLeafStatus, FnGetLeafStatusIconConfig, LEAF_STATUS_ICON_MAP };
export type { ILeafStatusIconConfig };
