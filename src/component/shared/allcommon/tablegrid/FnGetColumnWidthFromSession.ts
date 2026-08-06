import { DATAGRID } from "../../interceptors/EndPoints";
import { axiosInterceptor } from "../../interceptors/Interceptor";
import { FnParseJsonSafely } from "../../../appcontainer/allcommon/FnParseJsonSafely";
import { FnGetSessionStorageItem } from "../basic/FnGetSessionStorageItem";
import { IStatusBar } from "../../context/allinterface/IStatusBar";

const FnGetColumnWidthFromSession = async (
    gridName: string,
    columnName: string = "",
    statusBarContext: IStatusBar
) => {
    try {
        if (!gridName || typeof gridName !== "string") return null;

        let sessionStorage = FnGetSessionStorageItem("col_pane_width_json");
        let gridSettings: any = null;

        // helper to wrap axiosInterceptor in Promise
        // const fetchGridSettings = async () => {
        //     try {
        //         return await new Promise((resolve) => {
        //             axiosInterceptor(
        //                 {
        //                     url: DATAGRID.GetDatagridJsonColwidtharray,
        //                     data: { dataGridNames: gridName },
        //                     callSilently: true,
        //                     setFetchData: (resp: unknown) => {
        //                         resolve(resp);
        //                     }
        //                 },
        //                 statusBarContext
        //             );
        //         });
        //     } catch (err) {
        //         console.error("fetchGridSettings error:", err);
        //         return null;
        //     }
        // };

        // if (!sessionStorage?.length) {
        //     gridSettings = await fetchGridSettings();
        // } else {
        //     let settings: any = [];

        //     try {
        //         settings = FnParseJsonSafely(sessionStorage);
        //     } catch (e) {
        //         console.error("Invalid sessionStorage JSON");
        //         settings = [];
        //     }

        //     gridSettings = Array.isArray(settings)
        //         ? settings.filter((ele: any) => ele.dataGridName == gridName)
        //         : [];

        //     if (!gridSettings?.length) {
        //         gridSettings = await fetchGridSettings();
        //     }
        // }

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