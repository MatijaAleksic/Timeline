import { FetchRestClient } from "@/api/clients/FetchRestClient";
import { CreateEventDTO, EventTableDTO, UpdateEventDTO } from "@/api/DTO";
import { EventDTO } from "@/api/DTO/EventDTO";
import { ApiUtil } from "@/util/constants/Configs/ApiUtil";
import Routes from "@/util/constants/ApiRoutes";
import { EventTableHeadersSort } from "@/util/constants/EventConstants";
import { TableSortDirection } from "@/util/constants/TableConstants";

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

  public GetEvents = async (
    pageNumber: number,
    pageSize: number,
    searchString: string = "",
    sortColumn: EventTableHeadersSort,
    sortDirection: TableSortDirection
  ): Promise<EventTableDTO> => {
    return this._client.get<EventTableDTO>(
      `${Routes.EVENTS}/?pageNumber=${pageNumber}&pageSize=${pageSize}&searchString=${searchString}&sortColumn=${sortColumn}&sortDirection=${sortDirection}`
    );
  };

  public PostEvent = async (event: CreateEventDTO): Promise<EventDTO> => {
    return this._client.post(Routes.EVENTS, event);
  };

  public PutEvent = async (
    event: UpdateEventDTO,
    id: string
  ): Promise<EventDTO> => {
    return this._client.put(Routes.EVENTS + `/${id}`, event);
  };

  public DeleteEvent = async (id: string): Promise<EventDTO> => {
    return this._client.delete(Routes.EVENTS + `/${id}`);
  };

  // Similarly, for other methods (example for POST):
  // public PostCompactDocumentV1 = (entry: DocumentInsertDto) => {
  //   return this._client.post<DocumentDto>("/v1/document", entry, {
  //     headers: ApiUtil.transformDefaultParams(defaults),
  //   });
  // };
}

export { EventInterface };
