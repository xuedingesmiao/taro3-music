import React from 'react';
import { View, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { toplistItem, recommemdListItem } from '../../types';

interface topItem extends toplistItem {
  type: 'toplist';
}
interface recommemdItem extends recommemdListItem {
  type: 'recommemdlist';
}
type listItem = topItem | recommemdItem;

const ListItem: React.FC<listItem> = props => {
  const goPlayListPage = (listId: number) => {
    Taro.navigateTo({
      url: `/pages/PlayList/index?id=${listId}`
    });
  };
  return (
    <View
      className='list-item span33'
      onClick={() => {
        goPlayListPage(props.id);
      }}
    >
      <View className='list-item-cover'>
        {props.type === 'toplist' ? (
          <Image src={props.coverImgUrl}></Image>
        ) : (
          <Image src={props.picUrl}></Image>
        )}
      </View>
      <View className='list-item-name'>{props.name}</View>
    </View>
  );
};

export default ListItem;
