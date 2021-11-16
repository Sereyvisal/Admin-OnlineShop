import Vue from 'vue';
import Vuex from 'vuex';

import { login, getUserInfo } from "@/api/generalAPI";
import { meta } from "@/utils/enum";
import { getToken, setToken, removeToken } from '@/utils/auth';
import router, { routeLists } from "@/router";
import { getCompanyInfo } from "@/api/companyInfo";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    barColor: 'rgba(0, 0, 0, .8), rgba(0, 0, 0, .8)',
    barImage: 'https://demos.creative-tim.com/material-dashboard/assets/img/sidebar-1.jpg',
    drawer: null,
    companyInfo: {},
    token: getToken(),
    userInfo: {},
    permissionInfo: [],
    routers: [],
  },
  mutations: {
    SET_BAR_IMAGE(state, payload) {
      state.barImage = payload
    },
    SET_DRAWER(state, payload) {
      state.drawer = payload
    },
    SET_COMPANYINFO(state, data) {
      state.companyInfo = data
    },
    SET_TOKEN(state, token) {
      state.token = token
    },
    SET_USERINFO: (state, info) => {
      state.userInfo = info
    },
    SET_PERMISSION: (state, pinfo) => {
      state.permissionInfo = pinfo
    },
    SET_ROUTERS: (state, routers) => {
      state.routers = routers
    },
  },
  actions: {
    GetCompanyInfo: ({ commit }) => {
      return getCompanyInfo().then(res => {
        commit('SET_COMPANYINFO', res.data || {})
        return res.data || {}
      })
        .catch(err => console.log(err))
    },
    Login({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        console.log("userInfo: ", userInfo)
        return login(userInfo).then(res => {
          if (res.meta == meta.OK) {
            setToken(res.data.token);
            commit('SET_TOKEN', res.data.token);
          }
          resolve(res);
        }).catch(error => {
          reject(error);
        })
      })
    },
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        commit('SET_TOKEN', '');
        commit('SET_USERINFO', {});
        commit('SET_PERMISSION', {});
        removeToken();
        resolve();
      })
    },
    GetUserInfo({ commit }) {
      return new Promise((resolve, reject) => {
        getUserInfo().then(res => {
          commit('SET_USERINFO', res.data);
          commit('SET_PERMISSION', res.data.role);
          resolve(res)
        }).catch(error => {
          reject(error)
        })
          .catch(err => console.log(err))
      })
    },
    UpdateUserInfo({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        commit('SET_USERINFO', userInfo);
        resolve();
      })
    },
    GenerateRoutes({ commit }, data) {
      return new Promise((resolve, reject) => {
        const pi = data.data.role
        
        if (pi != undefined) {
          let accessedRouters;

          if (pi.role_id == 1) {
            // console.log("aaa: ", router)
            accessedRouters = routeLists;
          }

          // if (pi.isAdmin) {
          //   accessedRouters = routeLists;
          // } else {
          //   accessedRouters = filterAsyncRouter(routeLists, pi, isHead);
          // }

          commit('SET_ROUTERS', accessedRouters);
          resolve(accessedRouters);
        } else {
          reject(pi)
        }

      })
    },
  },

  getters: {
    companyInfo: state => state.companyInfo,
    token: state => state.token,
    permissionInfo: state => state.permissionInfo,
    userInfo: state => state.userInfo,
    routers: state => state.routers,
    barColor: state => state.barColor,
    barImage: state => state.barImage,
    drawer: state => state.drawer,
  }
})

// function hasPermission(plInfo, route, isHead) {
//   if (plInfo.isAdmin) {
//     return true
//   }

//   if (route.meta && route.meta.funcs) {
//     if (Array.isArray(route.meta.funcs)) {
//       return (isHead && route.meta.allowHead) || route.meta.funcs.some(func => plInfo.functions[func] != undefined && plInfo.functions[func].read)
//     } else {
//       return (isHead && route.meta.allowHead) || (plInfo.functions[route.meta.funcs] !== undefined && plInfo.functions[route.meta.funcs].read)
//     }
//   } else {
//     return true
//   }
// }

// function filterAsyncRouter(asyncRouterMap, plInfo, isHead) {
//   const accessedRouters = asyncRouterMap.filter(route => {
//     if (hasPermission(plInfo, route, isHead)) {
//       if (route.children && route.children.length) {
//         route.children = filterAsyncRouter(route.children, plInfo, isHead)
//       }
//       return true
//     }
//     return false
//   })
//   return accessedRouters
// }