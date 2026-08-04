import { AuthSession } from "@n20a/libauth";

interface INzApp {
    uniqueName: string;
    user: AuthSession;
    onSuccess: () => void;
    onError: (error: string) => void;
}

export type { INzApp }
