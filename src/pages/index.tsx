import styles from './index.less';
import { Skeleton, Space, Divider } from "antd";
import { useModel } from 'umi';
import { IAogEntry } from '@/models/useMatrix';
import ItemRow from '@/components/ItemRow';
import ItemCell from "@/components/ItemCell";
import StageCell from "@/components/StageCell";
import { IPenguinItem } from '@/models/useItem';
import { IPenguinStage } from '@/models/useStage';

interface IHeaderData {
  currency: string
  setLastModified: React.Dispatch<React.SetStateAction<number>>
}

export default function IndexPage({ currency, setLastModified }: IHeaderData) {
  const { data: penguin, loading: loading1 } = useModel("usePenguin");

  const { data: items, loading: loading2 } = useModel("useItem");
  const { data: stages, loading: loading3 } = useModel("useStage");

  const { data, loading } = useModel("useMatrix");

  if (loading || loading1 || loading2 || loading3) {
    return <Skeleton active />
  }

  const itemMap = new Map<string, IPenguinItem>();
  items.forEach(i => itemMap.set(i.itemId, i));

  const stageMap = new Map<string, IPenguinStage>();
  stages.forEach(s => stageMap.set(s.stageId, s));

  const validPages = penguin
    .filter(p => p.times > 300)
    .filter(p => itemMap.has(p.itemId))
    .filter(p => stageMap.has(p.stageId));

  validPages.forEach((p, idx, arr) => {
    arr[idx].item = itemMap.get(p.itemId);
    arr[idx].stage = stageMap.get(p.stageId);
    arr[idx].probability = p.quantity / p.times;
    arr[idx].expectation = (p.stage?.apCost || 0) / p.probability;
    arr[idx].request = (p.item?.price || 0) * p.probability;
  })

  console.log(validPages);

  setLastModified(data.lastModified);

  const itemGroups = new Map<number, IAogEntry[]>();

  data.matrix.forEach(e => {
    if (e.group === 0) {
      return;
    }
    if (!itemGroups.has(e.group)) {
      itemGroups.set(e.group, []);
    }
    itemGroups.get(e.group)?.push(e);
  });

  const groupOrder = [
    10, 8, 9, 1, 5, 4, 6, 7, 3, 2, 101, 102, 103
  ];

  return (
    <div>
      {
        groupOrder.map(g => itemGroups.get(g)).map(v =>
          <ItemRow entires={v} currency={currency} />
        )
      }
      {
        data.matrix.filter(e => e.tier === 2).map(v =>
          <div className={styles.t2Display}>
            <Space size="large">
              <ItemCell item={v} currency={currency} />
              <div className={styles.viewPort}>
                <Space size="large" style={{ minWidth: 160 * (v?.stages.length || 0) }}>
                  {
                    v?.stages.map(s =>
                      <StageCell stage={s} />
                    )
                  }
                </Space>
              </div>
            </Space>
            <Divider />
          </div>
        )
      }
    </div>
  );
}
