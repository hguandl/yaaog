import styles from './index.less';
import { Layout } from 'antd';
import { Link, useIntl } from 'umi';
import { Row, Col, Switch, Typography } from 'antd';
import { FC, useState, cloneElement } from 'react';
import { IRouteComponentProps } from 'umi';

const { Header, Content, Footer } = Layout;

const BasicLayout: FC<IRouteComponentProps> = ({ children }) => {
  const intl = useIntl();

  const [currency, setCurrency] = useState('green');

  const [lastModified, setLastModified] = useState(0);

  const updateTimeString = (lastModified: number): string => {
    const date = new Date(lastModified);
    return date.toLocaleString();
  };

  const switchCurrency = (): void => {
    if (currency === 'green') {
      setCurrency('orange');
    } else {
      setCurrency('green');
    }
  };

  return (
    <Layout>
      <Header style={{ position: 'fixed', width: '100%', minWidth: 320 }}>
        <Row gutter={16}>
          <Col>
            <Link to="/" className={styles.logo}>
              {intl.formatMessage({ id: 'LOGO_TEXT' })}
            </Link>
          </Col>
          <Col className={`${styles.mySwitch} ${styles.smallSwitchDisplay}`}>
            <Switch
              size="small"
              onChange={switchCurrency}
              checkedChildren="橙票"
              unCheckedChildren="绿票"
            />
          </Col>
          <Col className={`${styles.mySwitch} ${styles.switchDisplay}`}>
            <Switch
              onChange={switchCurrency}
              checkedChildren="橙票"
              unCheckedChildren="绿票"
            />
          </Col>
        </Row>
      </Header>
      <Content style={{ padding: '0 3%' }}>
        <div style={{ marginTop: 54, padding: 24, minHeight: 280 }}>
          {cloneElement(children, {
            currency: currency,
            setLastModified: setLastModified,
          })}
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        <Typography>
          <Typography.Paragraph>
            数据来源 &nbsp;
            <Typography.Link href="https://github.com/Dimbreath/ArknightsData">
              ArknightsData
            </Typography.Link>
            &nbsp;
            <Typography.Link href="https://penguin-stats.io">
              企鹅物流
            </Typography.Link>
          </Typography.Paragraph>
          {/* <Typography.Paragraph> */}
          {/* 更新时间：{updateTimeString(lastModified)} */}
          {/* </Typography.Paragraph> */}
          <Typography.Paragraph>
            感谢 &nbsp;
            <Typography.Link href="https://bbs.nga.cn/nuke.php?func=ucp&uid=60146242">
              山桜
            </Typography.Link>
            &nbsp;
            <Typography.Link href="https://bbs.nga.cn/nuke.php?func=ucp&uid=37746312">
              根派
            </Typography.Link>
          </Typography.Paragraph>
          <Typography.Paragraph>Copyright © hguandl 2021.</Typography.Paragraph>
        </Typography>
      </Footer>
    </Layout>
  );
};

export default BasicLayout;
