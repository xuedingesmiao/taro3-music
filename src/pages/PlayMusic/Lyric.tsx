import React, { useState, useEffect } from 'react';
import { View } from '@tarojs/components';
import './Lyric.scss';

/* const currentTimeFormat = time => {
  if (time) {
    let sec = Math.floor(time % 60);
    let min = Math.floor(time / 60);
    return `${min > 9 ? min : '0' + min}:${sec > 9 ? sec : '0' + sec}`;
  } else {
    return '00:00';
  }
}; */

interface LyricItem {
  lyric_second: number;
  lyric_text: string;
}

// 格式化歌词
const parseLyric = lyric => {
  return lyric
    .split('\n')
    .map(item => {
      const lyric_second = item.match(/\d{2}:\d{2}.\d{2,}/g);
      const lyric_text = item.replace(/\[\d{2}:\d{2}.\d{2,}\]/g, '');
      if (lyric_second && lyric_text) {
        return {
          lyric_second: lyric_second[0],
          lyric_text
        };
      }
    })
    .filter(item => (item ? true : false))
    .map(item => {
      const second = formatLyricScond(item);
      return { ...item, lyric_second: second };
    });
};

// 格式化歌词时间线
const formatLyricScond = item => {
  const secondArr = item.lyric_second.split(':').map(second => second * 1);
  if (secondArr.length === 1) {
    return secondArr[0];
  }
  if (secondArr.length === 2) {
    /* return secondArr.reduceRight((prev, cur) => prev + cur * 60); */
    const [min, second] = secondArr;
    return min * 60 + second;
  }
  if (secondArr.length === 3) {
    const [hour, min, second] = secondArr;
    return hour * 3600 + min * 60 + second;
  }
};

const findLyricIndex = (arr: LyricItem[], currentSecond: number) => {
  if (arr.length) {
    const index = arr.findIndex(item => item.lyric_second > currentSecond);
    if (index === 0) {
      return index;
    }
    if (index === arr.length - 1) {
      return index;
    }
    if (index === -1) {
      return arr.length - 1;
    }
    if (index >= 1) {
      return index - 1;
    }
  } else {
    return 0;
  }
};

const Lyric = ({ lyric, tlyric, currentSecond }) => {
  const [currentLyricIndex, setCurrentLyricIndex] = useState(0);
  const [currentTlyricIndex, setCurrentTlyricIndex] = useState(0);
  const [isTLyric, setIsTLyric] = useState(false);
  const [parsedLyric, setParsedLyric] = useState([]);
  const [parsedTlyric, setParsedTlyric] = useState([]);

  useEffect(() => {
    console.log('lyric mounted');
    if (lyric) {
      if (lyric === '无歌词') {
        setParsedLyric([{ lyric_second: 0, lyric_text: lyric }]);
      } else {
        setParsedLyric(parseLyric(lyric));
      }
    }
    if (tlyric) {
      setParsedTlyric(parseLyric(tlyric));
    }
  }, [lyric, tlyric]);

  useEffect(() => {
    if (currentSecond === 0) {
      setCurrentLyricIndex(0);
      setCurrentTlyricIndex(0);
    }
    if (!parsedLyric.length) {
      setCurrentLyricIndex(0);
    }
    if (!parsedTlyric.length) {
      setCurrentTlyricIndex(0);
    }
    setCurrentLyricIndex(findLyricIndex(parsedLyric, currentSecond));
    if (isTLyric) {
      setCurrentTlyricIndex(findLyricIndex(parsedTlyric, currentSecond));
    }
  }, [currentSecond, isTLyric, parsedLyric, parsedTlyric]);

  /* console.log('currentLyricIndex', currentLyricIndex);
  console.log('currentTlyricIndex', currentTlyricIndex);
  console.log('tlyric', tlyric);
  console.log('lyric', lyric);
  console.log('currentSecond', currentSecond); */
  /*   console.log('parsedLyric', parsedLyric);
  console.log('parsedTlyric', parsedTlyric); */

  return (
    <View className='lyric-container'>
      {parsedLyric.length ? (
        <View
          className='lyric-text'
          onClick={() => {
            setIsTLyric(!isTLyric);
          }}
        >
          {parsedTlyric.length
            ? `${
                isTLyric
                  ? parsedTlyric[currentTlyricIndex].lyric_text
                  : parsedLyric[currentLyricIndex].lyric_text
              }`
            : parsedLyric[currentLyricIndex].lyric_text}
        </View>
      ) : (
        <View className='lyric-text'>歌词加载中</View>
      )}
    </View>
  );
};

export default Lyric;
