const component = {
    path: '/component',
    name: 'component',
    component: () => import("@/views/Index"),
    meta: { title: 'Component', icon: 'mdi-view-dashboard' },
    children: [
    {
        path: 'simpletable',
        name: 'simpletable',
        component: () => import('@/views/simple-table/SimpleTable.vue'),
        meta: { title: 'Simple Table', icon: 'mdi-view-dashboard' },
    },
    {
        path: 'cards',
        name: 'cards',
        component: () => import('@/views/cards/Card.vue'),
        meta: { title: 'Card', icon: 'mdi-view-dashboard' },
    }
    ]
}

export default component