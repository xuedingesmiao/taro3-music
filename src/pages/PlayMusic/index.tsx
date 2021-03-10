import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Image } from '@tarojs/components';
import { AtMessage, AtIcon, AtSlider, AtFloatLayout } from 'taro-ui';
import Taro, { navigateTo } from '@tarojs/taro';
import { useSelector, useDispatch } from 'react-redux';
import {
  isSongUseable,
  getSongLyric,
  likeSong,
  getLikeList
} from '../../utils/api';
import {
  addPlayingSongUrl,
  addPlayingList,
  addPlayingSongIndex,
  addPlayingSong,
  setPlayMode,
  setShufflePlayingList
} from '../../store/reducer/songReducer';
import { useMount } from '../../hooks';
import Lyric from './Lyric';
import './index.scss';

let timer;
const backgroundAudioManager = Taro.getBackgroundAudioManager();

const timeFormat = time => {
  let min = Math.floor(time / 1000 / 60);
  let sec = Math.floor((time - min * 60 * 1000) / 1000);
  return `${min > 9 ? min : '0' + min}:${sec > 9 ? sec : '0' + sec}`;
};

const currentTimeFormat = time => {
  if (time) {
    let sec = Math.floor(time % 60);
    let min = Math.floor(time / 60);
    return `${min > 9 ? min : '0' + min}:${sec > 9 ? sec : '0' + sec}`;
  } else {
    return '00:00';
  }
};

const shuffle = arr => arr.map(item => item).sort(() => Math.random() - 0.5);

const Index = () => {
  /* const {
    params: { id }
  } = useRouter(); */
  const dispatch = useDispatch();
  const {
    playingSong,
    playingList,
    playingSongIndex,
    playingSongUrl,
    playMode,
    playingListId,
    playingListName,
    shufflePlayingList
  } = useSelector(state => state.song);

  // const [spin, setSpin] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState('00:00');
  const [progressValue, setProgressValue] = useState(0);
  const [playListOpen, setPlayListOpen] = useState(false);
  const [songInfoOpen, setSongInfoOpen] = useState(false);
  const [liked, setLiked] = useState(false);
  const [lyric, setLyric] = useState(null);
  const [tlyric, setTlyric] = useState(null);
  const [lyricCurrentTime, setLyricCurrentTime] = useState(0);
  const currentIndex = useRef(0);
  const currentMode = useRef(playMode);

  const goArtist = arr => {
    if (arr.length > 1) {
      // setSingerOpen(true);
    } else {
      navigateTo({ url: `/pages/Artist/index?id=${arr[0].id}` });
    }
  };
  const goAlbum = album => {
    navigateTo({ url: `/pages/Album/index?id=${album.id}` });
  };

  const goList = listId => {
    navigateTo({ url: `/pages/PlayList/index?id=${listId}` });
  };

  const handlePlay = () => {
    if (backgroundAudioManager.src !== '') {
      if (isPlaying) {
        setIsPlaying(false);
        backgroundAudioManager.pause();
      } else {
        setIsPlaying(true);
        backgroundAudioManager.play();
      }
    } else {
      initPlay();
    }
  };

  const playSong = song => {
    if (song.id === playingSong.id) {
      return;
    }
    dispatch(addPlayingSong(song));
    if (playMode === 'shuffle') {
      const shuffleIndex = shufflePlayingList.findIndex(
        item => item.id === song.id
      );
      dispatch(addPlayingSongIndex(shuffleIndex));
    } else {
      const songIndex = playingList.findIndex(item => item.id === song.id);
      dispatch(addPlayingSongIndex(songIndex));
    }
    setLyricCurrentTime(0);
    setProgressValue(0);
  };

  const isSongLiked = songId => {
    getLikeList()
      .then(res => {
        console.log(res.data);
        if (res.data.code === 200) {
          const likeStatus = res.data.ids.indexOf(songId) !== -1;
          setLiked(likeStatus);
        }
      })
      .catch(err => console.log(err));
  };

  const starSong = () => {
    likeSong(playingSong.id, !liked).then(res => {
      if (res.data.code === 200) {
        Taro.atMessage({
          message: `${!liked ? '已添加到我喜欢的音乐' : '已取消喜欢'}`,
          type: 'success'
        });
        setLiked(!liked);
      } else {
        Taro.atMessage({
          message: '收藏失败',
          type: 'error'
        });
      }
    });
  };

  const removeSong = song => {
    if (song.id === playingSong.id) {
      getNext();
    }
    const filterPlayList = playingList.filter(item => item.id !== song.id);
    const filterShufflePlayList = shufflePlayingList.filter(
      item => item.id !== song.id
    );
    dispatch(addPlayingList(filterPlayList));
    dispatch(setShufflePlayingList(filterShufflePlayList));
    if (playMode === 'shuffle') {
      if (playingSongIndex === shufflePlayingList.length - 1) {
        dispatch(addPlayingSongIndex(0));
        return;
      }
      dispatch(addPlayingSongIndex(playingSongIndex));
    } else {
      if (playingSongIndex === playingList.length - 1) {
        dispatch(addPlayingSongIndex(0));
        return;
      }
      dispatch(addPlayingSongIndex(playingSongIndex));
    }
  };

  const generateShuffle = useCallback(() => {
    const shufflePlayList = shuffle(playingList);
    dispatch(setShufflePlayingList(shufflePlayList));
  }, [dispatch, playingList]);

  const initPlay = useCallback(() => {
    backgroundAudioManager.stop();
    backgroundAudioManager.title = playingSong.name;
    backgroundAudioManager.singer = playingSong.ar
      .map(artist => artist.name)
      .join('/');
    backgroundAudioManager.epname = playingSong.al.name;
    backgroundAudioManager.coverImgUrl = playingSong.al.picUrl;
    backgroundAudioManager.src = playingSong.songUrl;
    dispatch(addPlayingSongUrl(playingSong.songUrl));
    console.log(backgroundAudioManager.src);
    currentIndex.current = playingSongIndex;
    setCurrentTime('00:00');
    setLyricCurrentTime(0);
    setProgressValue(0);
  }, [dispatch, playingSong, playingSongIndex]);

  const getNext = useCallback(() => {
    setLyricCurrentTime(0);
    setProgressValue(0);
    if (playMode === 'shuffle') {
      if (currentIndex.current === shufflePlayingList.length - 1) {
        dispatch(addPlayingSong(shufflePlayingList[0]));
        dispatch(addPlayingSongIndex(0));
      } else {
        dispatch(addPlayingSong(shufflePlayingList[currentIndex.current + 1]));
        dispatch(addPlayingSongIndex(currentIndex.current + 1));
      }
    } else {
      if (currentIndex.current === playingList.length - 1) {
        dispatch(addPlayingSong(playingList[0]));
        dispatch(addPlayingSongIndex(0));
      } else {
        dispatch(addPlayingSong(playingList[currentIndex.current + 1]));
        dispatch(addPlayingSongIndex(currentIndex.current + 1));
      }
    }
    /* setLyricCurrentTime(0);
    setProgressValue(0); */
  }, [dispatch, playMode, playingList, shufflePlayingList]);

  const getPrev = () => {
    if (playMode === 'shuffle') {
      if (playingSongIndex === 0) {
        dispatch(
          addPlayingSong(shufflePlayingList[shufflePlayingList.length - 1])
        );
        dispatch(addPlayingSongIndex(shufflePlayingList.length - 1));
      } else {
        dispatch(addPlayingSong(shufflePlayingList[playingSongIndex - 1]));
        dispatch(addPlayingSongIndex(playingSongIndex - 1));
      }
    } else {
      if (playingSongIndex === 0) {
        dispatch(addPlayingSong(playingList[playingList.length - 1]));
        dispatch(addPlayingSongIndex(playingList.length - 1));
      } else {
        dispatch(addPlayingSong(playingList[playingSongIndex - 1]));
        dispatch(addPlayingSongIndex(playingSongIndex - 1));
      }
    }
  };

  const changeMode = () => {
    if (playMode === 'loop') {
      dispatch(setPlayMode('one'));
      currentMode.current = 'one';
      Taro.atMessage({
        message: '单曲循环',
        type: 'info'
      });
      return;
    }
    if (playMode === 'one') {
      dispatch(setPlayMode('shuffle'));
      currentMode.current = 'shuffle';
      const shuffleIndex = shufflePlayingList.findIndex(
        item => item.id === playingSong.id
      );
      if (shuffleIndex) {
        dispatch(addPlayingSongIndex(shuffleIndex));
      }
      Taro.atMessage({
        message: '随机播放',
        type: 'info'
      });
      return;
    }
    if (playMode === 'shuffle') {
      dispatch(setPlayMode('loop'));
      currentMode.current = 'loop';
      const loopIndex = playingList.findIndex(
        item => item.id === playingSong.id
      );
      if (loopIndex) {
        dispatch(addPlayingSongIndex(loopIndex));
      }
      Taro.atMessage({
        message: '列表循环',
        type: 'info'
      });
      return;
    }
  };

  const getPlayMode = () => {
    if (playMode === 'one') {
      return 'reload';
    }
    if (playMode === 'shuffle') {
      return 'shuffle-play';
    }
    if (playMode === 'loop') {
      return 'repeat-play';
    }
  };

  const sliderChange = value => {
    console.log('value', value);
    backgroundAudioManager.pause();

    const currentPosition = Math.floor(
      (backgroundAudioManager.duration * value) / 100
    );
    console.log('currentPosition', currentPosition);
    backgroundAudioManager.seek(currentPosition);
    backgroundAudioManager.play();
  };

  const setTimer = () => {
    clearInterval(timer);
    setIsPlaying(true);

    timer = setInterval(() => {
      setCurrentTime(currentTimeFormat(backgroundAudioManager.currentTime));
      setProgressValue(
        Math.floor(
          (backgroundAudioManager.currentTime /
            backgroundAudioManager.duration) *
            1000
        ) / 10
      );
      setLyricCurrentTime(backgroundAudioManager.currentTime);
    }, 300);
  };

  Taro.setNavigationBarTitle({
    title: `${playingSong.name} - ${playingSong.ar
      .map(artist => artist.name)
      .join('/')}`
  });

  useEffect(() => {
    isSongUseable(playingSong.id)
      .then(res => {
        if (!res.data.success) {
          Taro.atMessage({ message: res.data.message, type: 'error' });
        } else {
          clearInterval(timer);
          if (playingSong.songUrl !== playingSongUrl) {
            initPlay();
          } else {
            setTimer();
          }
        }
      })
      .catch(err => console.log(err));
    isSongLiked(playingSong.id);
    getSongLyric(playingSong.id)
      .then(res => {
        console.log(res.data);
        if (res.data.code === 200) {
          if (res.data.nolyric) {
            setLyric('无歌词');
          } else {
            if (res.data.lrc.lyric) {
              setLyric(res.data.lrc.lyric);
            }
            if (res.data.tlyric.lyric) {
              setTlyric(res.data.tlyric.lyric);
            }
          }
        }
      })
      .catch(err => console.log(err));

    return () => {
      clearInterval(timer);
    };
  }, [dispatch, initPlay, playingSong, playingSongIndex, playingSongUrl]);

  useMount(() => {
    console.log('mounted');
    backgroundAudioManager.onPlay(() => {
      setTimer();
    });
    backgroundAudioManager.onPause(() => {
      console.log('onPause');
      clearInterval(timer);
    });
    backgroundAudioManager.onEnded(() => {
      console.log('onEnd');
      clearInterval(timer);
      setIsPlaying(false);

      if (currentMode.current === 'one') {
        console.log('currentMode', currentMode);
        initPlay();
      } else {
        getNext();
      }
    });
    backgroundAudioManager.onStop(() => {
      console.log('onStop');
      setIsPlaying(false);
      setLyricCurrentTime(0);
      setProgressValue(0);
    });
  });

  useMount(() => {
    console.log('generateShuffle');
    generateShuffle();
  });

  return (
    <View>
      <AtMessage></AtMessage>

      <Image className='song-bg' src={playingSong.al.picUrl}></Image>

      <View className='song-cover'>
        <View className='song-cover-bg'>
          <Image
            className={`${isPlaying ? 'spin' : 'spin spin-pause'}`}
            src={playingSong.al.picUrl}
          ></Image>
        </View>
      </View>

      <Lyric
        lyric={lyric}
        tlyric={tlyric}
        currentSecond={lyricCurrentTime}
      ></Lyric>

      <View className='like-more'>
        <View className='like' onClick={starSong}>
          <AtIcon
            value='heart-2'
            size='30'
            color={liked ? '#F00' : '#CCC'}
          ></AtIcon>
        </View>
        <View
          className='more'
          onClick={() => {
            setSongInfoOpen(true);
          }}
        >
          ⋮
        </View>
      </View>
      <View className='slider-container'>
        <View className='timer'>{currentTime}</View>
        <AtSlider
          value={progressValue}
          step={0.1}
          blockSize={12}
          max={100}
          onChange={sliderChange}
        ></AtSlider>
        <View className='timer'>{timeFormat(playingSong.dt)}</View>
      </View>
      <View className='play-box'>
        <View className='action-item' onClick={changeMode}>
          <AtIcon value={`${getPlayMode()}`} size='25'></AtIcon>
        </View>
        <View className='action-item' onClick={getPrev}>
          <AtIcon value='prev' size='25'></AtIcon>
        </View>
        <View
          className={`action-item ${isPlaying ? 'pause' : 'play'}`}
          onClick={() => {
            handlePlay();
          }}
        >
          <AtIcon value={`${isPlaying ? 'pause' : 'play'} `} size='35'></AtIcon>
        </View>
        <View className='action-item' onClick={getNext}>
          <AtIcon value='next' size='25'></AtIcon>
        </View>
        <View
          className='action-item'
          onClick={() => {
            setPlayListOpen(true);
          }}
        >
          <AtIcon value='playlist' size='25'></AtIcon>
        </View>
      </View>
      {/* playlist */}
      <AtFloatLayout
        isOpened={playListOpen}
        onClose={() => {
          setPlayListOpen(false);
        }}
      >
        <View className='playing-title'>当前播放（{playingList.length}）</View>
        <View className='playing-list-container'>
          {playingList.map((item, index) => (
            <View className='playing-list-item' key={index}>
              {item.id === playingSong.id ? (
                <View className='playing-status'>
                  <AtIcon value='volume-plus' size='25' color='#F00'></AtIcon>
                </View>
              ) : null}
              <View
                className={`${
                  item.id === playingSong.id
                    ? 'item-detail is-playing'
                    : 'item-detail'
                }`}
                onClick={() => {
                  playSong(item);
                }}
              >
                {item.name} - {item.ar.map(artist => artist.name).join('/')}
              </View>
              <View
                onClick={() => {
                  removeSong(item);
                }}
              >
                <AtIcon value='close' size='15'></AtIcon>
              </View>
            </View>
          ))}
        </View>
      </AtFloatLayout>
      {/* song info */}
      <AtFloatLayout
        title={`${playingSong.name} - ${playingSong.ar
          .map(artist => artist.name)
          .join('/')}`}
        isOpened={songInfoOpen}
        onClose={() => {
          setSongInfoOpen(false);
        }}
      >
        <View className='info-container'>
          <View className='artist-info'>
            <AtIcon value='user'></AtIcon>
            <View className='action' onClick={() => goArtist(playingSong.ar)}>
              歌手：{`${playingSong.ar.map(artist => artist.name).join('/')}`}
            </View>
          </View>
          <View className='album-info'>
            <AtIcon value='file-audio'></AtIcon>
            <View className='action' onClick={() => goAlbum(playingSong.al)}>
              专辑：{playingSong.al.name}
            </View>
          </View>
          {playingListName ? (
            <View className='list-info'>
              <AtIcon value='link'></AtIcon>
              <View className='action' onClick={() => goList(playingListId)}>
                来源：歌单 {playingListName}
              </View>
            </View>
          ) : null}
        </View>
      </AtFloatLayout>
    </View>
  );
};

export default Index;
