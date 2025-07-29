import { FetchRestClient } from "@/api/clients/FetchRestClient";
import {
  CreateEventDTO,
  EventTableDTO,
  TimelinePresentationLayerDTO,
  UpdateEventDTO,
} from "@/api/DTO";
import { EventDTO } from "@/api/DTO/EventDTO";
import { ApiUtil } from "@/util/constants/Configs/ApiUtil";
import Routes from "@/util/constants/ApiRoutes";
import { EventTableHeadersSort } from "@/util/constants/EventConstants";
import { TableSortDirection } from "@/util/constants/TableConstants";
import TimelineQueryDTO from "@/util/DTO/VirtualScrollDTO/QueryTimelineDTO";

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

class TimelineInterface {
  private _client = ReusableEventClient.getClient(
    process.env.NEXT_PUBLIC_API_BASE_URL || "",
    {
      // If you need default headers like subscription keys, add here
      // "Ocp-Apim-Subscription-Key": PublicRuntimeConfig.config.subscriptionKey,
      ...ApiUtil.transformDefaultParams({}), // If these are headers, spread here
    }
  );

  public GetTimelineElements = async (
    timelineQuery: TimelineQueryDTO
  ): Promise<TimelinePresentationLayerDTO> => {
    const queryParams = new URLSearchParams(
      Object.entries(timelineQuery).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null) {
          acc[key] = value.toString();
        }
        return acc;
      }, {} as Record<string, string>)
    ).toString();

    return this._client.get<TimelinePresentationLayerDTO>(
      `${Routes.TIMELINE}?${queryParams}`
    );
  };
}

export { TimelineInterface };
