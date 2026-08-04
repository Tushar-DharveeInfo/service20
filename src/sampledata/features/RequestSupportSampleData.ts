/*
 * SAMPLE DATA: FetchDataError entries for Services/Request Support.
 */
import type { IErrorData } from "../../component/shared/context/allinterface/IStatusBar";

/*
 * Same shape the interceptor passes to statusBarContext.setFetchDataError.
 * errCode > 0 renders under "Errors", errCode <= 0 renders under "Logs".
 */
const sampleRequestSupportErrors: IErrorData[] = [
    {
        errCode: 0,
        errString: "Entering SP_iNZDeviceModel.get_devicemodel_views",
        isErr: false,
        timeStamp: "2026-07-30T09:20:30.118",
        apiName: "DEVICEMODEL.GetDeviceModelViews",
        id: 1
    },
    {
        errCode: 0,
        errString: "Exiting SP_iNZDeviceModel.get_devicemodel_views",
        isErr: false,
        timeStamp: "2026-07-30T09:20:30.126",
        apiName: "DEVICEMODEL.GetDeviceModelViews",
        id: 2
    },
    {
        errCode: 5,
        errString: "EntID is a required parameter",
        isErr: true,
        timeStamp: "2026-07-30T09:20:30.130",
        apiName: "DEVICEMODEL.GetDeviceModelViews",
        id: 3
    },
    {
        errCode: 12,
        errString: "Get DeviceModel Views failed",
        isErr: true,
        timeStamp: "2026-07-30T09:20:30.134",
        apiName: "DEVICEMODEL.GetDeviceModelViews",
        id: 4
    }
];

export { sampleRequestSupportErrors };
