import React, { useState, useEffect } from 'react';
import Taro from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import { useSelector, useDispatch } from 'react-redux';
import { AtButton, AtMessage, AtIcon } from 'taro-ui';
import { getUserLevel, getLikeList, getUserPlayList } from '../../utils/api';
import { resetUser } from '../../store/reducer/userReducer';
import user from '../../images/user.png';
import star from '../../images/star.png';
import './index.scss';

interface UserPlayListItem {
  name: string;
  coverImgUrl: string;
  id: number;
  trackCount: number;
}

const User = () => {
  const dispatch = useDispatch();
  const { userId, userProfile } = useSelector(state => state.user);
  const [userLevel, setUserLevel] = useState(null);
  const [likeListIds, setlikeListIds] = useState([]);
  const [userPlaylist, setUserPlaylist] = useState<UserPlayListItem[]>([]);
  const routeToLogin = () => {
    Taro.navigateTo({ url: '/pages/Login/index' });
  };
  const routeToList = listId => {
    Taro.navigateTo({
      url: `/pages/PlayList/index?id=${listId}`
    });
  };

  const handleLogout = () => {
    Taro.clearStorageSync();
    Taro.atMessage({
      message: '登出成功',
      type: 'success'
    });
    dispatch(resetUser());
  };

  Taro.setNavigationBarTitle({
    title: `我的`
  });

  useEffect(() => {
    if (userId) {
      getUserLevel()
        .then(res => {
          if (res.data.code === 200) {
            const { level } = res.data.data;
            setUserLevel(level);
          }
        })
        .catch(err => console.log(err));
      getLikeList()
        .then(res => {
          if (res.data.code === 200) {
            const { ids } = res.data;
            setlikeListIds(ids);
          }
        })
        .catch(err => console.log(err));
      getUserPlayList(userId)
        .then(res => {
          if (res.data.code === 200) {
            const { playlist } = res.data;
            console.table(playlist);
            setUserPlaylist(playlist);
          }
        })
        .catch(err => console.log(err));
    }
  }, [userId]);

  return (
    <View>
      <AtMessage />
      {userId && userProfile ? (
        <View
          className='user-box'
          onClick={() => {
            Taro.navigateTo({ url: `/pages/User/index?id=${userId}` });
          }}
        >
          <Image className='user-avator' src={userProfile.avatarUrl}></Image>
          <View className='user-info'>
            <View>{userProfile.nickname}</View>
            <View className='user-level'>Lv.{userLevel}</View>
          </View>
          <View className='user-tail'>
            <AtIcon value='chevron-right' size='20'></AtIcon>
          </View>
        </View>
      ) : (
        <View className='user-box'>
          <Image className='user-avator' src={user}></Image>
          <View className='login-btn' onClick={routeToLogin}>
            点击登录&gt;
          </View>
        </View>
      )}

      <View className='stared-music'>
        <Image className='star-icon' src={star}></Image>
        <View className='stared-info'>
          <View className='title'>我喜欢的音乐</View>
          <View className='count'>
            {likeListIds.length ? likeListIds.length : 0}首
          </View>
        </View>
      </View>

      {userId ? (
        <>
          <View className='user-playlist'>
            <View className='list-title'>我创建的歌单</View>
            {userPlaylist
              ? userPlaylist.map((item, index) => (
                  <View
                    key={index}
                    className='list-item-box'
                    onClick={() => {
                      routeToList(item.id);
                    }}
                  >
                    <Image
                      src={item.coverImgUrl}
                      className='list-cover'
                    ></Image>
                    <View className='list-info'>
                      <View className='list-name'>{item.name}</View>
                      <View className='list-count'>{item.trackCount}首</View>
                    </View>
                  </View>
                ))
              : null}
          </View>
          <View className='user-logout'>
            <AtButton onClick={handleLogout}>退出登录</AtButton>
          </View>
        </>
      ) : null}
    </View>
  );
};

export default User;
