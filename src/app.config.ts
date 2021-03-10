export default {
  pages: [
    'pages/index/index',
    'pages/Login/index',
    'pages/Mine/index',
    'pages/PlayMusic/index',
    'pages/PlayList/index',
    'pages/User/index',
    'pages/Artist/index',
    'pages/Album/index',
    'pages/Webview/index'
  ],
  requiredBackgroundModes: ['audio'],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: '#000000',
    selectedColor: '#ee5200',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '首页',
        iconPath: './images/home.png',
        selectedIconPath: './images/home_select.png'
      },
      {
        pagePath: 'pages/Mine/index',
        text: '我的',
        iconPath: './images/user.png',
        selectedIconPath: './images/user_select.png'
      }
    ]
  }
};
