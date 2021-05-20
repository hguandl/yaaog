import FormService from '@/services/FormService';
import ItemService from '@/services/ItemService';
import MatrixService from '@/services/MatrixService';
import StageService from '@/services/StageService';
import { useRequest } from 'umi';

export default function useServices(): {
  itemService: ItemService;
  stageService: StageService;
  matrixService: MatrixService;
  formService: FormService;
  loading: boolean;
} {
  const penguinAPI =
    'https://penguin-stats.io/PenguinStats/api/v2/result/matrix';
  const localAPI = '/api/penguin.json';
  const { data: matrix, loading: loadingMatrix } = useRequest(penguinAPI, {
    formatResult: (res) => res.matrix,
  });

  const { data: items, loading: loadingItem } = useRequest('/dat/items.json');

  const { data: stages, loading: loadingStage } =
    useRequest('/dat/stages.json');

  const itemService = new ItemService(items);
  const stageService = new StageService(stages);

  const matrixService = new MatrixService(matrix, itemService, stageService);
  const formService = new FormService(matrixService, itemService);

  return {
    itemService: itemService,
    stageService: stageService,
    matrixService: matrixService,
    formService: formService,
    loading: loadingItem || loadingStage || loadingMatrix,
  };
}
