import React, { useState, useEffect } from 'react';
import { View, Image } from '@tarojs/components';
import Taro, { useRouter, navigateTo } from '@tarojs/taro';
import { AtCurtain } from 'taro-ui';

import { getPlayListDetail } from '../../utils/api';
import { playlist, creator } from '../../types';
import Description from '../../components/Description';
import SongList from './SongList';
import './index.scss';

const Creator: React.FC<creator> = ({ avatarUrl, nickname, userId }) => {
  const goUserPage = (id: number) => {
    navigateTo({
      url: `/pages/User/index?id=${id}`
    });
  };
  return (
    <View
      className='creator-container'
      onClick={() => {
        goUserPage(userId);
      }}
    >
      <Image className='creator-avatar' src={avatarUrl}></Image>
      <View className='creator-name'>{nickname} &gt;</View>
    </View>
  );
};

const Index = () => {
  const {
    params: { id }
  } = useRouter();
  const [playList, setPlayList] = useState<playlist>();
  const [open, setOpen] = useState(false);
  Taro.setNavigationBarTitle({
    title: `歌单`
  });
  useEffect(() => {
    getPlayListDetail(id)
      .then(res => {
        console.log(res.data);
        if (res.data.code === 200) {
          setPlayList(res.data.playlist);
        }
      })
      .catch(err => {
        throw new Error(err.message);
      });
  }, [id]);

  return (
    <View>
      {playList ? (
        <View className='bg-container'>
          <Image className='list-bg' src={playList.coverImgUrl}></Image>
          <View className='list-info'>
            <View className='list-cover'>
              <Image src={playList.coverImgUrl}></Image>
            </View>
            <View className='list-creator'>
              <View className='list-name'>
                <View>{playList.name}</View>
                <Creator {...playList.creator}></Creator>
              </View>
              <View
                className='list-description'
                onClick={() => {
                  setOpen(true);
                }}
              >
                {playList.description}
              </View>
            </View>
          </View>
          <AtCurtain
            isOpened={open}
            onClose={() => {
              setOpen(false);
            }}
          >
            <Description destype='songList' {...playList}></Description>
          </AtCurtain>
          {/* <View className='list-bar'>
            <View className='list-bar-item'>
              <AtIcon value='message' size='30' color='#FFF'></AtIcon>
              <View>{playList.commentCount}</View>
            </View>
            <View className='list-bar-item'>
              <AtIcon value='share-2' size='30' color='#FFF'></AtIcon>
              <View>{playList.shareCount}</View>
            </View>
          </View> */}
        </View>
      ) : null}
      {playList ? <SongList {...playList}></SongList> : null}
    </View>
  );
};

export default Index;
