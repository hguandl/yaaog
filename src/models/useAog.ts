import { useModel } from "umi";

export default function useAog(): { data: any, loading: boolean } {
  const { itemService, loading: loading1 } = useModel("useItem");
  const { stageService, loading: loading2 } = useModel("useStage");
  const { matrix, loading } = useModel("useResources");


  if (loading || loading1 || loading2) {
    return { data: { matrix: [], lastModified: 0 }, loading: true };
  }

  const validPages = matrix
    .filter(p => p.times > 300)
    .filter(p => itemService.hasItemId(p.itemId))
    .filter(p => stageService.hasStageId(p.stageId));

  validPages.forEach((p, idx, arr) => {
    arr[idx].item = itemService.getItemByItemId(p.itemId);
    arr[idx].stage = stageService.getStageByStageId(p.stageId);
    arr[idx].probability = p.quantity / p.times;
    arr[idx].expectation = (p.stage?.apCost || 0) / p.probability;
    arr[idx].request = (p.item?.price || 0) * p.probability;
  })

  const validStages = new Set();
  validPages.forEach(p => validStages.add(p.stage));

  const utilizeReq = (reqSum: number, apCost: number) => (
    (reqSum + apCost * 12 / 200) / apCost
  );

  validStages.forEach(s => {
    const reqSum = validPages
      .filter(p => p.stage === s)
      .map(p => p.request)
      .reduce((p1, p2) => p1 + p2, 0);

    validPages
      .filter(p => p.stage === s)
      .forEach((p, idx, arr) => {
        arr[idx].reqSum = reqSum;
        arr[idx].utilizationRate = utilizeReq(reqSum, p.stage?.apCost || 18);
      });
  })

  itemService.getItemGroups().forEach(group => {
    const t3Item = itemService.getItemByGroupAndTier(group, 3);

  })

  const result = validPages
    .slice(0, 4);


  return {
    data: result,
    loading: loading,
  };
}
