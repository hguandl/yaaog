import styles from './index.less';
import { FC } from 'react';
import { Tooltip, Space } from 'antd';
import { magenta, orange, blue } from '@ant-design/colors';
import { IAogStage } from '@/models/useAog';

const mapColorStyle = (colorName: string): string | undefined => {
  switch (colorName) {
    case 'red':
      return magenta.primary;
    case 'orange':
      return orange.primary;
    case 'blue':
      return blue.primary;
    default:
      return undefined;
  }
};

const StageName: FC<{ stage: IAogStage }> = ({ stage }) => (
  <div
    style={{
      fontSize: '2.5rem',
      fontWeight: 'bold',
      color: mapColorStyle(stage.color),
    }}
  >
    {stage.stage}
  </div>
);

const StageData: FC<{ stage: IAogStage }> = ({ stage }) => (
  <div
    style={{
      fontSize: '0.8rem',
      lineHeight: '125%',
      color: mapColorStyle(stage.color),
    }}
  >
    <Tooltip title="关卡效率" placement="top">
      <span>{`${(stage.efficiency * 100).toFixed(1)}%`}</span>
    </Tooltip>
    <br />
    <Tooltip title="关卡绝对效率" placement="right">
      {stage.absEff.toFixed(3)}
    </Tooltip>
    <br />
    <Tooltip title="期望理智" placement="bottom">
      {stage.expectation.toFixed(1)}
    </Tooltip>
  </div>
);

const StageCell: FC<{ stage: IAogStage }> = ({ stage }) => (
  <Space>
    <StageName stage={stage} />
    <StageData stage={stage} />
  </Space>
);

export default StageCell;
