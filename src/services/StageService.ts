import { IPenguinStage } from '@/models/typeRefs';

export default class StageService {
  private readonly stages: IPenguinStage[];

  readonly ready: boolean;

  constructor(stageList: IPenguinStage[]) {
    this.stages = stageList || [];
    this.ready = stageList && stageList.length > 0;
  }

  public getStageByStageId(stageId: string) {
    return this.stages.find((stage) => stage.stageId === stageId);
  }

  public hasStageId(stageId: string) {
    return this.getStageByStageId(stageId) !== undefined;
  }
}
