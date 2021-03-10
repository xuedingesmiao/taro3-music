import React, { useState } from 'react';
import { View, Image } from '@tarojs/components';

import { followUser, unfollowUser } from '../../utils/api';
import { UserProfile } from '../../types';

const UserInfo: React.FC<UserProfile> = ({
  backgroundUrl,
  avatarUrl,
  nickname,
  followeds,
  followed,
  follows,
  userId
}) => {
  const [followStatus, setFollowStatus] = useState(followed);
  console.log('followStatus', followStatus);

  const follow = id => {
    followUser(id).then(res => {
      if (res.data.code === 200) {
        setFollowStatus(!followStatus);
      }
    });
  };
  const unfollow = id => {
    unfollowUser(id).then(res => {
      if (res.data.code === 200) {
        setFollowStatus(!followStatus);
      }
    });
  };

  return (
    <View>
      <Image className='user-bg' src={backgroundUrl}></Image>
      <View className='user-container'>
        <View className='user-avatar'>
          <Image src={avatarUrl}></Image>
        </View>
        <View className='user-name'>{nickname}</View>
        <View className='flex-box'>
          <View className='user-follow-staus'>
            <View className='follows'>关注 {follows}</View>
            <View className='space-gap'>|</View>
            <View className='followed'>粉丝 {followeds}</View>
          </View>
          <View className='follow-btn-container'>
            {followStatus ? (
              <View
                className='already-followed'
                onClick={() => {
                  unfollow(userId);
                }}
              >
                已关注
              </View>
            ) : (
              <View
                className='follow-btn'
                onClick={() => {
                  follow(userId);
                }}
              >
                + 关注
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

export default UserInfo;
