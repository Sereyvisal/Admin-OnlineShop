import request from '@/utils/request';

export function listStockIn(data) {
    return request({
        url: '/stockin/list',
        method: 'post',
        data: data
    })
}

export function upsertStockIn(data) {
    return request({
        url: '/stockin/upsert',
        method: 'post',
        data: data
    })
}

export function getStockIn(id) {
    return request({
        url: `/stockin/${id}`,
        method: 'get',
    });
}

export function deleteStockIn(id) {
    return request({
        url: '/stockin/delete/' + id,
        method: 'delete'
    })
}