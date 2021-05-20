export interface IPenguinItem {
  itemId: string;
  name: string;
  price: number;
  tier: number;
  group: number;
  buildValue: number;
  orangePrice: number;
  formula: { itemId: string; count: number }[];
}

export interface IPenguinStage {
  stageId: string;
  code: string;
  name: string;
  apCost: number;
}

export interface IPenguinEntry {
  stageId: string;
  itemId: string;
  quantity: number;
  times: number;
  start: number;
  end: number;

  stage?: IPenguinStage;
  item?: IPenguinItem;
  mainItem?: IPenguinItem;

  request: number;
  probability: number;
  expectation: number;

  reqSum: number;
  utilizationRate: number;
}
