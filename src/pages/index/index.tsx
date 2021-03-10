import React, { useState, useEffect } from 'react';
import { setNavigationBarTitle } from '@tarojs/taro';
import { View } from '@tarojs/components';

import { getToplist, getPersonalized } from '../../utils/api';
import { toplistItem, recommemdListItem } from '../../types';
import ListItem from './ListItem';
import Banner from '../../components/Banner';
import './index.scss';

const Index = () => {
  const [toplist, setToplist] = useState<toplistItem[]>([]);
  const [recommendList, setRecommendList] = useState<recommemdListItem[]>([]);
  setNavigationBarTitle({
    title: `首页`
  });
  useEffect(() => {
    getToplist()
      .then(res => {
        console.log(res.data);
        if (res.data.code === 200) {
          setToplist(res.data.list);
        }
      })
      .catch(err => {
        console.log(err);
      });

    getPersonalized()
      .then(res => {
        console.log(res.data);
        if (res.data.code === 200) {
          setRecommendList(res.data.result);
        }
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  return (
    <View>
      <Banner></Banner>
      <View className='list-container'>
        {recommendList
          ? recommendList.map((item, index) => (
              <ListItem type='recommemdlist' key={index} {...item} />
            ))
          : null}
      </View>
      <View className='list-container'>
        {toplist
          ? toplist.map((item, index) => (
              <ListItem type='toplist' key={index} {...item} />
            ))
          : null}
      </View>
    </View>
  );
};

export default Index;
