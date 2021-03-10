import React, { useState, useEffect } from 'react';
import { View, Image, Swiper, SwiperItem } from '@tarojs/components';
import { navigateTo } from '@tarojs/taro';
import { useDispatch } from 'react-redux';
import { getBanner, getSongUrl } from '../utils/api';
import {
  addPlayingSong,
  addPlayingList,
  addPlayingSongIndex
} from '../store/reducer/songReducer';
import './Banner.scss';

interface BannerItem {
  pic: string;
  typeTitle: string;
  titleColor: string;
}

const Banner = () => {
  const dispatch = useDispatch();
  const [bannerList, setBannerList] = useState<BannerItem[]>([]);
  const bannerClick = banner => {
    const { targetType } = banner;
    console.table(banner);
    // targetType为3000时，跳转外部链接
    if (targetType === 3000) {
      navigateTo({
        url: `/pages/Webview/index?url=${banner.url}`
      });
      return;
    }
    // targetType为10时，跳转到对应id的歌单
    if (targetType === 10) {
      navigateTo({
        url: `/pages/PlayList/index?id=${banner.targetId}`
      });
      return;
    }
    if (targetType === 1) {
      getSongUrl(banner.targetId)
        .then(res => {
          if (res.data.code === 200) {
            const { url } = res.data.data[0];
            const { song } = banner;
            song.songUrl = url;
            dispatch(addPlayingSong(song));
            dispatch(addPlayingList([song]));
            dispatch(addPlayingSongIndex(0));
            navigateTo({
              url: `/pages/PlayMusic/index?id=${banner.targetId}`
            });
          }
        })
        .catch(err => console.log(err));
      return;
    }
  };

  useEffect(() => {
    getBanner(2)
      .then(res => {
        console.log(res.data);
        if (res.data.banners) {
          setBannerList(res.data.banners);
        }
      })
      .catch(err => console.log(err));
  }, []);
  return (
    <View>
      <Swiper
        className='banner-container'
        indicatorColor='#999'
        indicatorActiveColor='#333'
        circular
        indicatorDots
        autoplay
      >
        {bannerList.map((item, index) => (
          <SwiperItem key={index} className='banner-item'>
            <View className='pic-container'>
              <Image
                src={item.pic}
                className='banner-item-pic'
                onClick={() => {
                  bannerClick(item);
                }}
              />
              <View className={`item-title ${item.titleColor}`}>
                {item.typeTitle}
              </View>
            </View>
          </SwiperItem>
        ))}
      </Swiper>
    </View>
  );
};

export default Banner;
