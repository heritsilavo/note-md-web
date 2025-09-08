export async function fetchApi(input: string | URL | Request, init?: RequestInit) {
  let url: string | URL | Request = input;
  if (typeof input === "string" && input.startsWith("/")) {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "";
    url = baseUrl.replace(/\/$/, "") + input;
  }
  const response = await fetch(url, init);
  if (!response.ok) {
    console.log("fetchApi error response:", response);
    
    const errorText = await response.text();
    
    throw new Error(errorText)
  }
  return response;
}
