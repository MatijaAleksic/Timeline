import { FetchRestClient } from "@/api/clients/FetchRestClient";
import { EventDTO } from "@/api/DTO/EventDTO";
import { ApiUtil } from "@/util/constants/Configs/ApiUtil";

class ReusableEventClient {
  private static _client: FetchRestClient;

  public static getClient(
    baseURL: string,
    defaultHeaders: Record<string, string> = {}
  ) {
    if (!ReusableEventClient._client) {
      ReusableEventClient._client = new FetchRestClient(
        baseURL,
        defaultHeaders
      );
    }
    return ReusableEventClient._client;
  }
}

class EventInterface {
  private _client = ReusableEventClient.getClient(
    process.env.NEXT_PUBLIC_API_BASE_URL || "",
    {
      // If you need default headers like subscription keys, add here
      // "Ocp-Apim-Subscription-Key": PublicRuntimeConfig.config.subscriptionKey,
      ...ApiUtil.transformDefaultParams({}), // If these are headers, spread here
    }
  );

  public GetEvents = async (): Promise<EventDTO[]> => {
    return this._client.get<EventDTO[]>("/api/events");
  };

  // Similarly, for other methods (example for POST):
  // public PostCompactDocumentV1 = (entry: DocumentInsertDto) => {
  //   return this._client.post<DocumentDto>("/v1/document", entry, {
  //     headers: ApiUtil.transformDefaultParams(defaults),
  //   });
  // };
}

export { EventInterface };
