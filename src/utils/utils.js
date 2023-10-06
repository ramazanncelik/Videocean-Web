import store from "@/store";
import { logout, user } from "@/store/auth";
import { setMyLikedVideos } from "@/store/myLikedVideos";
import { setMySavedVideos } from "@/store/mySavedVideos";
import { setMySubsCriptions } from "@/store/mySubscriptions";
import { setMyVideos } from "@/store/myVideos";

export const mainColor = "#e11d48"; // Theme main color
export const defaultImage = "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=";
export const serverUrl = "https://videocean-server.adaptable.app/"

export const setUserData = (infos) => {
  if (infos) {
    store.dispatch(user(infos));
  } else {
    store.dispatch(logout());
  }
}

export const setUserVideosData = (videos) => {
  if (videos) {
    store.dispatch(setMyVideos(videos));
  }
}

export const setUserSubsctiptionsData = (subscriptions) => {
  if (subscriptions) {
    store.dispatch(setMySubsCriptions(subscriptions));
  }
}

export const setUserSavedVideosData = (savedVideos) => {
  if (savedVideos) {
    store.dispatch(setMySavedVideos(savedVideos));
  }
}

export const setUserLikedVideosData = (likedVideos) => {
  if (likedVideos) {
    store.dispatch(setMyLikedVideos(likedVideos));
  }
}