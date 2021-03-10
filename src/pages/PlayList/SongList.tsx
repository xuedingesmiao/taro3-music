import React from 'react';
import { View, Text } from '@tarojs/components';
import { useDispatch } from 'react-redux';
import { navigateTo } from '@tarojs/taro';
import { AtIcon } from 'taro-ui';
import {
  addPlayingList,
  addPlayingSong,
  addPlayingSongIndex,
  addPlayingListId,
  addPlayingListName
} from '../../store/reducer/songReducer';

import { playlist } from '../../types';
import TrackList from '../../components/TrackList';
import './index.scss';

const transferSubsrcibeNum = num => {
  if (num < 10000) {
    return `(${num})`;
  } else if (num < 100000000) {
    return `(${Math.floor(num / 1000) / 10}万)`;
  } else {
    return `(${Math.floor(num / 10000000) / 10}亿)`;
  }
};

const SongList: React.FC<playlist> = ({
  id,
  tracks,
  subscribedCount,
  name
}) => {
  const dispatch = useDispatch();

  const playAll = () => {
    dispatch(addPlayingList(tracks));
    dispatch(addPlayingSong(tracks[0]));
    dispatch(addPlayingSongIndex(0));
    dispatch(addPlayingListId(id));
    dispatch(addPlayingListName(name));
    navigateTo({ url: `/pages/PlayMusic/index?id=${tracks[0].id}` });
  };
  return (
    <View className='playlist-container'>
      <View className='top-area'>
        <View className='play-all' onClick={playAll}>
          <AtIcon value='play' size='30'></AtIcon>
          播放全部{' '}
          <Text className='list-length'>{`(共 ${tracks.length} 首)`}</Text>
        </View>
        <View className='subscribe'>
          <View className='sub-btn'>
            +收藏
            <Text>{transferSubsrcibeNum(subscribedCount)}</Text>
          </View>
        </View>
      </View>
      <TrackList tracks={tracks} listId={id} listName={name}></TrackList>
    </View>
  );
};

export default SongList;
