import React from 'react';
import { WebView } from '@tarojs/components';

import { useRouter } from '@tarojs/taro';

const Index = () => {
  const {
    params: { url }
  } = useRouter();

  return <WebView src={url} />;
};

export default Index;
