
import { IStatusBar } from "../../shared/context/allinterface/IStatusBar";
import { IFetchProps } from "../allinterface/IStatusBarContainer";

type FetchResult = {
    status?: string;
    data: unknown;
};

/* SAMPLE DATA: interceptor API calls are disabled — resolve as success without network. */
const FnCallApiToFetchWithResult = (
    _args: IFetchProps,
    _statusBarContext: IStatusBar
): Promise<FetchResult> => {
    return Promise.resolve({ status: "200", data: null });
};

export { FnCallApiToFetchWithResult }
