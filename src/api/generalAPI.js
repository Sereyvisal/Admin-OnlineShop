import serverConfig from '@/utils/serverConfig';
import axios from "axios";
import request from "@/utils/request";
import store from '@/store';

//Upload Multiple Files by process them on backend
export async function uploadFiles(data) {
    const res = await axios.post(`${serverConfig.api_url}/uploads`, data, {
        headers: {
            Authorization: store.getters.token,
            "Content-Type": "multipart/form-data",
        },
    });

    return res.data;
}

//Upload Single File
export async function uploadFile(data) {
    const res = await axios.post(`${serverConfig.api_url}/upload`, data, {
        headers: {
            Authorization: store.getters.token,
            "Content-Type": "multipart/form-data",
        },
    });

    return res.data;
}

//Upload Single File
export async function lazyFileUpload(data) {
    const fileForm = new FormData();
    fileForm.append("file", data);
    const res = await axios.post(`${serverConfig.api_url}/upload`, fileForm, {
        headers: {
            Authorization: store.getters.token,
            "Content-Type": "multipart/form-data",
        },
    });

    return res.data;
}

export function deleteFile(md5) {
    return request({
        url: `/file/${md5}`,
        method: 'delete',
    })
}

export function getFileObj(data) {
    return request({
        url: `/objfile/${data}`,
        method: 'get',
    })
}

export function getFile(data) {
    return request({
        url: `/file/${data}`,
        method: 'get',
    })
}

export function login(data) {
    return request({
        url: "/login",
        method: "post",
        data: data
    })
}

export function isAdmin(data) {
    return request({
        url: "/isadmin",
        method: "post",
        data: data
    })
}

export function registerLite(data) {
    return request({
        url: "/register/lite",
        method: "post",
        data: data
    })
}

export function resetPwd(data) {
    return request({
        url: "/user/resetpwd",
        method: "post",
        data: data,
    })
}

export function listUser(data) {
    return request({
        url: "/user/list",
        method: "post",
        data: data
    })
}

export function listCustomer(data) {
    return request({
        url: "/user/customer/list",
        method: "post",
        data: data
    })
}

export function getUserInfo() {
    return request({
        url: "/user/info",
        method: "get",
    })
}

export function updateUserInfo(data) {
    return request({
        url: "/user",
        method: "put",
        data: data
    })
}