import { IAppContextWrapper } from "./allinterface/IAppContextWrapper";
import { ApProfileProvider } from "./contextandprovider/ApProfile";
import { AppqaSettingsProvider } from "./contextandprovider/AppqaSettingsVar";
import { CommonVariableProvider } from "./contextandprovider/CommonVariable";
import { ExplorerTreeProvider } from "./contextandprovider/ExplorerTree";
import { HelpTipProvider } from "./contextandprovider/Helptip";
import { MainAppProvider } from "./contextandprovider/MainApp";
import { SessionProvider } from "./contextandprovider/Session";
import { StatusBarProvider } from "./contextandprovider/StatusBar";

/* Wraps the app with live context providers in dependency order. */
const AppContextWrapper = ({ children }: IAppContextWrapper) => {
    const providers = [
        MainAppProvider,
        ExplorerTreeProvider,
        SessionProvider,
        ApProfileProvider,
        AppqaSettingsProvider,
        HelpTipProvider,
        StatusBarProvider,
        CommonVariableProvider,
    ];

    const wrappedChildren = providers.reduceRight((acc, Comp) => {
        return <Comp>{acc}</Comp>;
    }, children);

    return <>{wrappedChildren}</>;
};

export { AppContextWrapper };
