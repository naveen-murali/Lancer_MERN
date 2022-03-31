import { createSlice } from '@reduxjs/toolkit';
import {
    asyncBlockCategory,
    asyncBlockSubcategory,
    asyncUnblockCategory,
    asyncUnblockSubcategory,
    createAsyncCategory,
    createAsyncSubcategory,
    editAsyncCategory,
    eidtAsyncSubcategory,
    getAsyncCategories,
    getAsyncCatogoryDetails
} from './categoryActions';

const initialState = {
    categories: {
        category: [],
        loading: true,
        error: ''
    },
    blockCategory: {
        loading: false,
        success: false,
        error: ''
    },
    unblockCategory: {
        loading: false,
        success: false,
        error: ''
    },
    createCategory: {
        loading: false,
        success: false,
        error: ''
    },
    editCategory: {
        loading: false,
        success: false,
        error: ''
    },
    categoryDetails: {
        category: {},
        loading: false,
        error: ''
    },
    createSubcategory: {
        loading: false,
        success: false,
        error: ''
    },
    editSubcategory: {
        loading: false,
        success: false,
        error: ''
    }
};



const categoriesSlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {
        clearCategotyDetails: (state) =>
        ({
            ...state,
            categoryDetails: {
                category: {}, loading: false, error: ''
            }
        })
    },
    extraReducers: {
        [getAsyncCategories.pending]: (state) => {
            return ({
                ...state,
                categories: {
                    ...state.categories,
                    loading: true
                }
            });
        },
        [getAsyncCategories.fulfilled]: (state, { payload }) => {
            return ({
                ...state,
                categories: {
                    ...state.categories,
                    ...payload,
                    loading: false
                }
            });
        },
        [getAsyncCategories.rejected]: (state, err) => {
            return {
                ...state,
                categories: {
                    ...state.categories,
                    loading: false,
                    error: err.error.message
                }
            };
        },

        [asyncBlockCategory.pending]: (state) => {
            return ({
                ...state,
                blockCategory: {
                    ...state.blockCategory,
                    loading: true
                }
            });
        },
        [asyncBlockCategory.fulfilled]: (state, { payload }) => {
            return ({
                ...state,
                categories: {
                    ...state.categories,
                    category: state.categories.category
                        .map(cat => ({
                            ...cat,
                            isBlocked: cat._id === payload ? true : cat.isBlocked
                        }))
                },
                blockCategory: {
                    ...state.blockCategory,
                    loading: false,
                    success: true
                }
            });
        },
        [asyncBlockCategory.rejected]: (state, { error }) => {
            return ({
                ...state,
                blockCategory: {
                    ...state.blockCategory,
                    loading: false,
                    error: error.message
                }
            });
        },

        [asyncUnblockCategory.pending]: (state) => {
            return ({
                ...state,
                unblockCategory: {
                    ...state.unblockCategory,
                    loading: true
                }
            });
        },
        [asyncUnblockCategory.fulfilled]: (state, { payload }) => {
            return ({
                ...state,
                categories: {
                    ...state.categories,
                    category: state.categories.category
                        .map(cat => ({
                            ...cat,
                            isBlocked: cat._id === payload ? false : cat.isBlocked
                        }))
                },
                unblockCategory: {
                    ...state.unblockCategory,
                    loading: false,
                    success: true
                }
            });
        },
        [asyncUnblockCategory.rejected]: (state, { error }) => {
            return ({
                ...state,
                unblockCategory: {
                    ...state.unblockCategory,
                    loading: false,
                    error: error.message
                }
            });
        },

        [createAsyncCategory.pending]: (state) => {
            return ({
                ...state,
                createCategory: {
                    ...state.createCategory,
                    loading: true,
                    success: false
                }
            });
        },
        [createAsyncCategory.fulfilled]: (state) => {
            return ({
                ...state,
                createCategory: {
                    ...state.createCategory,
                    loading: false,
                    success: true
                }
            });
        },
        [createAsyncCategory.rejected]: (state, { error }) => {
            return ({
                ...state,
                createCategory: {
                    ...state.createCategory,
                    loading: false,
                    error: error.message
                }
            });
        },

        [editAsyncCategory.pending]: (state) => {
            return ({
                ...state,
                editCategory: {
                    ...state.editCategory,
                    loading: true,
                    success: false
                }
            });
        },
        [editAsyncCategory.fulfilled]: (state, { payload }) => {
            return ({
                ...state,
                categories: {
                    ...state.categories,
                    category: state.categories.category
                        .map(cat => cat._id === payload.id ? payload.data : cat)
                },
                editCategory: {
                    ...state.editCategory,
                    loading: false,
                    success: true
                }
            });
        },
        [editAsyncCategory.rejected]: (state, { error }) => {
            return ({
                ...state,
                editCategory: {
                    ...state.editCategory,
                    loading: false,
                    error: error.message
                }
            });
        },

        [getAsyncCatogoryDetails.pending]: (state) => {
            return ({
                ...state,
                categoryDetails: {
                    ...state.categoryDetails,
                    loading: true,
                }
            });
        },
        [getAsyncCatogoryDetails.fulfilled]: (state, { payload }) => {
            return ({
                ...state,
                categoryDetails: {
                    ...state.categoryDetails,
                    loading: true,
                    category: payload
                }
            });
        },
        [getAsyncCatogoryDetails.rejected]: (state, { error }) => {
            return ({
                ...state,
                categoryDetails: {
                    ...state.categoryDetails,
                    loading: false,
                    error: error.message
                }
            });
        },
        [createAsyncSubcategory.pending]: (state) => {
            return ({
                ...state,
                createSubcategory: {
                    ...state.categoryDetails,
                    loading: true,
                    success: false
                }
            });
        },
        [createAsyncSubcategory.fulfilled]: (state, { payload }) => {
            const { categoryDetails: { category } } = state;
            return ({
                ...state,
                categoryDetails: {
                    ...state.categoryDetails,
                    category: {
                        ...category,
                        subcategory: [payload, ...category.subcategory]
                    }
                },
                createSubcategory: {
                    ...state.categoryDetails,
                    loading: false,
                    success: true
                }
            });
        },
        [createAsyncSubcategory.rejected]: (state, { error }) => {
            return ({
                ...state,
                createSubcategory: {
                    ...state.categoryDetails,
                    loading: false,
                    error: error.message
                }
            });
        },

        [eidtAsyncSubcategory.pending]: (state) => {
            return ({
                ...state,
                editSubcategory: {
                    ...state.editSubcategory,
                    loading: true,
                    success: false
                }
            });
        },
        [eidtAsyncSubcategory.fulfilled]: (state, { payload }) => {
            const { id, data } = payload;
            const { categoryDetails: { category } } = state;
            return ({
                ...state,
                categoryDetails: {
                    ...state.categoryDetails,
                    category: {
                        ...category,
                        subcategory: category.subcategory
                            .map(sub => sub._id === id ? data : sub)
                    }
                },
                editSubcategory: {
                    ...state.editSubcategory,
                    loading: false,
                    success: true
                }
            });
        },
        [eidtAsyncSubcategory.rejected]: (state, { error }) => {
            return ({
                ...state,
                editSubcategory: {
                    ...state.editSubcategory,
                    loading: false,
                    error: error.message
                }
            });
        },
        [asyncBlockSubcategory.pending]: (state) => {
            return ({
                ...state,
                blockSubcategory: {
                    ...state.blockSubcategory,
                    loading: true,
                    success: false
                }
            });
        },
        [asyncBlockSubcategory.fulfilled]: (state, { payload }) => {
            const id = payload;
            const { categoryDetails: { category } } = state;
            return ({
                ...state,
                categoryDetails: {
                    ...state.categoryDetails,
                    category: {
                        ...category,
                        subcategory: category.subcategory
                            .map(sub => ({
                                ...sub,
                                isBlocked: sub._id === id
                                    ? true : sub.isBlocked
                            }))
                    }
                },
                blockSubcategory: {
                    ...state.blockSubcategory,
                    loading: false,
                    success: true
                }
            });
        },
        [asyncBlockSubcategory.rejected]: (state, { error }) => {
            return ({
                ...state,
                blockSubcategory: {
                    ...state.blockSubcategory,
                    loading: false,
                    error: error.message
                }
            });
        },

        [asyncUnblockSubcategory.pending]: (state) => {
            return ({
                ...state,
                blockSubcategory: {
                    ...state.unblockSubcategory,
                    loading: true,
                    success: false
                }
            });
        },
        [asyncUnblockSubcategory.fulfilled]: (state, { payload }) => {
            const id = payload;
            const { categoryDetails: { category } } = state;
            return ({
                ...state,
                categoryDetails: {
                    ...state.categoryDetails,
                    category: {
                        ...category,
                        subcategory: category.subcategory
                            .map(sub => ({
                                ...sub,
                                isBlocked: sub._id === id
                                    ? false : sub.isBlocked
                            }))
                    }
                },
                unblockSubcategory: {
                    ...state.unblockSubcategory,
                    loading: false,
                    success: true
                }
            });
        },
        [asyncUnblockSubcategory.rejected]: (state, { error }) => {
            return ({
                ...state,
                unblockSubcategory: {
                    ...state.unblockSubcategory,
                    loading: false,
                    error: error.message
                }
            });
        },
    }
});

export const getCategories = (state) => state.categories.categories;
export const getBlockCategory = (state) => state.categories.blockCategory;
export const getCreateCategory = (state) => state.categories.createCategory;
export const getEditCategory = (state) => state.categories.editCategory;
export const getCategoryDetails = (state) => state.categories.categoryDetails;
export const getCreateSubcategory = (state) => state.categories.createSubcategory;
export const getEditSubcategory = (state) => state.categories.editSubcategory;

export const { clearCategotyDetails } = categoriesSlice.actions;
export const categoriesReducers = categoriesSlice.reducer;