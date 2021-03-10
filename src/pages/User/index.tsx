import React, { useState, useEffect } from 'react';
import { View, Image } from '@tarojs/components';
import { useRouter, navigateTo } from '@tarojs/taro';
import { getUser, getUserPlayList } from '../../utils/api';
import './index.scss';
import { UserProfile, UserPlayList } from '../../types';
import UserInfo from './UserInfo';

const goPlayList = id => {
  navigateTo({
    url: `/pages/PlayList/index?id=${id}`
  });
};

const Index = () => {
  const {
    params: { id }
  } = useRouter();
  const [user, setUser] = useState<UserProfile>();
  const [userPlayList, setUserPlayList] = useState<UserPlayList[]>();
  useEffect(() => {
    Promise.all([getUserPlayList(id), getUser(id)])
      .then(([res1, res2]) => {
        if (res1.data.code === 200) {
          console.log(res1.data);
          setUserPlayList(res1.data.playlist);
        }
        if (res2.data.code === 200) {
          console.log(res2.data);
          setUser(res2.data.profile);
        }
      })
      .catch(err => console.log(err));
    /* getUser(id).then(res => {
      if (res.data.code === 200) {
        console.log(res.data);
        setUser(res.data.profile);
      }
    }); */
  }, [id]);
  return (
    <View>
      {user ? <UserInfo {...user}></UserInfo> : null}
      {userPlayList ? (
        <View className='playlist-container'>
          {userPlayList.map(item => (
            <View className='list-item' key={item.id}>
              <Image src={item.coverImgUrl}></Image>
              <View
                className='list-name'
                onClick={() => {
                  goPlayList(item.id);
                }}
              >
                {item.name}
              </View>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
};

export default Index;
