import { IPenguinStage } from "@/models/useStage";

export default class StageService {
  readonly stages: IPenguinStage[];

  constructor(stageList: IPenguinStage[]) {
    this.stages = stageList;

    if (stageList === undefined) {
      return;
    }
  }

  public getStageByStageId(stageId: string) {
    return this.stages
      .find(stage => stage.stageId === stageId);
  }

  public hasStageId(stageId: string) {
    return this.getStageByStageId(stageId) !== undefined;
  }
}
