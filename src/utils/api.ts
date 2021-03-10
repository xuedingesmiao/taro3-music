import Taro from '@tarojs/taro';
import { BASE_URL } from '../config';

const timeStamp = () => new Date().getTime();

const interceptor = function(chain) {
  const requestParams = chain.requestParams;
  const cookies = Taro.getStorageSync('cookies');
  console.log(cookies);
  // 从本地取cookie，如果有就在请求的header中带上
  if (cookies) {
    requestParams.header = { cookie: cookies };
    console.log('requestParams', requestParams);
  }

  // 拼接url
  const { url } = requestParams;
  requestParams.url = `${BASE_URL}${url}`;

  return chain.proceed(requestParams).then(res => {
    // 将res的header中的cookie存到微信的本地storage中
    if (url === '/login/cellphone') {
      if (res.header && res.header['Set-Cookie']) {
        console.log('Set-Cookie', res.header['Set-Cookie']);
        let arr = res.header['Set-Cookie'].split(',');
        let cookieArr: string[] = [];
        for (let index = 0; index < arr.length; index += 2) {
          const element = arr[index] + arr[index + 1];
          cookieArr.push(element);
        }
        const parsedCookie = cookieArr.join(';');

        console.log(parsedCookie);

        Taro.setStorageSync('cookies', parsedCookie);
      }
    }
    console.table('res', res);
    return res;
  });
};
Taro.addInterceptor(interceptor);

const service = Taro.request;

// 登录
export const login = data => {
  return service({ url: '/login/cellphone', data });
};

// toplist
export const getToplist = () => {
  return service({ url: '/toplist' });
};

// 歌单列表详情
export const getPlayListDetail = id => {
  return service({ url: `/playlist/detail?id=${id}` });
};

// 用户详情
export const getUser = uid => {
  return service({ url: `/user/detail?uid=${uid}` });
};

// 用户歌单
export const getUserPlayList = uid => {
  return service({ url: `/user/playlist?uid=${uid}` });
};

// 关注用户 t=1为关注用户
export const followUser = id => {
  return service({ url: `/follow?id=${id}&t=1` });
};
// 取消关注用户 t不为1则取消关注用户
export const unfollowUser = id => {
  return service({ url: `/follow?id=${id}&t=2` });
};

// 歌手详情
export const getArtistDetail = id => {
  return service({ url: `/artists?id=${id}` });
};

// 歌手专辑
export const getArtistAlbums = id => {
  return service({ url: `/artist/album?id=${id}` });
};

// 收藏歌手

export const subArtist = id => {
  return service({ url: `/artist/sub?id=${id}&t=1` });
};

// 取消收藏歌手
export const unSubArtist = id => {
  return service({ url: `/artist/sub?id=${id}&t=2` });
};

// 专辑详情
export const getAlbumDetail = id => {
  return service({ url: `/album?id=${id}` });
};

// 收藏专辑
export const subAlbum = id => {
  return service({ url: `/album/sub?id=${id}&t=1` });
};

// 取消收藏专辑
export const unSubAlbum = id => {
  return service({ url: `/album/sub?id=${id}&t=2` });
};

// 获取歌曲链接
export const getSongUrl = id => {
  return service({ url: `/song/url?id=${id}` });
};

// 获取歌曲歌词
export const getSongLyric = id => {
  return service({ url: `/lyric?id=${id}` });
};

// check音乐是否可用
export const isSongUseable = id => {
  return service({ url: `/check/music?id=${id}` });
};

// 喜欢歌曲
export const likeSong = (id, like: boolean) => {
  return service({
    url: `/like?id=${id}&like=${like}&timestamp=${timeStamp()}`
  });
};

// 获取用户喜欢音乐列表
export const getLikeList = (id = null) => {
  return id
    ? service({ url: `/likelist?uid=${id}&timestamp=${timeStamp()}` })
    : service({ url: `/likelist?timestamp=${timeStamp()}` });
};

// 获取账户等级
export const getUserLevel = () => {
  return service({
    url: `/user/level`
  });
};

// 推荐歌单
export const getPersonalized = () => {
  return service({
    url: `/personalized`
  });
};

// 获取banner
/* 0: pc

1: android

2: iphone

3: ipad */
export const getBanner = number => {
  return service({
    url: `/banner?type=${number}`
  });
};
