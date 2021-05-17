import { IPenguinStage } from '@/models/typeRefs';

export default class StageService {
  readonly stages: IPenguinStage[];

  constructor(stageList: IPenguinStage[]) {
    this.stages = stageList || [];
  }

  public getStageByStageId(stageId: string) {
    return this.stages.find((stage) => stage.stageId === stageId);
  }

  public hasStageId(stageId: string) {
    return this.getStageByStageId(stageId) !== undefined;
  }
}
