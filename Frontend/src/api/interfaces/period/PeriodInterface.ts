import { FetchRestClient } from "@/api/clients/FetchRestClient";
import { CreatePeriodDTO, PeriodTableDTO, UpdatePeriodDTO } from "@/api/DTO";
import { PeriodDTO } from "@/api/DTO/PeriodDTO";
import { ApiUtil } from "@/util/constants/Configs/ApiUtil";
import Routes from "@/util/constants/ApiRoutes";
import { TableSortDirection } from "@/util/constants/TableConstants";
import { PeriodTableHeadersSort } from "@/util/constants/PeriodConstant";

class ReusablePeriodClient {
  private static _client: FetchRestClient;

  public static getClient(
    baseURL: string,
    defaultHeaders: Record<string, string> = {}
  ) {
    if (!ReusablePeriodClient._client) {
      ReusablePeriodClient._client = new FetchRestClient(
        baseURL,
        defaultHeaders
      );
    }
    return ReusablePeriodClient._client;
  }
}

class PeriodInterface {
  private _client = ReusablePeriodClient.getClient(
    process.env.NEXT_PUBLIC_API_BASE_URL || "",
    {
      // If you need default headers like subscription keys, add here
      // "Ocp-Apim-Subscription-Key": PublicRuntimeConfig.config.subscriptionKey,
      ...ApiUtil.transformDefaultParams({}), // If these are headers, spread here
    }
  );

  public GetPeriods = async (
    pageNumber: number,
    pageSize: number,
    searchString: string = "",
    sortColumn: PeriodTableHeadersSort,
    sortDirection: TableSortDirection
  ): Promise<PeriodTableDTO> => {
    return this._client.get<PeriodTableDTO>(
      `${Routes.PERIODS}/?pageNumber=${pageNumber}&pageSize=${pageSize}&searchString=${searchString}&sortColumn=${sortColumn}&sortDirection=${sortDirection}`
    );
  };

  public PostPeriod = async (period: CreatePeriodDTO): Promise<PeriodDTO> => {
    return this._client.post(Routes.PERIODS, period);
  };

  public PutPeriod = async (
    period: UpdatePeriodDTO,
    id: string
  ): Promise<PeriodDTO> => {
    return this._client.put(Routes.PERIODS + `/${id}`, period);
  };

  public DeletePeriod = async (id: string): Promise<PeriodDTO> => {
    return this._client.delete(Routes.PERIODS + `/${id}`);
  };
}

export { PeriodInterface };
