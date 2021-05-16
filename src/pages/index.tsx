import styles from './index.less';
import { Skeleton, Space, Divider } from "antd";
import { useModel } from 'umi';
import { IAogEntry } from '@/models/useMatrix';
import ItemRow from '@/components/ItemRow';
import ItemCell from "@/components/ItemCell";
import StageCell from "@/components/StageCell";

interface IHeaderData {
  currency: string
  setLastModified: React.Dispatch<React.SetStateAction<number>>
}

export default function IndexPage({ currency, setLastModified }: IHeaderData) {
  const { data, loading } = useModel("useMatrix");

  if (loading) {
    return <Skeleton active />
  }

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
          <div className={styles.t2ViewPort}>
            <Space size="large">
              <ItemCell item={v} currency={currency} className={styles.t2ViewPort} />
              <div className={`${styles.viewPort} ${styles.t2ViewPort}`}>
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
