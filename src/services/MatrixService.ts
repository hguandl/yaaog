import { IPenguin } from "@/models/usePenguin";
import { useModel } from "umi";
import ItemService from "./ItemService";
import StageService from "./StageService";

export default class MatrixService {
  readonly matrix: IPenguin[];

  private readonly itemService: ItemService;
  private readonly stageService: StageService;

  constructor(origMatrix: IPenguin[], itemService: ItemService, stageService: StageService) {
    this.itemService = itemService;
    this.stageService = stageService;

    if (origMatrix === undefined) {
      this.matrix = [];
      return;
    }

    console.log(origMatrix);

    this.matrix = origMatrix
    .filter(p => p.times > 300)
    .filter(p => itemService.hasItemId(p.itemId))
    .filter(p => stageService.hasStageId(p.stageId));

    this.calculate();
  }

  private calculate() {
    const validStages = new Set();
    this.matrix.forEach(p => validStages.add(p.stage));

    const utilizeReq = (reqSum: number, apCost: number) => (
      (reqSum + apCost * 12 / 200) / apCost
    );

    validStages.forEach(s => {
      const reqSum = this.matrix
        .filter(p => p.stage === s)
        .map(p => p.request)
        .reduce((p1, p2) => p1 + p2, 0);

      this.matrix
        .filter(p => p.stage === s)
        .forEach((p, idx, arr) => {
          arr[idx].reqSum = reqSum;
          arr[idx].utilizationRate = utilizeReq(reqSum, p.stage?.apCost || 18);
        });
    });
  }
}
