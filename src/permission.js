import router from './router';
import store from './store';
import _ from "lodash";
import Vue from "vue";

router.beforeEach((to, from, next) => {
    if (_.isEmpty(store.getters.companyInfo)) {
        store.dispatch('GetCompanyInfo');
    }
    
    if (store.getters.token) {
        if (_.isEmpty(store.getters.userInfo)) {
            store.dispatch('GetUserInfo').then(info => {
                // store.dispatch('GenerateRoutes', info).then(routes => {
                //     routes.forEach(r => router.addRoute(r))
                //     if (to.path == '/login') {
                //         next({ path: '/' })
                //     } else {
                //         next({ path: to.fullPath })
                //     }
                // })

                if (to.path == '/login') {
                    next({ path: '/' })
                } else {
                    next({ path: to.fullPath })
                }
            })
        }
        else {
            next();
        }
    }
    else if (to.path != '/login' && to.path != '/test') {
        next({ path: '/login', replace: true })
    } else {
        next()
    }
})

Vue.mixin({
    data() {
        return {
            functionName: ''
        }
    },
    mounted() {
        if (this.$route !== undefined && this.$route.meta !== undefined) {
            this.functionName = this.$route.meta.funcs
        }
    },
    methods: {
        // permissionCheck(...param) {
        //     const action = param[0];
        //     const fName = param.length === 2 ? param[1] : this.functionName;
        //     const permissionInfo = store.getters.permissionInfo;

        //     if (permissionInfo.isAdmin) {
        //         return true;
        //     }

        //     if (permissionInfo.functions === undefined) {
        //         return false;
        //     }

        //     const fd = permissionInfo.functions[fName];

        //     if (fd === undefined) {
        //         return false;
        //     }

        //     if (fd[action] === true) {
        //         return true;
        //     } else {
        //         return false;
        //     }
        // },
    }
});