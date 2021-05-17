export interface IPenguinItem {
  itemId: string,
  name: string,
  price: number,
  tier: number,
  group: number,
  orangePrice: number,
  formula: object
}

export interface IPenguinStage {
  stageId: string,
  code: string,
  name: string,
  apCost: number
}

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
