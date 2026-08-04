import { useContext } from "react";
import { InMemoryUrlContext } from "../contextandprovider/InMemoryUrl";

const useInMemoryUrlContext = () => {
    const context = useContext(InMemoryUrlContext);
    if (context === undefined) {
        throw new Error("useInMemoryUrlContext must be used within an InMemoryUrlProvider");
    }
    return context;
};

export { useInMemoryUrlContext };
