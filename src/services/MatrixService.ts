import { IPenguinEntry, IPenguinItem } from '@/models/typeRefs';
import ItemService from './ItemService';
import StageService from './StageService';

export default class MatrixService {
  private readonly matrix: IPenguinEntry[];

  private readonly itemService: ItemService;
  private readonly stageService: StageService;

  readonly ready: boolean;

  constructor(
    origMatrix: IPenguinEntry[],
    itemService: ItemService,
    stageService: StageService,
  ) {
    this.itemService = itemService;
    this.stageService = stageService;

    if (origMatrix === undefined || !itemService.ready || !stageService.ready) {
      this.matrix = [];
      this.ready = false;
      return;
    }

    this.matrix = origMatrix
      .filter((p) => p.times > 300)
      .filter((p) => itemService.hasItemId(p.itemId))
      .filter((p) => stageService.hasStageId(p.stageId));

    this.calculate();
    this.ready = true;
  }

  private calculate() {
    this.matrix.forEach((p, idx, arr) => {
      arr[idx].item = this.itemService.getItemByItemId(p.itemId);
      arr[idx].stage = this.stageService.getStageByStageId(p.stageId);
      arr[idx].probability = p.quantity / p.times;
      arr[idx].expectation = (p.stage?.apCost || 0) / p.probability;
      arr[idx].request = (p.item?.price || 0) * p.probability;
    });

    const validStages = new Set();
    this.matrix.forEach((p) => validStages.add(p.stage));

    const utilizeReq = (reqSum: number, apCost: number) =>
      (reqSum + (apCost * 12) / 200) / apCost;

    validStages.forEach((s) => {
      const reqSum = this.matrix
        .filter((p) => p.stage === s)
        .map((p) => p.request)
        .reduce((p1, p2) => p1 + p2, 0);

      this.matrix
        .filter((p) => p.stage === s)
        .forEach((p, idx, arr) => {
          arr[idx].reqSum = reqSum;
          arr[idx].utilizationRate = utilizeReq(reqSum, p.stage?.apCost || 18);
          // arr[idx].mainItem = this.matrix[0].item;
        });
    });
  }

  /**
   * getEfficientPagesByItem
   */
  public getEfficientPagesByItem(item: IPenguinItem) {
    return (
      this.matrix
        // .filter((p) => p.mainItem === item)
        .filter((p) => p.item === item)
        .filter((p) => p.expectation < 180)
        .filter((p) => p.utilizationRate > 1.17)
        .sort((p1, p2) => p2.utilizationRate - p1.utilizationRate)
        .slice(0, 4)
    );
  }

  /**
   * getEconomicPagesByItem
   */
  public getEconomicPagesByItem(item: IPenguinItem) {
    return this.matrix
      .filter((p) => p.item === item)
      .filter((p) => p.expectation < 180)
      .sort((p1, p2) => p2.utilizationRate - p1.utilizationRate)
      .slice(0, 4);
  }
}
