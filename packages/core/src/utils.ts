export const handle = <TReturn>(fn: () => Promise<TReturn> | TReturn) => {
	return async <TError = unknown>() => {
		try {
			return { success: true, data: await fn() } as const;
		} catch (err) {
			return { success: false, error: err as TError } as const;
		}
	};
};

export const negate = async (predicate: Promise<boolean>) => !(await predicate);
