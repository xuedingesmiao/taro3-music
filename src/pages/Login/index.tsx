import React from 'react';
import Taro from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import { AtInput, AtButton, AtMessage } from 'taro-ui';
import { useDispatch } from 'react-redux';
import { login } from '../../utils/api';
import { useField } from '../../hooks';
import { setUserId, setUserProfile } from '../../store/reducer/userReducer';
import logo from '../../images/logo.png';

import './index.scss';

const Login = () => {
  const dispatch = useDispatch();
  const phone = useField('text');
  const password = useField('password');
  Taro.setNavigationBarTitle({
    title: `登录`
  });
  const handleLogin = () => {
    let data = { phone: phone.value, password: password.value };
    if (!phone.value) {
      Taro.atMessage({
        message: '请输入手机号码',
        type: 'error'
      });
      return;
    }
    if (!password.value) {
      Taro.atMessage({
        message: '请输入账号密码',
        type: 'error'
      });
      return;
    }
    login(data).then(res => {
      const { code } = res.data;
      if (code === 200) {
        Taro.atMessage({
          message: '登录成功',
          type: 'success'
        });
        Taro.setStorageSync('userId', res.data.account.id);
        Taro.setStorageSync('userProfile', res.data.profile);

        dispatch(setUserId(res.data.account.id));
        dispatch(setUserProfile(res.data.profile));
        Taro.switchTab({
          url: '/pages/index/index'
        });
      } else {
        Taro.atMessage({
          message: '登录失败',
          type: 'error'
        });
      }
    });
  };

  return (
    <View className='container'>
      <AtMessage />
      <View className='login-box'>
        <View className='title-box'>
          <Image className='title-logo' src={logo}></Image>
        </View>
        <AtInput
          focus
          name='phone'
          title='账号：'
          placeholder='请输入手机号'
          {...phone}
        />
        <AtInput
          name='password'
          title='密码：'
          placeholder='请输入密码'
          {...password}
          onConfirm={handleLogin}
        />
        <View className='button-box'>
          <AtButton circle type='primary' onClick={handleLogin}>
            登录
          </AtButton>
        </View>
      </View>
    </View>
  );
};

export default Login;
