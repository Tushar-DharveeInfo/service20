
import React, { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent } from "@mui/material";
import * as XLSX from "xlsx";
import { PdfMaker, updateLayoutWithSessionVars } from "@n20a/libreport";
import { useAgent } from "@n20a/libmcpclient";
import { useCommonVariableContext } from "../shared/context/hooks/CommonVariableHooks";
import { useChartProfileContext } from "../shared/context/hooks/ChartProfileHooks";
import { useStatusBarContext } from "../shared/context/hooks/StatusBarHooks";
import { useReportContext } from "../shared/context/hooks/ReportHooks";
import { useSessionContext } from "../shared/context/hooks/SessionHooks";
import { useInMemoryUrlContext } from "../shared/context/hooks/InMemoryUrlHooks";
import { useSelectedNodeContext } from "../shared/context/hooks/SelectedNodeHooks";
import { axiosInterceptor } from "../shared/interceptors/Interceptor";
import "./allcss/AppqaReport.css";
import "@n20a/libreport/style.css";
import { Close24x24, Report24x24, Save24x24 } from "@n20a/libicon";
import { ALERT, EM, FS, NODE } from "../shared/interceptors/EndPoints";
import { EntityNameEnums } from "../constants/AppqaEnums";
import { FnHandleAPIResponse } from "../shared/allcommon/basic/FnHandleAPIResponse";
import { FnGetCssVariable } from "../appcontainer/allcommon/FnGetCssVariable";
import { FnInMemoryUrlForAPI } from "../shared/allcommon/charts/FnInMemoryUrlForAPI";
import { FnInMemoryUrlToJson } from "../shared/allcommon/charts/FnJsonToInMemoryUrl";
import {
    FnActivateOptionForReport,
    FnCreateFiltersForReport,
} from "./allcommon/FnCreateFiltersForReport";
import { IAppqaReport } from "./allinterface/IAppqaReport";
import { IReportProfileItem } from "../shared/context/allinterface/IReport";
import { IMemoryUrlItem } from "../shared/context/allinterface/IInMemoryUrl";
import { ActionImage } from "../shared/basic/actionimage/ActionImage";
import { Label } from "../shared/basic/label/Label";
import { JsonViewer } from "../shared/jsonviewer/JsonViewer";
import { OptionsFilter } from "../shared/basic/optionsfilter/OptionsFilter";
import { YesNoFormContainer } from "../shared/basic/yesnoformcontainer/YesNoFormContainer";
import { OverlayTab } from "../shared/basic/overlaytab/OverlayTab";
import { FnParseJsonSafely } from "../appcontainer/allcommon/FnParseJsonSafely";
import { IOptionItem } from "../shared/allinterface/basic/IOptionsFilter";
import { CardLayout } from "../shared/cardlayout/CardLayout";
import { ICardLayoutField } from "../shared/allinterface/cardlayout/ICardLayout";
import { FnFormatDateWithAppFormat } from "../appcontainer/allcommon/FnFormatDateWithAppFormat";
import { useMainAppContext } from "../shared/context/hooks/MainAppHooks";
import {
    sampleApiProfiles,
    sampleReportDatatableResponses,
    sampleReportLayoutJson,
    sampleReportProfiles,
} from "../../sampledata/appqa/report/ReportSampleData";
import reportLayoutConfigJson from "../../sampledata/appqa/report/reportLayoutConfig.json";
import reportDatasetJson from "../../sampledata/appqa/report/reportDataset.json";
// Maps API report record into IReportProfileItem shape.

const mapToReportProfileItem = (
    data: Record<string, any>
): IReportProfileItem => {
    try {
        // Validate input
        if (!data || typeof data !== "object") {
            console.warn("Invalid input provided to mapToReportProfileItem:", data);
            return {
                _ReportProfile: "",
                Description: "",
                EntityNames: "",
            } as IReportProfileItem;
        }
        return {
            _ReportProfile: data.Name ?? "", // unique identifier
            Description: data.Description ?? "", // required field
            EntityNames: data.EntityNames ?? "", // required field
            ...Object.fromEntries(
                Object.entries(data).filter(
                    ([key]) =>
                        !["_ReportProfile", "Description", "EntityNames"].includes(key)
                )
            ),
        };
    } catch (error) {
        console.error("Error in mapToReportProfileItem:", error);
        // Fallback safe object (same structure)
        return {
            _ReportProfile: "",
            Description: "",
            EntityNames: "",
        } as IReportProfileItem;
    }
};

// Builds CardLayout fields for a single report card.
const buildReportCardFields = (
    report: IReportProfileItem
): ICardLayoutField[] => {
    console.log("report", report);
    const fields: ICardLayoutField[] = [
        {
            Name: "Report",
            Value: `${report._ReportProfile || "—"}`,
            Header: 1,
            Group: "header",
        },
    ];
    if (report.LastUpdated) {
        fields.push({
            Name: "Last Updated",
            Value: FnFormatDateWithAppFormat(report.LastUpdated, true),
            Header: 3,
            Row: "inline",
            Group: "header",
        });
    }
    if (report.Description) {
        fields.push({ Name: "Description", Value: report.Description });
    }
    if (report.TemplateFileName) {
        fields.push({ Name: "Template", Value: report.TemplateFileName });
    }
    return fields;
};

// Returns true when report Enable/Enabled flag is on.
const isReportEnabled = (report: IReportProfileItem): boolean => {
    const enableValue = report.Enable ?? report.Enabled;
    return (
        enableValue === true ||
        enableValue === 1 ||
        enableValue === "1" ||
        enableValue === "true"
    );
};

// Sort reports A–Z by report name.
const sortReportsAZ = (reports: IReportProfileItem[]): IReportProfileItem[] =>
    [...reports].sort((a, b) =>
        String(a._ReportProfile ?? "").localeCompare(String(b._ReportProfile ?? ""), undefined, {
            sensitivity: "base",
        })
    );

// Renders available report profiles with filter, preview, PDF, and Excel actions.
const AppqaReport = (appqaReportProps: IAppqaReport) => {
    const [reportData, setReportData] = useState<IReportProfileItem[]>([]);
    const [selectedReportId, setSelectedReportId] = useState<string>("");
    const [reportDataOriginal, setReportDataOriginal] = useState<IReportProfileItem[]>([]);
    const [filterValue, setFilterValue] = useState<IOptionItem[]>([]);
    const [reportHeader, setReportHeader] = useState<string>("Available Reports");
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [configJsonContent, setConfigJsonContent] = useState<any>();
    const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);
    const [confirmMessage, setConfirmMessage] = useState<string>("");
    const [diagnosticLevel, setDiagnosticLevel] = useState<number>(1);
    const [selectedFilter, setSelectedFilter] = useState<string>();
    const [isDataProcessed, setIsDataProcessed] = useState(false);
    const [isLoadingReports, setIsLoadingReports] = useState(true);

    const hasRequestedReports = useRef(false);
    const loadedFeatureId = useRef<string | undefined>(undefined);

    const statusBarContext = useStatusBarContext();
    const mainAppContext = useMainAppContext();
    const reportContext = useReportContext();
    const sessionContext = useSessionContext();
    const selectedNodeContext = useSelectedNodeContext();
    const commonVariableContext = useCommonVariableContext();
    const chartProfileContext = useChartProfileContext();
    const InMemoryUrlContext = useInMemoryUrlContext();

    const { sendPrompt } = useAgent();

    // Helper function to get session variables for JS evaluation
    const getSessionVars = (): Record<string, any> => {
        const sessionVars: Record<string, any> = {};
        if (sessionContext?.SessionList && Array.isArray(sessionContext.SessionList)) {
            sessionContext.SessionList.forEach((item: any) => {
                if (item.VariableName && item.SessionValue !== undefined) {
                    sessionVars[item.VariableName] = item.SessionValue;
                } else if (item.Key && item.Value !== undefined) {
                    sessionVars[item.Key] = item.Value;
                }
            });
        }
        return sessionVars;
    };

    /** Creates a memory URL (Blob URL) from array/object data. */
    const FnCreateMemoryUrl = (data: unknown): string => {
        const blob = new Blob([JSON.stringify(data, null, 2)], {
            type: "application/json",
        });
        return URL.createObjectURL(blob);
    };

    /**
     * Builds final report layout config:
     * 1) create in-memory URLs from dataset.data { id1: [], id2: [], ... }
     * 2) inject those URLs into reportLayoutConfig
     * 3) evaluate labels using getVars()
     * Returns updated reportLayoutConfig ready for PdfMaker.
     */
    const FnBuildReportLayoutConfig = async (
        reportLayoutConfig: Record<string, unknown> = reportLayoutConfigJson as Record<string, unknown>,
        dataset: { data?: Record<string, unknown> } = reportDatasetJson as { data?: Record<string, unknown> },
        getVars: () => Record<string, unknown> = getSessionVars
    ): Promise<Record<string, unknown>> => {
        try {
            const dataMap = dataset?.data ?? {};
            const inmemo: IMemoryUrlItem[] = [];

            for (const [id, rows] of Object.entries(dataMap)) {
                if (!id) continue;
                // create memory URL for each dataset array
                const memoryUrl = FnCreateMemoryUrl(rows);
                if (!memoryUrl) continue;
                inmemo.push({ key: id, memoryUrl });
            }

            if (inmemo.length) {
                InMemoryUrlContext?.setInMemoryUrlRecords([
                    ...(InMemoryUrlContext.InMemoryUrlRecords ?? []),
                    ...inmemo,
                ]);
            }
            // Inject in-memory URLs into reportLayoutConfig
            let reportLayout = injectMemoryUrlsAndReturn(
                structuredClone(reportLayoutConfig),
                inmemo
            ) as Record<string, unknown>;
            // Evaluate labels using getVars()
            const evaluated = await traverseAndEvaluateLabelsSafe(
                reportLayout,
                undefined,
                getVars()
            );
            if (typeof evaluated === "object" && evaluated) {
                reportLayout = evaluated as Record<string, unknown>;
            }

            if ((reportLayout.NodeType as string)?.toLowerCase() === "layout") {
                if (Array.isArray(reportLayout.header)) {
                    reportLayout.header = Object.assign({}, ...reportLayout.header);
                }
                if (Array.isArray(reportLayout.footer)) {
                    reportLayout.footer = Object.assign({}, ...reportLayout.footer);
                }
                if (Array.isArray(reportLayout.page)) {
                    reportLayout.page = Object.assign({}, ...reportLayout.page);
                }
            }

            return reportLayout;
        } catch (error) {
            console.error("FnBuildReportLayoutConfig error:", error);
            return reportLayoutConfig;
        }
    };

    // Clears report list state when component unmounts.
    useEffect(() => {
        return () => {
            setReportData([]);
            setFilterValue([]);
        };
    }, []);

    // Loads report profiles from context or API and applies enabled/filter rules.
    useEffect(() => {
        if (!appqaReportProps.featureId) {
            setIsLoadingReports(false);
            setIsDataProcessed(true);
            setReportData([]);
            return;
        }
        if (loadedFeatureId.current !== appqaReportProps.featureId) {
            loadedFeatureId.current = appqaReportProps.featureId;
            hasRequestedReports.current = false;
            setIsDataProcessed(false);
            setIsLoadingReports(true);
        }
        const reportProfiles =
            reportContext.reportProfiles.length > 0
                ? reportContext.reportProfiles
                : sampleReportProfiles.map((item) =>
                    mapToReportProfileItem(item as Record<string, unknown>)
                );
        let options = FnCreateFiltersForReport();
        let filteredReport: IReportProfileItem[] = [];
        if (reportProfiles.length > 0) {
            const enabledReportProfiles = reportProfiles.filter(isReportEnabled);
            // Filter by selected node
            const nodeEntityName = selectedNodeContext.selectedNode?.NodeEntityname;
            if (nodeEntityName?.length) {
                filteredReport = enabledReportProfiles.filter((item) =>
                    item.EntityNames?.includes(nodeEntityName)
                );
                if (filteredReport.length) {
                    options = FnActivateOptionForReport(options, "Selected Node");
                    setSelectedFilter("Selected Node");
                    setReportHeader(
                        `Available Reports for: ${nodeEntityName}`
                    );
                }
            }
            // Filter by feature or menu from session
            if (!filteredReport.length && sessionContext.SessionList.length) {
                const featureName = sessionContext.SessionList.find(
                    (s) => s.VariableName.toLowerCase() === "featurename"
                )?.SessionValue;
                if (featureName?.length) {
                    filteredReport = enabledReportProfiles.filter((item) =>
                        item.GroupName?.includes(featureName)
                    );
                    if (filteredReport.length) {
                        options = FnActivateOptionForReport(options, "Selected Feature");
                        setSelectedFilter("Selected Feature");
                        setReportHeader(`Available Reports for: ${featureName}`);
                    }
                }
                if (!filteredReport.length) {
                    const menuName = sessionContext.SessionList.find(
                        (s) => s.VariableName.toLowerCase() === "menuname"
                    )?.SessionValue;
                    if (menuName?.length) {
                        filteredReport = enabledReportProfiles.filter((item) =>
                            item.GroupName?.includes(menuName)
                        );
                        if (filteredReport.length) {
                            options = FnActivateOptionForReport(options, "Selected Feature");
                            setSelectedFilter("Selected Feature");
                            setReportHeader(`Available Reports for: ${menuName}`);
                        }
                    }
                }
            }
            // Fallback to All
            if (!filteredReport.length) {
                filteredReport = enabledReportProfiles.filter((item) => !item.EntityNames);
                options = FnActivateOptionForReport(options, "All");
                setSelectedFilter("All");
                setReportHeader(`Available Reports`);
            }
            // Deduplicate + sort
            const sortedData = filteredReport
                .filter(
                    (item, index, self) =>
                        index ===
                        self.findIndex(
                            (t) =>
                                t[`_${EntityNameEnums.ReportProfile}`] ===
                                item[`_${EntityNameEnums.ReportProfile}`]
                        )
                )
                .sort((a, b) =>
                    String(a._ReportProfile ?? "").localeCompare(String(b._ReportProfile ?? ""), undefined, {
                        sensitivity: "base",
                    })
                );
            setFilterValue(options);
            setReportData(sortedData);
            setReportDataOriginal(enabledReportProfiles);
            setIsDataProcessed(true);
            setIsLoadingReports(false);
        } else if (hasRequestedReports.current) {
            setReportData([]);
            setIsDataProcessed(true);
            setIsLoadingReports(false);
        } else {
            hasRequestedReports.current = true;
            setIsLoadingReports(true);
            axiosInterceptor(
                {
                    url: ALERT.GetAlertProfiles,
                    data: {
                        entityName: EntityNameEnums.ReportProfile,
                    },
                    allowShowLoader: true,
                    setFetchData: (handleReportProfiles: unknown, status?: string) => {
                        if (
                            status === "200" &&
                            handleReportProfiles &&
                            typeof handleReportProfiles === "object" &&
                            "alertJson" in handleReportProfiles
                        ) {
                            const reportRecords = FnHandleAPIResponse(
                                handleReportProfiles.alertJson,
                                "Dataset"
                            );
                            if (Array.isArray(reportRecords)) {
                                const reports: IReportProfileItem[] = [];
                                for (let index = 0; index < reportRecords.length; index++) {
                                    const element = reportRecords[index];
                                    reports.push(mapToReportProfileItem(element));
                                }
                                if (reports.length > 0) {
                                    reportContext.setReportProfiles(reports);
                                    return;
                                }
                                reportContext.setReportProfiles([]);
                                setReportData([]);
                                setFilterValue(FnCreateFiltersForReport());
                            } else {
                                setReportData([]);
                            }
                        } else {
                            setReportData([]);
                        }
                        setIsDataProcessed(true);
                        setIsLoadingReports(false);
                    },
                },
                statusBarContext
            ).catch(() => {
                setReportData([]);
                setIsDataProcessed(true);
                setIsLoadingReports(false);
            });
        }
    }, [
        appqaReportProps.featureId,
        reportContext.reportProfiles,
        selectedNodeContext.selectedNode,
        sessionContext.SessionList.length,
    ]);

    // Recursively collects API config strings from report layout JSON.
    function FnExtractApiValues(
        obj: unknown,
        isReturnJsonApiData: boolean
    ): { key: string; value: string }[] {
        const result: { key: string; value: string }[] = [];
        // Walks nested layout nodes to find API string values.
        function recurse(value: unknown): void {
            try {
                if (Array.isArray(value)) {
                    value.forEach(recurse);
                } else if (typeof value === "object" && value !== null) {
                    const entries = Object.entries(value as Record<string, unknown>);
                    for (const [key, val] of entries) {
                        try {
                            if (
                                typeof key === "string" &&
                                key.toLowerCase().includes("api") &&
                                typeof val === "string" &&
                                val !== ""
                            ) {
                                result.push({
                                    key: (value as any)?.id ?? key,
                                    value: val,
                                });
                            }
                            recurse(val);
                        } catch (innerError) {
                            console.warn("Error processing key:", key, innerError);
                        }
                    }
                }
            } catch (error) {
                console.error("Error in recurse:", error);
            }
        }
        try {
            recurse(obj);
        } catch (error) {
            console.error("Error executing FnExtractApiValues:", error);
        }
        // filtering WITHOUT changing output
        if (isReturnJsonApiData) {
            return result.filter((item) => {
                try {
                    const parsed = JSON.parse(item.value);
                    return parsed?.source === "JsonApi";
                } catch {
                    return false;
                }
            });
        }
        return result;
    }

    // Exports selected report payload as Excel via PDF download flow.
    const handleClickSaveAsExcel = async (payload?: string) => {
        try {
            if (!payload || typeof payload !== "string") {
                appqaReportProps.handleShowUserMessage?.(
                    "Invalid payload: Must be a JSON string."
                );
                return;
            }
            const reportData = FnParseJsonSafely(payload);
            handleClickDownloadPdf(undefined, reportData, true);
        } catch (error) {
            console.error("Error in save excel :", error);
            appqaReportProps.handleShowUserMessage?.(
                "Something went wrong in save as Excel"
            );
        }
    };

    // Evaluates a layout label formula against session/context values.
    function evaluateFormulaSafe(
        formula: string,
        context: Record<string, unknown>
    ): string {
        try {
            const fn = new Function(...Object.keys(context), `return (${formula});`);
            const result = fn(...Object.values(context));
            return String(result);
        } catch (err) {
            console.warn("Formula error:", formula, err);
            return "#ERR";
        }
    }

    // Traverses layout JSON and resolves formula labels plus field name conversions.
    async function traverseAndEvaluateLabelsSafe(
        node: unknown,
        apiProfiles?: unknown[],
        context: Record<string, unknown> = {}
    ): Promise<unknown> {
        try {
            if (typeof node !== "object" || node === null) return node;
            const safeNode: Record<string, unknown> = {
                ...(node as Record<string, unknown>),
            };
            // Evaluate label if it's a formula string
            try {
                if (
                    typeof safeNode.label === "string" &&
                    safeNode.label.trim().startsWith("=")
                ) {
                    const formula = safeNode.label.trim().substring(1);
                    safeNode.label = evaluateFormulaSafe(formula, context);
                }
            } catch (labelError) {
                console.warn("Error evaluating label:", labelError);
            }
            // Recursively check each key for array of objects
            for (const key in safeNode) {
                try {
                    const value = safeNode[key];
                    // Convert field names
                    if (key === "EntID") {
                        safeNode.id = safeNode.EntID;
                        delete safeNode.EntID;
                    }
                    if (key === "Name") {
                        safeNode.name = safeNode.Name;
                        delete safeNode.Name;
                    }
                    // Numeric conversions
                    if (key === "w" || key === "h" || key === "px" || key === "py") {
                        const num = Number(value);
                        safeNode[key] = isNaN(num) ? 0 : num;
                    } else if (
                        Array.isArray(value) &&
                        value.every((v) => typeof v === "object" && v !== null)
                    ) {
                        safeNode[key] = await Promise.all(
                            value.map((v) =>
                                traverseAndEvaluateLabelsSafe(v, apiProfiles, context)
                            )
                        );
                    }
                } catch (keyError) {
                    console.warn(`Error processing key: ${key}`, keyError);
                }
            }
            return safeNode;
        } catch (error) {
            console.error("Error in traverseAndEvaluateLabelsSafe:", error);
            return node; // fallback without breaking flow
        }
    }
    /**
     * Creates a memory URL (Blob URL) from an array.
     * @param data - Array to convert into a memory URL.
     * @returns Memory URL string.
     */
    // JsonApi memory URLs are created inside FnInMemoryUrlForAPI (sample data).
    // Executes layout API configs and returns in-memory URL lookup items.
    const MakeApiCallsForMemoryURL = async (
        Apis: { key: string; value: string }[],
        apiProfiles?: unknown[]
    ) => {
        try {
            let urlsObj: IMemoryUrlItem[] = [];
            for (let index = 0; index < Apis.length; index++) {
                const element = Apis[index];
                if (!element?.value) continue;
                const data = JSON.parse(element.value);
                if (!data?.source) continue;
                //  attach id inside payload (not source)
                data.payload = {
                    ...data.payload,
                    id: element.key,
                };
                urlsObj = (await FnInMemoryUrlForAPI(
                    data,
                    InMemoryUrlContext,
                    statusBarContext
                )) as IMemoryUrlItem[];
            }
            return urlsObj;
        } catch (error) {
            console.error("MakeApiCallsForMemoryURL error:", error);
            return [];
        }
    };

    // Finds in-memory URL for a layout node by its API id key.
    function getMemoryUrlById(
        id: string,
        memoryUrlLookup: { key: string; memoryUrl: string }[]
    ): string | null {
        const found = memoryUrlLookup.find((item) => item.key === id);
        return found ? found.memoryUrl : null;
    }

    // Injects resolved in-memory URLs into layout image/table/markdown arrays.
    function injectMemoryUrlsAndReturn(
        node: Record<string, any>,
        memoryUrlLookup: { key: string; memoryUrl: string }[]
    ): Record<string, any> {
        try {
            if (!node || typeof node !== "object") return node;
            // Shallow clone
            const updatedNode = { ...node };
            // imageArray
            try {
                if (Array.isArray(updatedNode.imageArray)) {
                    updatedNode.imageArray = updatedNode.imageArray.map((img: any) => {
                        try {
                            const memoryUrl = img?.id
                                ? getMemoryUrlById(img.id, memoryUrlLookup)
                                : null;
                            return memoryUrl
                                ? { ...img, inmemoryUrl: memoryUrl, format: "png" }
                                : img;
                        } catch (imgError) {
                            console.warn("Error processing imageArray item:", imgError);
                            return img;
                        }
                    });
                }
            } catch (error) {
                console.warn("Error in imageArray:", error);
            }
            // datatableArray
            try {
                if (Array.isArray(updatedNode.datatableArray)) {
                    updatedNode.datatableArray = updatedNode.datatableArray.map(
                        (dt: any) => {
                            try {
                                const memoryUrl = dt?.id
                                    ? getMemoryUrlById(dt.id, memoryUrlLookup)
                                    : null;
                                return memoryUrl
                                    ? { ...dt, inmemoryUrl: memoryUrl, format: "png" }
                                    : dt;
                            } catch (dtError) {
                                console.warn("Error processing datatableArray item:", dtError);
                                return dt;
                            }
                        }
                    );
                }
            } catch (error) {
                console.warn("Error in datatableArray:", error);
            }
            // markdownArray
            try {
                if (Array.isArray(updatedNode.markdownArray)) {
                    updatedNode.markdownArray = updatedNode.markdownArray.map(
                        (dt: any) => {
                            try {
                                const memoryUrl = dt?.id
                                    ? getMemoryUrlById(dt.id, memoryUrlLookup)
                                    : null;
                                return memoryUrl
                                    ? { ...dt, inmemoryUrl: memoryUrl, format: "png" }
                                    : dt;
                            } catch (mdError) {
                                console.warn("Error processing markdownArray item:", mdError);
                                return dt;
                            }
                        }
                    );
                }
            } catch (error) {
                console.warn("Error in markdownArray:", error);
            }
            // recurse through locationArray
            try {
                if (Array.isArray(updatedNode.locationArray)) {
                    updatedNode.locationArray = updatedNode.locationArray.map(
                        (loc: any) => {
                            try {
                                return injectMemoryUrlsAndReturn(loc, memoryUrlLookup);
                            } catch (locError) {
                                console.warn("Error processing locationArray item:", locError);
                                return loc;
                            }
                        }
                    );
                }
            } catch (error) {
                console.warn("Error in locationArray:", error);
            }
            return updatedNode;
        } catch (error) {
            console.error("Error in injectMemoryUrlsAndReturn:", error);
            return node; // fallback without breaking flow
        }
    }

    // Writes multiple datatable API responses into one Excel workbook file.
    function exportMultipleDatatablesToExcel(
        dataArray: Record<string, any>[],
        fileName: string = "Report.xlsx"
    ): void {
        if (!Array.isArray(dataArray) || dataArray.length === 0) return;
        try {
            const workbook = XLSX?.utils?.book_new();
            if (!workbook) {
                console.error("Failed to create workbook");
                return;
            }
            dataArray.forEach((tableObj, index) => {
                try {
                    if (!tableObj || typeof tableObj !== "object") return;
                    const tableKey = Object.keys(tableObj)[0];
                    const tableData = tableObj[tableKey];
                    if (!tableData || typeof tableData !== "object") return;
                    const entityKey = Object.keys(tableData)[0];
                    const entityData = tableData[entityKey]?.[0];
                    if (!entityData?.ColumnList || !entityData?.Dataset) return;
                    const { ColumnList, Dataset } = entityData;
                    // Headers
                    const headers = ColumnList.map((col: Record<string, any>) => {
                        try {
                            return col?.PropertyLabel?.trim() || col?.PName;
                        } catch {
                            return col?.PName || "";
                        }
                    });
                    // Rows
                    const rows = Dataset.map((row: Record<string, any>) => {
                        try {
                            return ColumnList.map(
                                (col: Record<string, any>) => row?.[col?.PName] ?? ""
                            );
                        } catch {
                            return [];
                        }
                    });
                    const sheetData = [headers, ...rows];
                    const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
                    // Excel sheet name max length = 31
                    const sheetName = (tableKey || `Sheet${index + 1}`).substring(0, 31);
                    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
                } catch (sheetError) {
                    console.error(
                        `Error processing table at index ${index}:`,
                        sheetError
                    );
                }
            });
            try {
                XLSX.writeFile(workbook, fileName);
            } catch (writeError) {
                console.error("Error writing Excel file:", writeError);
            }
        } catch (error) {
            console.error("Error in exportMultipleDatatablesToExcel:", error);
        } finally {
            try {
                // ALWAYS cleanup in-memory URLs
                InMemoryUrlContext?.FnDestroyInMemoryUrls?.();
            } catch (cleanupError) {
                console.warn("Error during cleanup:", cleanupError);
            }
        }
    }
    const FnGetApiProfiles = async (): Promise<Record<string, any>[]> => {
        if (mainAppContext && mainAppContext?.apiProfileRecords && Array.isArray(mainAppContext.apiProfileRecords) && mainAppContext.apiProfileRecords.length > 0) {
            return mainAppContext.apiProfileRecords;
        }
        // SAMPLE DATA: static ApiProfile.json via ReportSampleData
        if (Array.isArray(sampleApiProfiles) && sampleApiProfiles.length > 0) {
            return sampleApiProfiles as Record<string, any>[];
        }

        return new Promise((resolve, reject) => {
            const handleGetEntityRecordsApiResponse = (
                getEntityRecordsApiResponse: unknown,
                status?: string
            ) => {
                try {
                    if (
                        status === "200" &&
                        typeof getEntityRecordsApiResponse !== "string"
                    ) {
                        statusBarContext?.setUserActionData(
                            "Invalid API profile response format."
                        );
                        resolve([]);
                        return;
                    }

                    const parsedEntity = FnHandleAPIResponse(
                        getEntityRecordsApiResponse,
                        "Dataset"
                    );

                    const profiles =
                        parsedEntity?.[`_${EntityNameEnums.ApiProfile}`];

                    if (!Array.isArray(profiles) || profiles.length === 0) {
                        statusBarContext?.setUserActionData(
                            "No API profiles found."
                        );
                        resolve([]);
                        return;
                    }

                    resolve(profiles);
                } catch (error) {
                    console.error("Entity record response error:", error);
                    statusBarContext?.setFetchError([
                        "Failed to process entity records.",
                    ]);
                    reject(error);
                }
            };

            axiosInterceptor(
                {
                    url: EM.GetEntityRecords,
                    data: {
                        entityName: "ApiProfile",
                        entIDs: "",
                        tableName: "_ApiProfile",
                        filterJsonString: null,
                        andor: "OR",
                        startRec: 0,
                        endRec: 0,
                    },
                    allowShowLoader: true,
                    setFetchData: handleGetEntityRecordsApiResponse,
                },
                statusBarContext
            ).catch(reject);
        });
    };
    // const FnParseApiToInMemoryUrlJson = async (config: Record<string, unknown>) => {
    //     let updatedConfig = {}
    //     // Extracts API configs from layout JSON and fetches in-memory URLs.
    //     const apis = FnExtractApiValues(config, false);
    //     if (apis.length) {
    //         // Fetches API profiles and builds report output from in-memory data.
    //         const profiles = await FnGetApiProfiles();
    //         // create memory urls for all the API calls in the layout json
    //         const inmemoryUrls = await MakeApiCallsForMemoryURL(
    //             apis,
    //             profiles
    //         );
    //         // Inject in-memory URLs into layout JSON
    //         const updatedJson = injectMemoryUrlsAndReturn(
    //             config,
    //             inmemoryUrls
    //         );
    //         if (typeof updatedJson === "object") {
    //             const safeNode: Record<string, unknown> = {
    //                 ...updatedJson,
    //             };
    //             if (
    //                 (
    //                     safeNode.NodeType as string
    //                 )?.toLowerCase() === "layout"
    //             ) {
    //                 if (Array.isArray(safeNode.header)) {
    //                     safeNode.header = Object.assign(
    //                         {},
    //                         ...safeNode.header
    //                     );
    //                 }
    //                 if (Array.isArray(safeNode.footer)) {
    //                     safeNode.footer = Object.assign(
    //                         {},
    //                         ...safeNode.footer
    //                     );
    //                 }
    //                 if (Array.isArray(safeNode.page)) {
    //                     safeNode.page = Object.assign(
    //                         {},
    //                         ...safeNode.page
    //                     );
    //                 }
    //             }

    //             updatedConfig = safeNode;
    //         }


    //     } else {
    //         const objectData = Object.fromEntries(
    //             sessionContext.SessionList.map((item) => [
    //                 item.VariableName,
    //                 item.SessionValue,
    //             ])
    //         );
    //         const updatedJson =
    //             await traverseAndEvaluateLabelsSafe(
    //                 config,
    //                 undefined,
    //                 objectData
    //             );
    //         if (typeof updatedJson === "object") {
    //             const safeNode: Record<string, unknown> = {
    //                 ...updatedJson,
    //             };
    //             if (
    //                 (safeNode.NodeType as string)?.toLowerCase() ===
    //                 "layout"
    //             ) {
    //                 if (Array.isArray(safeNode.header)) {
    //                     safeNode.header = Object.assign(
    //                         {},
    //                         ...safeNode.header
    //                     );
    //                 }
    //                 if (Array.isArray(safeNode.footer)) {
    //                     safeNode.footer = Object.assign(
    //                         {},
    //                         ...safeNode.footer
    //                     );
    //                 }
    //                 if (Array.isArray(safeNode.page)) {
    //                     safeNode.page = Object.assign(
    //                         {},
    //                         ...safeNode.page
    //                     );
    //                 }
    //             }
    //             updatedConfig = safeNode;
    //         }
    //     }
    //     return updatedConfig
    // }

    // Loads report template file and opens PDF preview or Excel export.
    const handleClickDownloadPdf = async (
        _event: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement> | undefined,
        selectedReport: IReportProfileItem,
        ExportExcel?: boolean
    ) => {
        if (
            commonVariableContext.diagnosticLevel &&
            commonVariableContext.diagnosticLevel?.toString() === "0"
        ) {
            setDiagnosticLevel(0);
        }
        if (!selectedReport || typeof selectedReport !== "object") {
            statusBarContext?.setUserActionData("Invalid payload: Must be a JSON ");
            return;
        }
        statusBarContext.setIsLoading(true);
        try {
            // SAMPLE DATA: reportLayoutConfig.json + reportDataset.json → memory URLs → inject
            if (!ExportExcel) {
                statusBarContext.setIsLoading(true);
                const updatedConfig = await FnBuildReportLayoutConfig(
                    reportLayoutConfigJson as Record<string, unknown>,
                    reportDatasetJson as { data?: Record<string, unknown> },
                    getSessionVars
                );
                setConfigJsonContent(updatedConfig);
                setIsDialogOpen(true);
                statusBarContext.setIsLoading(false);
                return;
            }

            // SAMPLE DATA Excel: JsonApi → memory URLs → workbook
            const apis = FnExtractApiValues(sampleReportLayoutJson, true);
            if (apis.length) {
                const profiles = await FnGetApiProfiles();
                const inmemoryUrls = await MakeApiCallsForMemoryURL(apis, profiles);
                const apiData = [];
                for (let index = 0; index < inmemoryUrls.length; index++) {
                    const element = inmemoryUrls[index];
                    const tableJson = await FnInMemoryUrlToJson(
                        element.memoryUrl as string
                    );
                    apiData.push({ [`${element.key}`]: tableJson });
                }
                if (!apiData.length && sampleReportDatatableResponses.length) {
                    exportMultipleDatatablesToExcel(
                        sampleReportDatatableResponses as Record<string, unknown>[]
                    );
                } else {
                    exportMultipleDatatablesToExcel(apiData);
                }
            } else if (sampleReportDatatableResponses.length) {
                exportMultipleDatatablesToExcel(
                    sampleReportDatatableResponses as Record<string, unknown>[]
                );
            } else {
                statusBarContext?.setFetchError(["Datatable not found."]);
            }
        } catch (error) {
            console.error("Payload parsing error:", error);
            statusBarContext?.setFetchError([
                "Failed to parse report profile payload.",
            ]);
        } finally {
            statusBarContext.setIsLoading(false);
        }
    };


    // Applies selected filter option to the enabled report list.
    const handleFilterSelect = (option: { uniqueName?: string }) => {
        try {
            if (!option?.uniqueName) return;
            try {
                setFilterValue((prev) =>
                    FnActivateOptionForReport(prev, option.uniqueName!)
                );
            } catch (filterError) {
                console.warn("Error updating filter value:", filterError);
            }
            const filterKey = option.uniqueName.toLowerCase();
            switch (filterKey) {
                case "all":
                    try {
                        setReportData(sortReportsAZ(reportDataOriginal
                            ? reportDataOriginal.filter((item) =>
                                !item?.EntityNames
                            )
                            : []));
                        setReportHeader(`Available Reports`);
                    } catch (allError) {
                        console.warn("Error in 'all' case:", allError);
                    }
                    break;
                case "selected node": {
                    try {
                        const nodeEntityName =
                            selectedNodeContext?.selectedNode?.NodeEntityname;
                        setReportData(sortReportsAZ(
                            nodeEntityName
                                ? reportDataOriginal.filter((item) =>
                                    item?.EntityNames?.includes(nodeEntityName)
                                )
                                : []
                        ));
                        setReportHeader(
                            `Available Reports for: ${nodeEntityName}`
                        );
                    } catch (nodeError) {
                        console.warn("Error in 'selected node' case:", nodeError);
                    }
                    break;
                }
                case "selected feature": {
                    try {
                        const featureName = sessionContext?.SessionList?.find(
                            (s) => s?.VariableName?.toLowerCase() === "featurename"
                        )?.SessionValue;
                        const filteredReports = reportDataOriginal.filter((item) =>
                            item?.GroupName?.includes(featureName)
                        );
                        if (filteredReports.length) {
                            setReportData(sortReportsAZ(
                                featureName
                                    ? reportDataOriginal.filter((item) =>
                                        item?.GroupName?.includes(featureName)
                                    )
                                    : []
                            ));
                            setReportHeader(`Available Reports: ${featureName}`);
                        } else {
                            const menuName = sessionContext?.SessionList?.find(
                                (s) => s?.VariableName?.toLowerCase() === "menuname"
                            )?.SessionValue;
                            setReportData(sortReportsAZ(
                                menuName
                                    ? reportDataOriginal.filter((item) =>
                                        item?.GroupName?.includes(menuName)
                                    )
                                    : []
                            ));
                            setReportHeader(`Available Reports: ${menuName}`);
                        }
                    } catch (featureError) {
                        console.warn("Error in 'selected feature' case:", featureError);
                    }
                    break;
                }
                default:
                    try {
                        setReportData(sortReportsAZ(reportDataOriginal));
                    } catch (defaultError) {
                        console.warn("Error in default case:", defaultError);
                    }
            }
            try {
                setSelectedFilter(option.uniqueName);
            } catch (selectionError) {
                console.warn("Error setting selected filter:", selectionError);
            }
        } catch (error) {
            console.error("Error in handleFilterSelect:", error);
        }
    };

    // Saves current report layout JSON from the preview dialog to disk.
    function handleClickInformation(
        event: any,
        actionCode?: string | undefined,
        payload?: Record<string, any>
    ): void {
        // Writes dialog layout JSON using the browser file save picker.
        const handleSaveAs = async () => {
            if (!configJsonContent || typeof configJsonContent !== "object") {
                console.warn("Invalid configJsonContent:", configJsonContent);
                return;
            }
            if (!window?.showSaveFilePicker) {
                console.error("File System Access API not supported in this browser");
                setConfirmMessage("Save not supported in this browser.");
                setIsConfirmOpen(true);
                return;
            }
            const fileHandle = await window.showSaveFilePicker({
                suggestedName: "reportTemplate.json",
                types: [
                    {
                        description: "JSON Files",
                        accept: { "application/json": [".json"] },
                    },
                ],
            });
            const writable = await fileHandle.createWritable();
            try {
                const jsonData = JSON.stringify(configJsonContent, null, 2);
                await writable.write(jsonData);
            } catch (writeError) {
                console.error("Error writing file:", writeError);
                throw writeError;
            } finally {
                try {
                    await writable.close();
                } catch (closeError) {
                    console.warn("Error closing file stream:", closeError);
                }
            }
            setConfirmMessage("File saved successfully!");
            setIsConfirmOpen(true);
        };
        try {
            if (configJsonContent && typeof configJsonContent === "object") {
                handleSaveAs();
            }
        } catch (error) {
            console.error("Error in handleClickInformation:", error);
        }
    }

    const shouldShowLoading = isLoadingReports || !isDataProcessed;
    const shouldShowNoData = !shouldShowLoading && reportData.length === 0;

    return (
        <div
            key={appqaReportProps.uniqueName}
            className="nz-appqa-report-container"
        >
            <div className="nz-sub-header">
                {filterValue.length > 1 && (
                    <OptionsFilter
                        showIcon={true}
                        uniqueName={"app-qa-filter"}
                        container={"ap-filter"}
                        handleSelect={handleFilterSelect}
                        options={filterValue}
                    />
                )}
                <Label
                    uniqueName={`${appqaReportProps.uniqueName}-task-header`}
                    // label={`${reportHeader}${reportData.length ? ` (${reportData.length})` : ""
                    //     } ${selectedFilter ? `(${selectedFilter})` : ""}`}
                    label={`${reportHeader}${reportData.length ? ` (${reportData.length})` : ""}`}
                />
            </div>
            <div className="nz-appqa-report-content">
                {shouldShowLoading ? (
                    <div className="nz-wh-100 nz-d-flex-hv-left">Loading...</div>
                ) : shouldShowNoData ? (
                    <div className="nz-wh-100 nz-d-flex-hv-left">No Data Found</div>
                ) : (
                    reportData.map((report, index) => (
                        <CardLayout
                            key={index}
                            uniqueName={`${appqaReportProps.uniqueName}-report-${index}`}
                            className={`nz-report-card${report.OutputFormat !== "excel" ? " nz-clickable-report" : ""
                                } ${report.IsTemplate ? "nz-template-report" : ""} ${report.IsDeprecated ? "nz-deprecated-report" : ""
                                }`}
                            data={report}
                            fields={buildReportCardFields(report)}
                            isSelected={selectedReportId === report.EntID}
                            hideRightMouseMenu={true}
                            onClick={(event) => {
                                if (
                                    (event.target as HTMLElement).closest(".nz-excel-icon-wrapper")
                                ) {
                                    return;
                                }
                                setSelectedReportId(report.EntID);
                                handleClickDownloadPdf(event, report);
                            }}
                            ContentImage={{
                                uniqueName: `${appqaReportProps.uniqueName}-reporti-${index}`,
                                source: (
                                    <Report24x24
                                        size={FnGetCssVariable("--image-size-2")}
                                        fill="none"
                                        strokeWidth={1}
                                    />
                                ),
                                w: "var(--image-size-2)",
                                tooltip: report._ReportProfile,
                                type: "svg",
                            }}
                            renderForm={
                                report.OutputFormat === "excel" ? (
                                    <div className="nz-excel-icon-wrapper">
                                        <OverlayTab
                                            uniqueName={`${appqaReportProps.uniqueName}-replacement-overlay`}
                                            ShowOnlyIcon={true}
                                            hideDrager={true}
                                            tabs={[
                                                {
                                                    uniqueName: `${appqaReportProps.uniqueName}-overlay-tab-${index}`,
                                                    label: {
                                                        uniqueName: `${appqaReportProps.uniqueName}-overlay-tab-${index}-label`,
                                                        label: "Excel",
                                                        tooltip: "Save as Excel",
                                                    },
                                                    w: "auto",
                                                    h: "calc(var(--node_height) - var(--spacing-1))",
                                                    actionCode: "Excel",
                                                    handleMouse: function (
                                                        event: any,
                                                        actionCode?: string
                                                    ): void { },
                                                },
                                            ]}
                                            allowUnSelect={true}
                                            selectedTabName={""}
                                            tabAlignment={"horizontal"}
                                            useContainer={false}
                                            handleSelectedTab={() => {
                                                handleClickSaveAsExcel(JSON.stringify(report));
                                            }}
                                            headerText={""}
                                        />
                                    </div>
                                ) : null
                            }
                        />
                    ))
                )}
            </div>
            {configJsonContent && diagnosticLevel !== 0 ? (
                <Dialog
                    open={isDialogOpen}
                    className="nz-dialog-container"
                    maxWidth={"md"}
                    fullWidth={true}
                    hideBackdrop={true}
                    style={{ zIndex: 9999 }}
                >
                    <div className="nz-dialog-header nz-sub-header">
                        <Label
                            uniqueName={`${appqaReportProps.uniqueName}-dialog-title`}
                            label={"Download Report"}
                            fontWeight="bold"
                        />
                        <div className="nz-d-flex-row nz-align-center">
                            {diagnosticLevel !== 0 && (
                                <ActionImage
                                    uniqueName={`${appqaReportProps.uniqueName}-explorer-tree-info-ai`}
                                    image={{
                                        uniqueName: `${appqaReportProps.uniqueName}-layout-save-ai`,
                                        source: (
                                            <Save24x24
                                                size={FnGetCssVariable("--image-size-1")}
                                                fill="none"
                                                strokeWidth={1}
                                            />
                                        ),
                                        w: "var(--image-size-2)",
                                        tooltip: "Click to Save Report Layout json",
                                        type: "svg",
                                    }}
                                    w={"var(--node_height)"}
                                    disabled={false}
                                    h={"var(--node_height)"}
                                    actionCode={"savefloorlayout"}
                                    handleMouse={handleClickInformation}
                                />
                            )}
                            <ActionImage
                                handleMouse={() => {
                                    setIsDialogOpen(false);
                                    setConfigJsonContent(undefined);
                                    InMemoryUrlContext?.FnDestroyInMemoryUrls();
                                }}
                                image={{
                                    uniqueName: `${appqaReportProps.uniqueName}-i-close`,
                                    source: (
                                        <Close24x24
                                            size={FnGetCssVariable("--image-size-2")}
                                            fill="none"
                                            strokeWidth={1}
                                        />
                                    ),
                                    type: "svg",
                                    w: "var(--image-size-2)",
                                    h: "var(--image-size-2)",
                                    tooltip: "close",
                                }}
                                uniqueName={`${appqaReportProps.uniqueName}-ai-close`}
                                actionCode="cancel"
                                w="var(--node_height)"
                                h="var(--node_height)"
                            />
                        </div>
                    </div>
                    <DialogContent>
                        {diagnosticLevel !== 0 && (
                            <JsonViewer
                                uniqueName={`${appqaReportProps.uniqueName}-dialog-content`}
                                jsonData={configJsonContent}
                                showAsDiv={true}
                            />
                        )}
                        <PdfMaker
                            config={updateLayoutWithSessionVars(configJsonContent, getSessionVars)}
                            autoGenerate={false}
                            onSuccess={() => { }}
                        />
                    </DialogContent>
                </Dialog>
            ) : (
                <>
                    {configJsonContent && (
                        <div style={{ display: "none" }}>
                            <PdfMaker
                                config={updateLayoutWithSessionVars(configJsonContent, getSessionVars)} //configJsonContent we are passing config to pdfmaker
                                autoGenerate={true}
                                onSuccess={() => {
                                    InMemoryUrlContext?.FnDestroyInMemoryUrls();
                                }}
                            />
                        </div>
                    )}
                </>
            )}
            <YesNoFormContainer
                isOpen={isConfirmOpen}
                uniqueName={appqaReportProps.uniqueName + "confirmbox"}
                message={confirmMessage}
                showOkButton={true}
                handleOkButtonClick={() => {
                    setIsConfirmOpen(false);
                }}
            />
        </div>
    );
};
export default AppqaReport;
