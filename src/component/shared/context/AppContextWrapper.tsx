import { IAppContextWrapper } from "./allinterface/IAppContextWrapper";
import { CommonVariableProvider } from "./contextandprovider/CommonVariable";
import { HelpTipProvider } from "./contextandprovider/Helptip";
import { MainAppProvider } from "./contextandprovider/MainApp";
import { ResourceProvider } from "./contextandprovider/Resource";
import { SessionProvider } from "./contextandprovider/Session";
import { StatusBarProvider } from "./contextandprovider/StatusBar";

/* Wraps the app with live context providers in dependency order. */
const AppContextWrapper = ({ children }: IAppContextWrapper) => {
    const providers = [
        MainAppProvider,
        SessionProvider,
        HelpTipProvider,
        StatusBarProvider,
        CommonVariableProvider,
        ResourceProvider
    ];

    const wrappedChildren = providers.reduceRight((acc, Comp) => {
        return <Comp>{acc}</Comp>;
    }, children);

    return <>{wrappedChildren}</>;
};

export { AppContextWrapper };
