## taro3-music

> 基于`Taro`与网易云音乐api开发的网易云音乐小程序客户端，技术栈主要是：`typescript+taro+taro-ui+redux`。
<hr/>

> [vue3版本](https://github.com/xuedingesmiao/taro3-music-vue3)

### 快速开始

首先在src目录下创建一个config文件夹,再创建一个index.ts文件，接口服务是使用的[NeteaseCloudMusicApi](https://binaryify.github.io/NeteaseCloudMusicApi/#/)

```
export const BASE_URL = 'http://localhost:3000' // 这里的配置的这个url是后端服务的请求地址，如果需要真机上调试，请改成运行NeteaseCloudMusicApi机器的ip地址

```

> 在运行本项目前，请先确保已经全局安装了Taro，安装可见[官网指导](https://taro-docs.jd.com/taro/docs/GETTING-STARTED)


### 运行项目
```
启动后端接口服务

git clone https://github.com/Binaryify/NeteaseCloudMusicApi.git

cd NeteaseCloudMusicApi

npm i

npm run start

启动前端项目

git clone https://github.com/xuedingesmiao/taro3-music.git

cd taro3-music

npm i

npm run dev:weapp

```

### 功能列表

- [x] 用户登陆
- [x] 退出登陆
- [x] 我创建的歌单列表
- [x] 歌单详情列表
- [x] 歌手详情列表
- [x] 专辑详情列表
- [x] 歌曲播放页面
- [x] 歌词
- [x] 歌曲切换播放模式（随机播放/单曲循环/顺序播放）
- [x] 切换上一首/下一首
- [x] 喜欢/取消喜欢某首歌曲


### 效果图预览

> 下面简要列出几张效果图

- 首页

<div align="center">
  <image width="340" src="./screenShot/首页.png"/>
</div>

- 我的页面

<div align="center">
  <image width="340" src="./screenShot/我的.png"/>
  <image width="340" src="./screenShot/我的（未登录）.png"/>
</div>

- 登陆页面
  
<div align="center">
  <image width="340" src="./screenShot/登录.png"/>
</div>

- 歌单

<div align="center">
  <image width="340" src="./screenShot/歌单1.png"/>
  <image width="340" src="./screenShot/歌单2.png"/>
</div>

- 播放页面

<div align="center">
  <image width="340" src="./screenShot/播放1.png"/>
  <image width="340" src="./screenShot/播放2.png"/>
</div>


- 歌手页面

<div align="center">
  <image width="340" src="./screenShot/歌手详情.png"/>
</div>

- 专辑页面

<div align="center">
  <image width="340" src="./screenShot/专辑详情.png"/>
  <image width="340" src="./screenShot/专辑描述.png"/>
</div>

