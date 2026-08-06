import { IMainApp } from "../../shared/context/allinterface/IMainApp";
import { IStatusBar } from "../../shared/context/allinterface/IStatusBar";

/* Statistics refresh APIs removed with interceptors. */
const FnUpdateStatisticsAndRefresh = async (
    _statusBarContext: IStatusBar,
    _mainAppContext: IMainApp
) => {
    return;
};

export { FnUpdateStatisticsAndRefresh };
