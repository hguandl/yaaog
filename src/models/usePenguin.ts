import { useRequest, RequestConfig } from "umi";
import { IPenguinItem } from "./useItem";
import { IPenguinStage } from "./useStage";

export interface IPenguin {
  stageId: string,
  itemId: string,
  quantity: number,
  times: number,
  start: number,
  end: number,

  stage?: IPenguinStage,
  item?: IPenguinItem,
  mainItem?: IPenguinItem,

  request: number,
  probability: number,
  expectation: number,

  reqSum: number,
  utilizationRate: number
}

export default function usePenguin(): { data: IPenguin[], loading: boolean } {
  const penguinAPI = "https://penguin-stats.io/PenguinStats/api/v2/result/matrix";
  const localAPI = "/api/penguin.json";

  const { data, loading } = useRequest(localAPI, { formatResult: res => res.matrix });

  return {
    data: data,
    loading: loading,
  };
}
