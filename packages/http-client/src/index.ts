export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}
export async function requestJson<T = unknown>(
  url: string,
  options: RequestInit = {},
  requestId: string = crypto.randomUUID(),
): Promise<T> {
  const response = await fetch(url, {
    ...options,
    signal: AbortSignal.timeout(5000),
    headers: {
      "content-type": "application/json",
      "x-request-id": requestId,
      ...options.headers,
    },
  });
  const data = await response.json();
  if (!response.ok)
    throw new HttpError(
      response.status,
      data.error ?? data.detail ?? `HTTP ${response.status}`,
    );
  return data as T;
}
