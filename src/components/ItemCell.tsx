import { FC } from 'react';
import { Tooltip } from 'antd';
import { IAogEntry } from '@/models/useAog';
import { magenta, orange, blue } from '@ant-design/colors';

const mapColorStyle = (ratio: number) => {
  if (ratio >= 0.98) {
    return magenta.primary;
  }
  if (ratio >= 0.95) {
    return orange.primary;
  }
  if (ratio >= 0.93) {
    return blue.primary;
  }
  return undefined;
};

const showDecimal = (num?: number): string =>
  num && num > 0 ? num.toFixed(3) : '-';

const ItemCell: FC<{
  item?: IAogEntry;
  currency: string;
  className?: string;
}> = ({ item, currency, className }) => {
  if (item === undefined) {
    return null;
  }

  const cost = currency === 'green' ? item.greenRatio : item.orangeRatio;
  const ratio = currency === 'green' ? item.greenRatio : item.orangeRatio / 1.5;

  return (
    <div style={{ textAlign: 'center' }} className={className}>
      <Tooltip title={item?.name} placement="bottom">
        <img width={48} src={`/img/${item?.name}.png`} />
      </Tooltip>
      <br />
      <span style={{ color: mapColorStyle(ratio) }}>{showDecimal(cost)}</span>
    </div>
  );
};

export default ItemCell;
