import Vue from 'vue'
import Router from 'vue-router'
import component from './component'

// export const routeLists = [component];

export const generalRoutes = {
  path: '/',
  component: () => import('@/views/Index'),
  meta: { title: 'Home', icon: 'mdi-view-dashboard' },
  children: [
    // {
    //   path: '/',
    //   redirect: 'dashboard',
    // },
    // {
    //   path: '/dashboard',
    //   name: 'dashboard',
    //   component: () => import('@/views/dashboard/Dashboard'),
    // },
    {
      path: '/',
      name: 'dashboard',
      // component: () => import('@/views/dashboard/Dashboard'),
      component: () => import('@/views/pages/MyDashboard'),
      meta: { title: 'Dashboard', icon: 'mdi-view-dashboard' },
    },
    {
      path: '/account-settings',
      name: 'accountsettings',
      component: () => import('@/views/pages/account-settings/AccountSettings'),
      meta: { title: 'Account Setting', icon: 'mdi-account' },
    },
    {
      path: '/customer',
      name: 'customer',
      component: () => import('@/views/pages/customer/customer'),
      meta: { title: 'Customer', icon: 'mdi-account-box' },
    },
    {
      path: '/product',
      name: 'product',
      component: () => import('@/views/pages/product/product'),
      meta: { title: 'Product', icon: 'mdi-tshirt-crew' },
    },
    {
      path: '/product/:id',
      component: () => import('@/views/pages/product/productCRUD'),
      meta: { title: 'Product Detail', icon: 'mdi-tshirt-crew' },
      hidden: true
    },
    {
      path: '/category',
      name: 'category',
      component: () => import('@/views/pages/category/category'),
      meta: { title: 'Category', icon: 'mdi-shape' },
    },
    {
      path: '/inventory',
      name: 'inventory',
      component: () => import('@/views/pages/inventory/inventory'),
      meta: { title: 'Inventory', icon: 'mdi-warehouse' },
    },
    {
      path: '/stockin',
      name: 'stockin',
      component: () => import('@/views/pages/stockin/stockin'),
      meta: { title: 'Stock In', icon: 'mdi-home-import-outline' },
    },
    {
      path: '/stockin/:id',
      component: () => import('@/views/pages/stockin/stockinCRUD'),
      meta: { title: 'Stock In Detail', icon: 'mdi-home-import-outline' },
      hidden: true
    },
    {
      path: '/stockout',
      name: 'stockout',
      component: () => import('@/views/pages/stockout/stockout'),
      meta: { title: 'Stock Out', icon: 'mdi-home-export-outline' },
    },
    {
      path: '/stockout/:id',
      component: () => import('@/views/pages/stockout/stockoutCRUD'),
      meta: { title: 'Stock Out Detail', icon: 'mdi-home-export-outline' },
      hidden: true
    },
    {
      path: '/order',
      name: 'order',
      component: () => import('@/views/pages/order/order'),
      meta: { title: 'Order', icon: 'mdi-shopping-outline' },
    },
    {
      path: '/order/:id',
      component: () => import('@/views/pages/order/orderCRUD'),
      meta: { title: 'Order Detail', icon: 'mdi-shopping-outline' },
      hidden: true
    },
    {
      path: '/companyinfo',
      name: 'companyinfo',
      component: () => import('@/views/pages/companyinfo/companyInfo'),
      meta: { title: 'Company Info', icon: 'mdi-home-city-outline' },
    },
    // {
    //   path: '/warehouse',
    //   name: 'warehouse',
    //   component: () => import('@/views/pages/warehouse/warehouse'),
    //   meta: { title: 'Warehouse', icon: 'mdi-home-analytics' },
    // },
    // {
    //   path: '/typography',
    //   name: 'typography',
    //   component: () => import('@/views/typography/Typography.vue'),
    //   meta: { title: 'Typography', icon: 'mdi-view-dashboard' },
    // },
    // {
    //   path: '/icons',
    //   name: 'icons',
    //   component: () => import('@/views/icons/Icons.vue'),
    //   meta: { title: 'Icons', icon: 'mdi-view-dashboard' },
    // },
    // {
    //   path: '/simple-table',
    //   name: 'simple-table',
    //   component: () => import('@/views/simple-table/SimpleTable.vue'),
    //   meta: { title: 'Simple Table', icon: 'mdi-view-dashboard' },
    // }, 
    // {
    //   path: '/form-layouts',
    //   name: 'form-layouts',
    //   component: () => import('@/views/form-layouts/FormLayouts.vue'),
    //   meta: { title: 'Form Layout', icon: 'mdi-view-dashboard' },
    // },
    // {
    //   path: '/login',
    //   name: 'pages-login',
    //   component: () => import('@/views/pages/Login.vue'),
    //   meta: { title: 'Login', icon: 'mdi-view-dashboard', layout: 'blank' },
    // },
    // {
    //   path: '/login',
    //   name: 'login',
    //   component: () => import('@/views/Login.vue'),
    //   meta: {
    //     layout: 'blank',
    //   },
    // },
    // {
    //   path: '/register',
    //   name: 'pages-register',
    //   component: () => import('@/views/pages/Register.vue'),
    //   meta: { title: 'Register', icon: 'mdi-view-dashboard', layout: 'blank' },
    // },
    // {
    //   path: '/error-404',
    //   name: 'error-404',
    //   component: () => import('@/views/Error.vue'),
    //   meta: { title: '404', icon: 'mdi-view-dashboard', layout: 'blank' },
    // },
    // {
    //   path: '*',
    //   redirect: 'error-404',
    // },
  ]
}

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    generalRoutes,
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/pages/Login.vue'),
      meta: { title: 'Login', icon: 'mdi-view-dashboard', layout: 'blank' },
    },
    {
      name: 'NotFound',
      path: '*',
      component: () => import('@/views/Error'),
      meta: { title: 'Not Found' }
    },
  ],
})

