import { IPenguin } from "@/models/usePenguin";
import { useModel } from "umi";
import ItemService from "./ItemService";
import StageService from "./StageService";

export default class MatrixService {
  readonly matrix: IPenguin[];

  readonly itemService: ItemService;
  readonly stageService: StageService;

  constructor(origMatrix: IPenguin[]) {
    const { itemService, loading: loadingItem } = useModel("useItem");
    const { stageService, loading: loadingStage } = useModel("useStage");

    this.itemService = itemService;
    this.stageService = stageService;

    if (loadingItem || loadingStage || origMatrix === undefined) {
      this.matrix = [];
      return;
    }

    this.matrix = origMatrix
    .filter(p => p.times > 300)
    .filter(p => itemService.hasItemId(p.itemId))
    .filter(p => stageService.hasStageId(p.stageId));;
  }
}
