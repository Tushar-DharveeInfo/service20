/** Minimal stub interceptor for ViewContainer compile/run without full EM API stack. */
type InterceptorArgs = {
	url: string;
	data?: Record<string, unknown>;
	allowShowLoader?: boolean;
	setFetchData?: (response: unknown, status?: string) => void;
};

const axiosInterceptor = async (args: InterceptorArgs, _statusBarContext?: unknown): Promise<void> => {
	args.setFetchData?.(null, "0");
};

export { axiosInterceptor };
