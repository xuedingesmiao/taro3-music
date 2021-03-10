import React, { useEffect, useState, useMemo } from 'react';
import { View, Image } from '@tarojs/components';
import { useRouter, navigateTo } from '@tarojs/taro';
import { getArtistDetail, getArtistAlbums } from '../../utils/api';
import { ArtistDetail, trackItem, AlbumDetail } from '../../types';
import TrackList from '../../components/TrackList';
import Artist from './Artist';
import './index.scss';

const goAlbum = id => {
  navigateTo({ url: `/pages/Album/index?id=${id}` });
};

const Index = () => {
  const {
    params: { id }
  } = useRouter();
  const [artist, setArtist] = useState<ArtistDetail>();
  const [tracks, setTracks] = useState<trackItem[]>();
  const [currentTab, setCurrentTab] = useState(0);
  const [album, setAlbum] = useState<AlbumDetail[]>();
  const memoTrackList = useMemo(
    () => <TrackList listId={null} listName={null} tracks={tracks}></TrackList>,
    [tracks]
  );
  useEffect(() => {
    const fetchArr = [getArtistAlbums(id), getArtistDetail(id)];
    Promise.all(fetchArr)
      .then(([res1, res2]) => {
        if (res2.data.code === 200) {
          console.log(res2.data);
          setArtist(res2.data.artist);
          setTracks(res2.data.hotSongs);
        }
        if (res1.data.code === 200) {
          console.log(res1.data);
          setAlbum(res1.data.hotAlbums);
        }
      })
      .catch(err => console.log(err));
  }, [id]);

  return (
    <View>
      {artist ? (
        <View className='artist-container'>
          <Artist {...artist}></Artist>
        </View>
      ) : null}
      {tracks ? (
        <View>
          <View className='artist-tabs'>
            <View
              className={`tab-item ${currentTab === 0 ? 'selected' : null}`}
              onClick={() => {
                setCurrentTab(0);
              }}
            >
              歌曲
            </View>
            <View
              className={`tab-item ${currentTab === 1 ? 'selected' : null}`}
              onClick={() => {
                setCurrentTab(1);
              }}
            >
              专辑
            </View>
          </View>
          {currentTab === 0 ? (
            memoTrackList
          ) : (
            <View className='album-container'>
              {album ? (
                <View>
                  {album.map(item => (
                    <View className='item-container' key={item.id}>
                      <Image className='album-cover' src={item.picUrl}></Image>
                      <View
                        className='album-name'
                        onClick={() => {
                          goAlbum(item.id);
                        }}
                      >
                        {item.name}
                      </View>
                    </View>
                  ))}
                </View>
              ) : null}
            </View>
          )}
        </View>
      ) : null}
    </View>
  );
};

export default Index;
