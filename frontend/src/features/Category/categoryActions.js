import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosConfig } from '../../utils/axios';
import { hideLoading, showLoading } from '../Loading/loadingSlice';
import { showErrorAlert, showSuccessAlert } from '../MainAlert/mainAlertSlice';


export const getAsyncCategories = createAsyncThunk(
    'categories/getAsyncCategories',
    async (searchContent, { dispatch, getState }) => {
        try {
            const {
                search = '',
                page = 1,
                pageSize = getState().categories.categories.pageSize || 10,
                sort = {}
            } = searchContent;
            const { field = '_id', order = -1 } = sort;

            const { token } = getState().admin.adminInfo;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            if (!getState().categories.categories.category.length)
                dispatch(showLoading());
            const { data } = await axiosConfig.get(`/category/admin?search=${search}&page=${page}&pageSize=${pageSize}&sort[${field}]=${order}`, config);

            dispatch(hideLoading());
            return data;
        } catch (err) {
            dispatch(hideLoading());
            const message = err.response && err.response.data.message
                ? err.response.data.message
                : err.message;

            throw new Error(message);
        }
    }
);

export const asyncBlockCategory = createAsyncThunk(
    'categories/asyncBlockCategory',
    async (id, { getState, dispatch }) => {
        try {
            const { token } = getState().admin.adminInfo;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            await axiosConfig.patch(`/category/block/${id}`, {}, config);
            dispatch(showSuccessAlert('Category is now blocked'));
            return id;
        } catch (err) {
            dispatch(showSuccessAlert('Failed to blocked the Category'));
            const message = err.response && err.response.data.message
                ? err.response.data.message
                : err.message;
            console.log(err.response.data);
            throw new Error(message);
        }
    }
);

export const asyncUnblockCategory = createAsyncThunk(
    'categories/asyncUnblockCategory',
    async (id, { getState, dispatch }) => {
        try {
            const { token } = getState().admin.adminInfo;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            await axiosConfig.patch(`/category/unblock/${id}`, {}, config);

            dispatch(showSuccessAlert('Category is now live'));
            return id;
        } catch (err) {
            dispatch(showErrorAlert('Unable to activate the category'));
            const message = err.response && err.response.data.message
                ? err.response.data.message
                : err.message;

            throw new Error(message);
        }
    }
);

export const createAsyncCategory = createAsyncThunk(
    'categories/createAsyncCategory',
    async (payload, { getState, dispatch }) => {
        try {
            dispatch(showLoading());

            const { title, description, image } = payload;

            const formImage = new FormData();
            formImage.append('image', image, image.originalname);

            const { token } = getState().admin.adminInfo;
            const configImage = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            };
            const { data } = await axiosConfig.post('/uploads/image', formImage, configImage);

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const category = { title, description, image: data };
            await axiosConfig.post('/category', category, config);

            dispatch(hideLoading());
            dispatch(showSuccessAlert('New Category is added'));

            const { page = 1, pageSize = 10, search = '' } = getState().categories.categories;
            dispatch(getAsyncCategories({ page, pageSize, search }));
            return true;
        } catch (err) {
            dispatch(hideLoading());
            dispatch(showErrorAlert('Failed to create new Category'));
            const message = err.response && err.response.data.message
                ? err.response.data.message
                : err.message;

            throw new Error(message);
        }
    }
);


export const editAsyncCategory = createAsyncThunk(
    'categories/editAsyncCategory',
    async (payload, { getState, dispatch }) => {
        try {
            dispatch(showLoading());
            const { token } = getState().admin.adminInfo;

            const { title, description, image, id } = payload;
            const category = { title, description };

            if (image) {
                const formImage = new FormData();
                formImage.append('image', image, image.originalname);

                const configImage = {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`,
                    },
                };
                const { data } = await axiosConfig.post('/uploads/image', formImage, configImage);
                category.image = data;
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const { data } = await axiosConfig.put(`/category/${id}`, category, config);

            dispatch(hideLoading());
            dispatch(showSuccessAlert('New Category is Updated'));
            return { id, data };
        } catch (err) {
            dispatch(hideLoading());
            dispatch(showErrorAlert('Failed to update the Category'));
            const message = err.response && err.response.data.message
                ? err.response.data.message
                : err.message;

            throw new Error(message);
        }
    }
);


export const getAsyncCatogoryDetails = createAsyncThunk(
    'catogories/getAsyncCatogoryDetails',
    async (id, { dispatch, getState }) => {
        try {
            dispatch(showLoading());
            const { token } = getState().admin.adminInfo;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const { data } = await axiosConfig.get(`/category/admin/${id}`, config);

            dispatch(hideLoading());
            if (Array.isArray(data))
                return data[0];
            else
                return data;
        } catch (err) {
            dispatch(hideLoading());
            const message = err.response && err.response.data.message
                ? err.response.data.message
                : err.message;

            dispatch(showErrorAlert(message));
            throw new Error(message);
        }
    }
);


export const createAsyncSubcategory = createAsyncThunk(
    'categories/createAsyncSubategory',
    async (subcategory, { dispatch, getState }) => {
        try {
            dispatch(showLoading());

            const { token } = getState().admin.adminInfo;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const { data } = await axiosConfig.post('/category/subcategory', subcategory, config);

            dispatch(hideLoading());
            dispatch(showSuccessAlert('New Subcategory is added'));

            return data;
        } catch (err) {
            dispatch(hideLoading());
            dispatch(showErrorAlert('Failed to create new Category'));
            const message = err.response && err.response.data.message
                ? err.response.data.message
                : err.message;

            throw new Error(message);
        }
    }
);


export const eidtAsyncSubcategory = createAsyncThunk(
    'categories/editAsyncSubategory',
    async ({ id, subcategory }, { dispatch, getState }) => {
        try {
            dispatch(showLoading());

            const { token } = getState().admin.adminInfo;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const { data } = await axiosConfig.put(`/category/subcategory/${id}`, subcategory, config);
            dispatch(hideLoading());
            dispatch(showSuccessAlert('Subcategory is updated'));

            return { id, data };
        } catch (err) {
            dispatch(hideLoading());
            dispatch(showErrorAlert('Failed to update the subcategory'));
            const message = err.response && err.response.data.message
                ? err.response.data.message
                : err.message;

            throw new Error(message);
        }
    }
);


export const asyncBlockSubcategory = createAsyncThunk(
    'categories/asyncBlockSubcategory',
    async (id, { dispatch, getState }) => {
        try {
            dispatch(showLoading());

            const { token } = getState().admin.adminInfo;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            await axiosConfig.patch(`/category/subcategory/block/${id}`, {}, config);
            dispatch(hideLoading());
            dispatch(showSuccessAlert('Subcategory is blocked'));

            return id
        } catch (err) {
            dispatch(hideLoading());
            dispatch(showErrorAlert('Failed to block the subcategory'));
            const message = err.response && err.response.data.message
                ? err.response.data.message
                : err.message;

            throw new Error(message);
        }
    }
);


export const asyncUnblockSubcategory = createAsyncThunk(
    'categories/asyncUnblockSubcategory',
    async (id, { dispatch, getState }) => {
        try {
            dispatch(showLoading());

            const { token } = getState().admin.adminInfo;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            await axiosConfig.patch(`/category/subcategory/unblock/${id}`, {}, config);
            dispatch(hideLoading());
            dispatch(showSuccessAlert('Subcategory is now live'));

            return id;
        } catch (err) {
            dispatch(hideLoading());
            dispatch(showErrorAlert('Failed to unblock the subcategory'));
            const message = err.response && err.response.data.message
                ? err.response.data.message
                : err.message;

            throw new Error(message);
        }
    }
);