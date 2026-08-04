import { useEffect } from "react";
import { useStatusBarContext } from "../../../shared/context/hooks/StatusBarHooks"
// SAMPLE DATA: errors shown in the status bar while the API is disabled.
import { sampleRequestSupportErrors } from "../../../../sampledata/features/RequestSupportSampleData";

const RequestSupport = () => {
    // const statusBarContext = useStatusBarContext();

    // useEffect(() => {
    //     statusBarContext.setFetchDataError(sampleRequestSupportErrors)
    //     return () => {
    //         statusBarContext.setFetchDataError(null);
    //         statusBarContext.setIsLoading(false);
    //     }
    // }, [])

    return (
        <p>Y to provide component (RequestSupport)</p>
    )
}

export { RequestSupport }
export default RequestSupport
