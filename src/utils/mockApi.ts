export type MockResponse<T = unknown> = {
  ok: boolean;
  data?: T;
  message?: string;
};

export async function mockApi<T>(
  task: () => T,
  options: { delay?: number; shouldFail?: boolean; errorMessage?: string } = {}
): Promise<MockResponse<T>> {
  const { delay = 1200, shouldFail = false, errorMessage = "Something went wrong." } = options;

  await new Promise((resolve) => setTimeout(resolve, delay));

  if (shouldFail) {
    return { ok: false, message: errorMessage };
  }

  try {
    return { ok: true, data: task() };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : errorMessage,
    };
  }
}
