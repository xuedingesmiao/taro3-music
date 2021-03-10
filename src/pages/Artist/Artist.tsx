import React, { useState } from 'react';
import { View, Image } from '@tarojs/components';
import { navigateTo } from '@tarojs/taro';
import { ArtistDetail } from '../../types';
import { subArtist, unSubArtist } from '../../utils/api';

const Artist: React.FC<ArtistDetail> = ({ id, name, followed, picUrl }) => {
  const [followStatus, setFollowStatus] = useState(followed);
  const followArtist = artistId => {
    subArtist(artistId)
      .then(res => {
        if (res.data.code === 200) {
          setFollowStatus(true);
        } else if (res.data.code === 301) {
          navigateTo({ url: '/pages/Login/index' });
        }
      })
      .catch(err => console.log(err));
  };
  const unFollowArtist = artistId => {
    unSubArtist(artistId)
      .then(res => {
        if (res.data.code === 200) {
          setFollowStatus(false);
        }
      })
      .catch(err => console.log(err));
  };

  return (
    <View>
      <Image className='artist-bg' mode='widthFix' src={picUrl}></Image>
      <View className='artist'>
        <View className='artist-name'>{name}</View>
        {followStatus ? (
          <View
            className='already-followed'
            onClick={() => {
              unFollowArtist(id);
            }}
          >
            已关注
          </View>
        ) : (
          <View
            className='sub-btn'
            onClick={() => {
              followArtist(id);
            }}
          >
            +关注
          </View>
        )}
      </View>
    </View>
  );
};

export default Artist;
