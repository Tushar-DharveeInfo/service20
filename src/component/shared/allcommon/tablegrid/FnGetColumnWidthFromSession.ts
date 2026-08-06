import { FnGetSessionStorageItem } from "../basic/FnGetSessionStorageItem";
import { IStatusBar } from "../../context/allinterface/IStatusBar";

/* SAMPLE DATA: DATAGRID.GetDatagridJsonColwidtharray is disabled — read session storage only. */
const FnGetColumnWidthFromSession = async (
    gridName: string,
    columnName: string = "",
    _statusBarContext: IStatusBar
) => {
    try {
        if (!gridName || typeof gridName !== "string") return null;

        void FnGetSessionStorageItem("col_pane_width_json");
        const gridSettings: any = null;
        let colWidth: any = null;

        if (
            gridSettings &&
            Array.isArray(gridSettings) &&
            gridSettings.length > 0 &&
            gridSettings[0]?.colWidthJsonArray
        ) {
            let columns: any[] = [];

            try {
                columns = JSON.parse(gridSettings[0].colWidthJsonArray);
            } catch (e) {
                console.error("Invalid colWidthJsonArray JSON");
                columns = [];
            }

            if (Array.isArray(columns) && columns.length > 0) {
                if (columnName && columnName !== "") {
                    const nameColumn = columns.find(
                        (column: any) => column.colname === columnName
                    );
                    colWidth = nameColumn ? nameColumn.colwidth : null;
                } else {
                    colWidth = columns;
                }
            }
        }

        return colWidth;

    } catch (error) {
        console.error("FnGetColumnWidthFromSession error:", error);
        return null;
    }
};

export { FnGetColumnWidthFromSession }
