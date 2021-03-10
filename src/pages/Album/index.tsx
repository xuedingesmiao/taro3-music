import React, { useEffect, useState } from 'react';
import { View, Image } from '@tarojs/components';
import { useRouter, navigateTo } from '@tarojs/taro';
import { AtCurtain } from 'taro-ui';
import { getAlbumDetail } from '../../utils/api';
import { AlbumDetail } from '../../types';
import TrackList from '../../components/TrackList';
import Description from '../../components/Description';

import './index.scss';

const goArtistPage = (id: number) => {
  navigateTo({
    url: `/pages/Artist/index?id=${id}`
  });
};

const Artist = ({ picUrl, name, id }) => {
  return (
    <View
      className='artist-container'
      onClick={() => {
        goArtistPage(id);
      }}
    >
      <Image className='artist-avatar' src={picUrl}></Image>
      <View className='artist-name'>{name} &gt;</View>
    </View>
  );
};

const Index = () => {
  const {
    params: { id }
  } = useRouter();
  const [open, setOpen] = useState(false);
  const [album, setAlbum] = useState<AlbumDetail>();
  const [songs, setSongs] = useState();
  useEffect(() => {
    getAlbumDetail(id).then(res => {
      if (res.data.code === 200) {
        console.log(res.data);
        setSongs(res.data.songs);
        setAlbum(res.data.album);
      }
    });
  }, [id]);
  return (
    <View>
      {album ? (
        <View className='bg-container'>
          <Image className='album-bg' src={album.blurPicUrl}></Image>
          <View className='album-info'>
            <View className='album-cover'>
              <Image src={album.picUrl}></Image>
            </View>
            <View className='album-creator'>
              <View className='album-name'>
                <View>{album.name}</View>
                <Artist {...album.artist}></Artist>
              </View>
              <View
                className='album-description'
                onClick={() => {
                  setOpen(true);
                }}
              >
                {album.description}
              </View>
            </View>
          </View>
        </View>
      ) : null}
      <AtCurtain
        isOpened={open}
        onClose={() => {
          setOpen(false);
        }}
      >
        <Description destype='album' {...album}></Description>
      </AtCurtain>
      <TrackList tracks={songs}></TrackList>
    </View>
  );
};

export default Index;
