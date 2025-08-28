import { CustomError } from '@heritsilavo/react-error-boundary/next';

export async function fetchApi(input: string | URL | Request, init?: RequestInit) {
  let url: string | URL | Request = input;
  if (typeof input === "string" && input.startsWith("/")) {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "";
    url = baseUrl.replace(/\/$/, "") + input;
  }
  const response = await fetch(url, init);
  if (!response.ok) {
    const errorText = await response.text();
    const errorJson = {error: errorText};
    try {
        Object.assign(errorJson, JSON.parse(errorText));
    } catch {}
        
    throw new CustomError(String(response.status) || "ERROR", errorJson.error, "");
  }
  return response;
}
