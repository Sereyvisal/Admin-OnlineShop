import request from '@/utils/request';

export function listStockOut(data) {
    return request({
        url: '/stockout/list',
        method: 'post',
        data: data
    })
}

export function upsertStockOut(data) {
    return request({
        url: '/stockout/upsert',
        method: 'post',
        data: data
    })
}

export function getStockOut(id) {
    return request({
        url: `/stockout/${id}`,
        method: 'get',
    });
}

export function deleteStockOut(id) {
    return request({
        url: '/stockout/delete/' + id,
        method: 'delete'
    })
}