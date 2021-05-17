import ItemService from "@/services/ItemService";
import MatrixService from "@/services/MatrixService";
import StageService from "@/services/StageService";
import { useRequest, useModel } from "umi";
import { IPenguinItem } from "./useItem";
import { IPenguin } from "./usePenguin";
import { IPenguinStage } from "./useStage";

export default function useServices(): { itemService: ItemService, stageService: StageService, matrixService: MatrixService, loading: boolean } {
  const penguinAPI = "https://penguin-stats.io/PenguinStats/api/v2/result/matrix";
  const localAPI = "/api/penguin.json";
  const { data: matrix, loading: loadingMatrix } = useRequest(localAPI, { formatResult: res => res.matrix });

  const { data: items, loading: loadingItem } = useRequest("/dat/items.json");

  const { data: stages, loading: loadingStage } = useRequest("/dat/stages.json");

  const itemService = new ItemService(items);
  const stageService = new StageService(stages);

  const matrixService = new MatrixService(matrix, itemService, stageService);

  return {
    itemService: itemService,
    stageService: stageService,
    matrixService: matrixService,
    loading: loadingItem || loadingStage || loadingMatrix
  };
}
