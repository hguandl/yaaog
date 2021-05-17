import styles from './index.less';
import { FC } from 'react';
import { Space, Divider } from "antd";
import { IAogEntry } from '@/models/useMatrix';
import StageCell from "@/components/StageCell";
import ItemCell from "@/components/ItemCell";

const ItemRow: FC<{ entires: IAogEntry[] | undefined, currency: string }> = ({ entires, currency }) => {
  const t4Item = entires?.find(e => e.tier === 4);
  const t3Item = entires?.find(e => e.tier === 3);
  const t2Item = entires?.find(e => e.tier === 2);

  return (
    <div>
      <Space size="large">
        <ItemCell item={t4Item} currency={currency} />
        <ItemCell item={t3Item} currency={currency} />
        <div className={styles.viewPort}>
          <Space size="large" style={{ minWidth: 160 * (t3Item?.stages.length || 0) }}>
            {
              t3Item?.stages.map(s =>
                <StageCell stage={s} key={s.stage} />
              )
            }
          </Space>
        </div>
        {t2Item && <ItemCell item={t2Item} currency={currency} className={styles.t2Display} />}
        {t2Item &&
          <div className={`${styles.t2ScollView} ${styles.t2Display}`}>
            <Space size="large" style={{ minWidth: 160 * (t2Item?.stages.length || 0) }}>
              {
                t2Item?.stages.map(s =>
                  <StageCell stage={s} key={s.stage} />
                )
              }
            </Space>
          </div>
        }
      </Space>
      <Divider />
    </div>
  )
};

export default ItemRow;
