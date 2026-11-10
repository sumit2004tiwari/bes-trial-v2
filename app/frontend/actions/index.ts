type RequestMethod = "GET" | "POST";
export const fetchApiHub = async (
  endpoint: string,
  method?: RequestMethod,
  payload = {}
) => {
  return handleApiResponse(
    fetch(endpoint, {
      method: method || "GET",
      credentials: "include",
      body: method == "GET" ? null : JSON.stringify(payload),
    })
  );
};

export class ResponseError extends Error {
  private readonly response: Response;

  constructor(response: Response) {
    super(`Got HTTP status code ${response.status} (${response.body})`);
    this.response = response;
  }

  getResponse() {
    return this.response;
  }

  getStatus() {
    return this.response.status;
  }
}

export const handleApiResponse = (
  fetchApiHubResponse: Promise<Response | ResponseError>
) => {
  return fetchApiHubResponse
    .then((response: Response) => {
      if (response.ok) {
        return response.json();
      }
      throw new ResponseError(response);
    })
    .catch(async (err: ResponseError) => {
      if (
        err &&
        typeof err.getStatus === "function" &&
        err.getStatus() === 404
      ) {
        return err;
      }
      if (err && err.getResponse) {
        const response: any = err.getResponse();
        let error: any;
        try {
          error = await response.json();
        } catch (e) {
          error = await response.text();
        }
        console.debug("error: ", error);
        console.debug("url: ", response.url);
        if (error?.["message"] && typeof error?.["message"] === "string") {
          response.errorMessage = error?.["message"];
        } else if (
          error?.error?.["message"] &&
          typeof error?.error?.["message"] === "string"
        ) {
          response.errorMessage = error?.error?.["message"];
        }
        return response;
      } else {
        // Log.error('Network error: ' + err)
        return "Network error: " + err;
      }
    })
    .then((response) => {
      if (response.error) {
        throw new Error(response.errorCode);
      }

      return response;
    });
};
