import React from 'react';
import { View, Image } from '@tarojs/components';
import { playlist, AlbumDetail } from '../types';
import './Description.scss';

interface TypeAlbum extends AlbumDetail {
  destype: 'album';
}
interface TypePlaylist extends playlist {
  destype: 'songList';
}
type Props = TypeAlbum | TypePlaylist;

const Description: React.FC<Props> = props => {
  console.table(props);

  return (
    <View className='des-container'>
      {props.destype === 'album' ? (
        <Image className='des-bg' src={props.picUrl}></Image>
      ) : (
        <Image className='des-bg' src={props.coverImgUrl}></Image>
      )}

      <View className='des-bg-container'></View>
      <View className='des-cover'>
        {props.destype === 'album' ? (
          <Image mode='widthFix' src={props.picUrl}></Image>
        ) : (
          <Image mode='widthFix' src={props.coverImgUrl}></Image>
        )}

        <View className='cover-name'>{props.name}</View>
      </View>
      {props.destype === 'songList' ? (
        <View className='des-tags'>
          标签：
          {props.tags.length ? (
            props.tags.map(item => (
              <View key={item} className='tag'>
                {item}
              </View>
            ))
          ) : (
            <View>无</View>
          )}
        </View>
      ) : (
        <View className='album-labels'>
          <View className='album-company'>发新公司：{props.company}</View>
          <View className='album-type'>专辑类别：{props.subType}</View>
        </View>
      )}

      <View className='des-description'>{props.description}</View>
    </View>
  );
};

export default Description;
