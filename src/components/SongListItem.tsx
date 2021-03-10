import React from 'react';
import { View } from '@tarojs/components';
import { navigateTo } from '@tarojs/taro';
import { useDispatch } from 'react-redux';
import {
  addPlayingSong,
  addPlayingSongIndex
} from '../store/reducer/songReducer';
import { trackItem } from '../types';

import './SongListItem.scss';

interface ListItem extends trackItem {
  dt: number; //歌曲时长
  onHandleMore: any;
  onHandleOpen: any;
  onHandleAddList: any;
}

const goPlayMusic = id => {
  navigateTo({ url: `/pages/PlayMusic/index?id=${id}` });
};

const SongListItem: React.FC<ListItem> = ({
  index,
  id,
  name,
  ar,
  al,
  dt,
  songUrl,
  onHandleMore,
  onHandleOpen,
  onHandleAddList
}) => {
  const dispatch = useDispatch();
  return (
    <View className='song-container'>
      <View className='song-index'>{index + 1}</View>
      <View
        className='song-detail'
        onClick={() => {
          onHandleAddList();
          dispatch(addPlayingSong({ id, name, ar, al, dt, songUrl }));
          dispatch(addPlayingSongIndex(index));
          goPlayMusic(id);
        }}
      >
        <View className='song-name'>{name}</View>
        <View className='song-ar-al'>
          {ar.map(artist => artist.name).join('/')} - {al.name}
        </View>
      </View>

      <View
        className='more'
        onClick={() => {
          onHandleMore();
          onHandleOpen();
        }}
      >
        ⋮
      </View>
    </View>
  );
};

export default SongListItem;
