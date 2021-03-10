import React, { useState, useEffect } from 'react';
import { View, Image } from '@tarojs/components';
import { navigateTo } from '@tarojs/taro';
import { AtIcon, AtFloatLayout } from 'taro-ui';
import { useDispatch, useSelector } from 'react-redux';
import {
  addPlayingList,
  addPlayingSong,
  addPlayingSongIndex,
  addPlayingListId,
  addPlayingListName
} from '../store/reducer/songReducer';
import { trackItem } from '../types';
import { getSongUrl } from '../utils/api';
import SongListItem from './SongListItem';

import './TrackList.scss';

const getAllTracksId = tracks => {
  return tracks.map(item => item.id).join(',');
};

const Index = ({ tracks = [], listId = null, listName = null } = {}) => {
  const [open, setOpen] = useState(false);
  const [singerOpen, setSingerOpen] = useState(false);
  const [detail, setDetail] = useState<trackItem>();
  const [trackList, settrackList] = useState([]);
  const dispatch = useDispatch();
  const { playingList, playingSongIndex } = useSelector(state => state.song);

  const goArtist = (arr: trackItem['ar']) => {
    if (arr.length > 1) {
      setSingerOpen(true);
    } else {
      navigateTo({ url: `/pages/Artist/index?id=${arr[0].id}` });
    }
  };
  const goAlbum = (album: trackItem['al']) => {
    navigateTo({ url: `/pages/Album/index?id=${album.id}` });
  };

  const isSongExist = song => {
    const index = playingList.findIndex(item => item.id === song.id);
    return index === -1 ? false : index;
  };

  const addPlayNext = songDetail => {
    console.table(songDetail);
    if (playingList.length) {
      const index = isSongExist(songDetail);
      const newList = playingList.concat();

      if (index || index === 0) {
        newList.splice(index, 1);
      }

      if (index === playingSongIndex) {
        setOpen(false);
        navigateTo({ url: `/pages/PlayMusic/index` });
        return;
      }
      if (index > playingSongIndex) {
        newList.splice(playingSongIndex + 1, 0, songDetail);
      }
      if (index < playingSongIndex) {
        newList.splice(playingSongIndex, 0, songDetail);
      }
      dispatch(addPlayingList(newList));
      setOpen(false);
      navigateTo({ url: `/pages/PlayMusic/index` });
    } else {
      dispatch(addPlayingList([songDetail]));
      dispatch(addPlayingSong(songDetail));
      dispatch(addPlayingSongIndex(0));
      setOpen(false);
      navigateTo({ url: `/pages/PlayMusic/index?id=${songDetail.id}` });
    }
  };

  useEffect(() => {
    if (tracks) {
      const Ids = getAllTracksId(tracks);
      getSongUrl(Ids)
        .then(res => {
          if (res.data.code === 200) {
            console.log(res.data);
            const songUrlArray = res.data.data;
            for (let i = 0; i < tracks.length; i++) {
              const id = tracks[i].id;
              const filterItem = songUrlArray.find(item => item.id === id);
              tracks[i].songUrl = filterItem.url;
            }
            settrackList(tracks);
          }
        })
        .catch(err => console.log(err));
    }
  }, [tracks]);

  return (
    <View className='tracks-container'>
      {trackList.length
        ? trackList.map((track, index) => {
            return (
              <SongListItem
                key={index}
                index={index}
                {...track}
                onHandleAddList={() => {
                  dispatch(addPlayingList(tracks));
                  dispatch(addPlayingListId(listId));
                  dispatch(addPlayingListName(listName));
                }}
                onHandleMore={() => setDetail(track)}
                onHandleOpen={() => setOpen(true)}
              ></SongListItem>
            );
          })
        : null}
      <AtFloatLayout
        className='float-out'
        isOpened={open}
        onClose={() => {
          setOpen(false);
        }}
      >
        {open ? (
          <View className='song-info'>
            <View className='song-top'>
              <View className='song-cover'>
                <Image src={detail.al.picUrl}></Image>
              </View>
              <View className='song-detail'>
                <View className='song-name'>{detail.name}</View>
                <View className='song-ar-al'>
                  {detail.ar.map(item => item.name).join('/')} -{' '}
                  {detail.al.name}
                </View>
              </View>
            </View>
            <View className='action-item'>
              <AtIcon value='add-circle'></AtIcon>
              <View
                className='action'
                onClick={() => {
                  addPlayNext(detail);
                }}
              >
                下一首播放
              </View>
            </View>

            <View className='action-item'>
              <AtIcon value='user'></AtIcon>
              <View
                className='action'
                onClick={() => {
                  goArtist(detail.ar);
                }}
              >
                歌手：{detail.ar.map(item => item.name).join('/')}
              </View>
            </View>
            <View className='action-item'>
              <AtIcon value='file-audio'></AtIcon>
              <View
                className='action'
                onClick={() => {
                  goAlbum(detail.al);
                }}
              >
                专辑：{detail.name}
              </View>
            </View>
          </View>
        ) : null}
      </AtFloatLayout>
      <AtFloatLayout
        isOpened={singerOpen}
        onClose={() => {
          setSingerOpen(false);
        }}
      >
        {singerOpen ? (
          <View>
            {detail.ar.map(item => (
              <View
                className='artist'
                key={item.id}
                onClick={() => {
                  goArtist([item]);
                }}
              >
                {item.name}
              </View>
            ))}
          </View>
        ) : null}
      </AtFloatLayout>
    </View>
  );
};

export default Index;
