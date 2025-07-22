type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface FetchRequestConfig {
  headers?: Record<string, string>;
  body?: any;
}

class FetchRestClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseURL: string, defaultHeaders: Record<string, string> = {}) {
    this.baseURL = baseURL;
    this.defaultHeaders = defaultHeaders;
  }

  private async request<T>(
    method: HttpMethod,
    url: string,
    options: FetchRequestConfig = {},
    retries = 3,
    retryDelay = 1000
  ): Promise<T> {
    const fullUrl = this.baseURL + url;

    const fetchOptions: RequestInit = {
      method,
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
      },
    };

    if (
      typeof fetchOptions.headers === "object" &&
      !Array.isArray(fetchOptions.headers)
    ) {
      const headersObj = fetchOptions.headers as Record<string, string>;

      if (!headersObj["Content-Type"]) {
        headersObj["Content-Type"] = "application/json";
      }
    }

    if (options.body !== undefined) {
      fetchOptions.body =
        typeof options.body === "string"
          ? options.body
          : JSON.stringify(options.body);

      if (
        typeof fetchOptions.headers === "object" &&
        !Array.isArray(fetchOptions.headers)
      ) {
        const headersObj = fetchOptions.headers as Record<string, string>;

        if (!headersObj["Content-Type"]) {
          headersObj["Content-Type"] = "application/json";
        }
      }
    }

    try {
      const response = await fetch(fullUrl, fetchOptions);
      if (!response.ok) {
        // Optionally handle non-2xx status codes here, throw error or retry
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // Assuming JSON response, you can enhance to handle other response types
      const data = (await response.json()) as T;
      return data;
    } catch (error) {
      if (retries > 0) {
        await new Promise((res) => setTimeout(res, retryDelay));
        return this.request<T>(
          method,
          url,
          options,
          retries - 1,
          retryDelay * 2
        );
      } else {
        throw error;
      }
    }
  }

  public get<T>(url: string, options?: FetchRequestConfig) {
    return this.request<T>("GET", url, options);
  }

  public post<T>(url: string, body?: any, options?: FetchRequestConfig) {
    return this.request<T>("POST", url, { ...options, body });
  }

  public put<T>(url: string, body?: any, options?: FetchRequestConfig) {
    return this.request<T>("PUT", url, { ...options, body });
  }

  public patch<T>(url: string, body?: any, options?: FetchRequestConfig) {
    return this.request<T>("PATCH", url, { ...options, body });
  }

  public delete<T>(url: string, options?: FetchRequestConfig) {
    return this.request<T>("DELETE", url, options);
  }
}

export { FetchRestClient };
