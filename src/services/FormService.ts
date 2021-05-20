import { IPenguinItem, IPenguinEntry } from '@/models/typeRefs';
import { IAogEntry } from '@/models/useAog';
import ItemService from './ItemService';
import MatrixService from './MatrixService';

export default class FormService {
  private readonly itemStageEntries: Map<IPenguinItem, IPenguinEntry[]>;

  private readonly greenRatios: Map<IPenguinItem, number>;

  private readonly itemValues: Map<IPenguinItem, number>;

  private readonly matrixService: MatrixService;
  private readonly itemService: ItemService;

  readonly ready: boolean;

  constructor(matrixService: MatrixService, itemService: ItemService) {
    this.itemStageEntries = new Map<IPenguinItem, IPenguinEntry[]>();
    this.greenRatios = new Map<IPenguinItem, number>();
    this.itemValues = new Map<IPenguinItem, number>();

    this.matrixService = matrixService;
    this.itemService = itemService;

    this.ready = false;
    if (itemService.ready && matrixService.ready) {
      this.calculate();
      this.ready = true;
    }
  }

  private calculate() {
    // 材料关卡效率计算
    this.itemService.getItemGroups().forEach((group) => {
      const t3Item = this.itemService.getItemByGroupAndTier(group, 3)!;

      this.itemStageEntries.set(
        t3Item,
        this.matrixService.getEfficientPagesByItem(t3Item),
      );

      const t2Item = this.itemService.getItemByGroupAndTier(group, 2);
      t2Item &&
        this.itemStageEntries.set(
          t2Item,
          this.matrixService.getEfficientPagesByItem(t2Item),
        );

      // 固源岩系列, group 为 1
      if (1 === group) {
        const t3Entries = this.itemStageEntries.get(t3Item)!;
        t3Entries.unshift(this.itemStageEntries.get(t2Item!)![0]);
        t3Entries.pop();
      }
    });
    // 绿票性价比以全新装置为基准
    const baseline = this.itemStageEntries.get(
      this.itemService.getItemByName('全新装置')!,
    )![0].utilizationRate;
    this.itemService.getItemsByTier(3).forEach((t3Item) => {
      const costRatio =
        baseline / this.itemStageEntries.get(t3Item)![0].utilizationRate;
      this.greenRatios.set(t3Item, costRatio);
    });

    // T3 材料价值
    this.greenRatios.forEach((ratio, item) =>
      this.itemValues.set(item, item.price * ratio),
    );

    // 合成副产物价值
    const buildValue =
      this.itemService
        .getItemsByTier(3)
        .map((item) => this.itemValues.get(item)! * item.buildValue)
        .reduce((v1, v2) => v1 + v2, 0) *
        0.2 -
      1.5;

    // T4 材料价值
    this.itemService.getItemsByTier(4).forEach((t4Item) => {
      const value = t4Item.formula
        .map(
          (f) =>
            this.itemValues.get(this.itemService.getItemByItemId(f.itemId)!)! *
            f.count,
        )
        .reduce((v1, v2) => v1 + v2, -buildValue);

      this.itemValues.set(t4Item, value);
    });
  }

  /**
   * summary
   */
  public summary() {
    return this.itemService.getAllItems().map((item) => {
      let aogData: IAogEntry = {
        name: item.name,
        group: item.group,
        tier: item.tier,
        stages: [],
        greenRatio: 0,
        orangeRatio: 0,
        creditRatio: 0,
        actShopRatio: 0,
      };

      if (item.tier >= 2 && item.tier <= 3) {
        const baseline =
          item.tier === 3
            ? // T3 蓝材料效率以最高效副本为基准
              this.itemStageEntries.get(item)?.[0]?.utilizationRate
            : // T2 绿材料效率以固源岩最高效副本（1-7）为基准
              this.itemStageEntries.get(
                this.itemService.getItemByName('固源岩')!,
              )?.[0]?.utilizationRate;

        // 设置关卡效率
        this.itemStageEntries.get(item)?.forEach((entry) => {
          const relative = entry.utilizationRate / (baseline || 1);
          aogData.stages.push({
            stage: entry.stage?.code || '',
            efficiency: relative,
            absEff: entry.utilizationRate,
            expectation: entry.expectation,
            color: '',
          });
        });

        // 设置关卡颜色
        aogData.stages
          .filter((s) => s.efficiency > 0.9)
          .forEach((s) => (s.color = 'orange'));

        aogData.stages.reduce((s1, s2) =>
          s1.expectation < s2.expectation ? s1 : s2,
        ).color = 'blue';

        aogData.stages[0].color = 'red';
      }

      if (item.tier === 3) {
        aogData.greenRatio = this.greenRatios.get(item) || 0;
      }

      if (item.tier >= 3 && item.tier <= 4) {
        aogData.orangeRatio =
          (this.itemValues.get(item) || 0) / item.orangePrice;
      }

      // TODO: 设置信用商店性价比
      aogData.creditRatio = 0;

      // TODO: 设置活动商店性价比
      aogData.actShopRatio = 0;

      return aogData;
    });
  }
}
