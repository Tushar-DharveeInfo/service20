import { IStatusBar } from "../../shared/context/allinterface/IStatusBar";
import { IFetchProps } from "../allinterface/IStatusBarContainer";

type FetchResult = {
    status?: string;
    data: unknown;
};

/* Remote axios interceptor removed — resolves as a no-op failure. */
const FnCallApiToFetchWithResult = (
    _args: IFetchProps,
    _statusBarContext: IStatusBar
): Promise<FetchResult> => {
    return Promise.resolve({ status: undefined, data: null });
};

export { FnCallApiToFetchWithResult };
