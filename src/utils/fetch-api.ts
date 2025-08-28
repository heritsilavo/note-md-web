export async function fetchApi(input: string | URL | Request, init?: RequestInit) {
  let url: string | URL | Request = input;
  if (typeof input === "string" && input.startsWith("/")) {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "";
    url = baseUrl.replace(/\/$/, "") + input;
  }
  try {
    const response = await fetch(url, init);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    return response;
  } catch (error) {
    // Log l'erreur pour le debug
    console.error('API fetch error:', error);
    throw error;
  }
}
