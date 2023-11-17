import * as apiService from "@/services/apiService";

const getAnnouncementList = (params) => apiService.get("mystery-web-user/announcement/annListPage", params); // 获取新闻列表

const getAnnouncementDetails = (params) => apiService.get("mystery-web-user/announcement/annDetails", params); // 获取新闻详情

export { getAnnouncementList, getAnnouncementDetails };
