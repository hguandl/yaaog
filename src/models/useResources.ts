import { useRequest, useModel } from "umi";
import { IPenguinItem } from "./useItem";
import { IPenguin } from "./usePenguin";
import { IPenguinStage } from "./useStage";

export default function useResources(): { items: IPenguinItem[], stages: IPenguinStage[], matrix:IPenguin[], loading: boolean } {
  const penguinAPI = "https://penguin-stats.io/PenguinStats/api/v2/result/matrix";
  const localAPI = "/api/penguin.json";
  const { data: matrix, loading: loading1 } = useRequest(localAPI, { formatResult: res => res.matrix });

  const { data: items, loading: loading2 } = useRequest("/dat/items.json");

  const { data: stages, loading: loading3 } = useRequest("/dat/stages.json");

  return {
    items: items,
    stages: stages,
    matrix: matrix,
    loading: loading1 || loading2 || loading3
  };
}
