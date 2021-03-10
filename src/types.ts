export interface Artist {
  id: number;
  name: string;
}

export interface ArtistDetail {
  briefDesc: string;
  img1v1Url: string;
  picUrl: string;
  followed: boolean;
  name: string;
  id: number;
}

export interface Album {
  id: number;
  name: string;
  picUrl: string;
  pic_str?: string;
  pic: number;
}

export interface trackItem {
  index: number;
  name: string;
  id: number;
  ar: Array<Artist>;
  al: Album;
  songUrl: string;
}

export interface creator {
  avatarUrl: string;
  nickname: string;
  userId: number;
}

export interface toplistItem {
  updateFrequency: string;
  coverImgUrl: string;
  playCount: number;
  description: string;
  name: string;
  id: number;
}
export interface recommemdListItem {
  picUrl: string;
  playCount: number;
  description: string;
  name: string;
  id: number;
}

export interface playlist {
  id: number;
  creator: creator;
  tracks: trackItem[];
  coverImgUrl: string;
  description: string;
  name: string;
  playCount: number;
  shareCount: number;
  commentCount: number;
  subscribedCount: number;
  tags: string[];
}

enum Gender {
  Secret = 0,
  Male = 1,
  Female = 2
}

export interface UserProfile {
  description: string;
  avatarUrl: string;
  followed: boolean;
  backgroundUrl: string;
  nickname: string;
  signature: string;
  followeds: number;
  follows: number;
  gender: Gender;
  eventCount: number;
  userId: number;
}

export interface AlbumDetail {
  company: string;
  picUrl: string;
  blurPicUrl: string;
  description: string;
  subType: string;
  name: string;
  id: number;
  artists: ArtistDetail[];
  artist: ArtistDetail;
}

export interface UserPlayList {
  name: string;
  id: number;
  coverImgUrl: string;
}
