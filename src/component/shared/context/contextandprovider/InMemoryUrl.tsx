import { createContext, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { IAppContextWrapper } from "../allinterface/IAppContextWrapper";
import { IInMemoryUrl, IMemoryUrlItem } from "../allinterface/IInMemoryUrl";
import { FnDestroyInMemoryUrl } from "../../../appqa/allcommon/FnDestroyInMemoryUrl";

const InMemoryUrlContext = createContext<IInMemoryUrl | undefined>(undefined);

function InMemoryUrlProvider({ children }: IAppContextWrapper) {
    const [InMemoryUrlRecords, setInMemoryUrlRecords] = useState<IMemoryUrlItem[]>([]);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const FnDestroyInMemoryUrls = useCallback((items?: IMemoryUrlItem[]) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            setInMemoryUrlRecords((currentRecords) => {
                if (items && items.length > 0) {
                    const itemSet = new Set(items.map((i) => i.key));
                    return currentRecords.filter((record) => {
                        if (itemSet.has(record.key)) {
                            FnDestroyInMemoryUrl(record.memoryUrl);
                            return false;
                        }
                        return true;
                    });
                }

                currentRecords.forEach((item) => {
                    FnDestroyInMemoryUrl(item.memoryUrl);
                });
                return [];
            });
        }, 2000);
    }, []);

    const contextValue: IInMemoryUrl = useMemo(
        () => ({
            InMemoryUrlRecords,
            setInMemoryUrlRecords,
            FnDestroyInMemoryUrls,
        }),
        [InMemoryUrlRecords, FnDestroyInMemoryUrls]
    );

    return (
        <InMemoryUrlContext.Provider value={contextValue}>
            {children}
        </InMemoryUrlContext.Provider>
    );
}

export { InMemoryUrlContext, InMemoryUrlProvider };
