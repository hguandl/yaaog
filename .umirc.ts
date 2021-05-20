import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  fastRefresh: {},
  locale: { antd: true, baseNavigator: false },
  favicon: '/assets/favicon.ico',
  links: [
    {
      rel: 'manifest',
      href: '/manifest.json',
    },
    {
      rel: 'apple-touch-icon',
      href: '/assets/logo192.webp',
    },
  ],
  metas: [
    {
      name: 'description',
      content: '明日方舟一图流-绿票算法',
    },
  ],
  title: '明日方舟一图流-绿票算法',
});
