import { defineStore } from "pinia";

import {
  userInvateStatistics,
  rebatesCreateCode,
  rebatesFindList,
  rebatesDetailPageList,
  rebatesReceive,
} from "@/services/api/invite";

export const useInviteStore = defineStore("inviteStore", {
  state: () => ({
    userInvateStatistics: [],
    rebatesCreateCode: "",
    rebatesFindList: [],
    rebatesDetailPageList: [],
    rebatesReceive: "",
  }),
  actions: {
    async getUserInvateStatisticsApi(params) {
      const res = await userInvateStatistics(params);
      if (res && res.data) {
        this.userInvateStatistics = res.data;
      }
    },
    async getRebatesCreateCodeApi(params) {
      // params => code
      const res = await rebatesCreateCode(params);
      if (res && res.data) {
        this.rebatesCreateCode = res.data;
      }
    },
    async getRebatesFindListApi(params) {
      const res = await rebatesFindList(params);
      if (res && res.data) {
        this.rebatesFindList = res.data;
      }
    },
    async getRebatesDetailPageListApi(params) {
      // params => page & size
      const res = await rebatesDetailPageList(params);
      if (res && res.data) {
        this.rebatesDetailPageList = res.data;
      }
    },
    async getRebatesReceiveApi(params) {
      // params => inviteCode
      const res = await rebatesReceive(params);
      if (res && res.data) {
        this.rebatesReceive = res.data;
      }
    },
  },
});
