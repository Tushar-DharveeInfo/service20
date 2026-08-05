
import type { IInMemoryUrl, IMemoryUrlItem } from "../../context/allinterface/IInMemoryUrl";
import { sampleReportDatatableResponses } from "../../../../sampledata/appqa/report/ReportSampleData";
import { FnCreateFailedMemoryUrl } from "./FnCreateFailedMemoryUrl";
import { IStatusBar } from "../../context/allinterface/IStatusBar";

type TSource = "JsonApi"

type TApiObject = {
    source: TSource;
    url?: string;
    payload: {
        name?: string;
        apiPayload?: unknown;
        id?: string;
        [key: string]: unknown;
    };
};

/* Creates a blob: memory URL from JSON array/object data. */
const createJsonMemoryUrl = (data: unknown): string => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
    });
    return URL.createObjectURL(blob);
};

/*
 * SAMPLE DATA: resolve JsonApi payload to static datatable rows.
 * Prefers already-passed apiPayload arrays; otherwise uses ReportSampleData.
 */
const resolveJsonApiSampleData = (apiObject: TApiObject): unknown => {
    const passed = apiObject.payload?.apiPayload;
    if (Array.isArray(passed) || (passed && typeof passed === "object")) {
        return passed;
    }
    // Default sample sheet used by Excel export / datatable JsonApi
    return sampleReportDatatableResponses[0] ?? [];
};

/*
 * Service20 sample implementation of FnInMemoryUrlForAPI.
 * JsonApi is fully supported (blob memory URLs from sample / passed data).
 * Other sources return a failed placeholder URL so layout flow can continue.
 */
const FnInMemoryUrlForAPI = async (
    api: TApiObject,
    InMemoryUrlContext: IInMemoryUrl | undefined,
    statusBarContext: IStatusBar,
    isReturnCurrentURL?: boolean
): Promise<IMemoryUrlItem[] | string> => {
    try {
        statusBarContext?.setIsLoading?.(true);

        const finalResult: IMemoryUrlItem[] = [
            ...(InMemoryUrlContext?.InMemoryUrlRecords ?? []),
        ];
        let currentUrl = "";

        if (api.source === "JsonApi") {
            try {
                const data = resolveJsonApiSampleData(api);
                currentUrl = createJsonMemoryUrl(data) || FnCreateFailedMemoryUrl(api.source);
                finalResult.push({
                    key: String(api.payload?.id ?? api.payload?.name ?? "JsonApi"),
                    memoryUrl: currentUrl,
                });
            } catch (err) {
                console.error("JsonApi processing error:", err);
                currentUrl = FnCreateFailedMemoryUrl(api.source);
                finalResult.push({
                    key: String(api.payload?.id ?? api.payload?.name ?? "JsonApi"),
                    memoryUrl: currentUrl,
                });
            }
        } else {
            // Other sources not implemented in Service20 sample — placeholder URL
            currentUrl = FnCreateFailedMemoryUrl(api.source);
            finalResult.push({
                key: String(api.payload?.id ?? api.payload?.name ?? api.source),
                memoryUrl: currentUrl,
            });
        }

        InMemoryUrlContext?.setInMemoryUrlRecords([...finalResult]);
        return isReturnCurrentURL ? currentUrl : finalResult;
    } catch (err) {
        console.error("FnInMemoryUrlForAPI fatal error:", err);
        throw err;
    } finally {
        statusBarContext?.setIsLoading?.(false);
    }
};

export { FnInMemoryUrlForAPI };
