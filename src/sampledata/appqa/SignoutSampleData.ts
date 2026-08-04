/*
 * SAMPLE DATA: open sessions used while session APIs are disabled.
 */
interface ISampleOpenSession {
    UserSessionID: string;
    LoginUserName: string;
    LoginShortName: string;
    CreatedAt: string;
}

const sampleOpenSessions: ISampleOpenSession[] = [
    {
        UserSessionID: "SAMPLE-SESSION-0000-1111-2222",
        LoginUserName: "demo.user",
        LoginShortName: "Admin",
        CreatedAt: "2026-07-29T12:00:00.000Z",
    },
];

const closeSampleSession = async (_sessionId: string): Promise<void> => {
    await Promise.resolve();
};

export { sampleOpenSessions, closeSampleSession };
