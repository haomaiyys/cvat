// Copyright (C) 2020 Intel Corporation
//
// SPDX-License-Identifier: MIT

import { AnyAction, Dispatch, ActionCreator } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { CombinedState, ProjectsQuery } from 'reducers/interfaces';
import { getCVATStore } from 'cvat-store';
import getCore from 'cvat-core-wrapper';

const cvat = getCore();

export enum ProjectsActionTypes {
    UPDATE_PROJECTS_GETTING_QUERY = 'UPDATE_PROJECTS_GETTING_QUERY',
    GET_PROJECTS = 'GET_PROJECTS',
    GET_PROJECTS_SUCCESS = 'GET_PROJECTS_SUCCESS',
    GET_PROJECTS_FAILED = 'GET_PROJECTS_FAILED',
    CREATE_PROJECT = 'CREATE_PROJECT',
    CREATE_PROJECT_SUCCESS = 'CREATE_PROJECT_SUCCESS',
    CREATE_PROJECT_FAILED = 'CREATE_PROJECT_FAILED',
    DELETE_PROJECT = 'DELETE_PROJECT',
    DELETE_PROJECT_SUCCESS = 'DELETE_PROJECT_SUCCESS',
    DELETE_PROJECT_FAILED = 'DELETE_PROJECT_FAILED',
}

export function updateProjectsGettingQuery(query: Partial<ProjectsQuery>): AnyAction {
    const action = {
        type: ProjectsActionTypes.UPDATE_PROJECTS_GETTING_QUERY,
        payload: {
            query,
        },
    };

    return action;
}

function getProjects(): AnyAction {
    const action = {
        type: ProjectsActionTypes.GET_PROJECTS,
        payload: {},
    };

    return action;
}

function getProjectsSuccess(array: any[], count: number): AnyAction {
    const action = {
        type: ProjectsActionTypes.GET_PROJECTS_SUCCESS,
        payload: {
            array,
            count,
        },
    };

    return action;
}

function getProjectsFailed(error: any): AnyAction {
    const action = {
        type: ProjectsActionTypes.GET_PROJECTS_FAILED,
        payload: {
            error,
        },
    };

    return action;
}

export function getProjectsAsync():
ThunkAction<Promise<void>, {}, {}, AnyAction> {
    return async (dispatch: ActionCreator<Dispatch>): Promise<void> => {
        const {
            projects: {
                gettingQuery,
            },
        } = getCVATStore().getState() as CombinedState;

        dispatch(getProjects());

        // Clear query object from null fields
        const filteredQuery = { ...gettingQuery };
        for (const key in filteredQuery) {
            if (filteredQuery[key] === null) {
                delete filteredQuery[key];
            }
        }

        let result = null;
        try {
            result = await cvat.projects.get(filteredQuery);
        } catch (error) {
            dispatch(getProjectsFailed(error));
            return;
        }

        const array = Array.from(result);
        dispatch(getProjectsSuccess(array, result.count));
    };
}

function createProject(): AnyAction {
    const action = {
        type: ProjectsActionTypes.CREATE_PROJECT,
        payload: {},
    };

    return action;
}

function createProjectSuccess(projectId: number): AnyAction {
    const action = {
        type: ProjectsActionTypes.CREATE_PROJECT_SUCCESS,
        payload: {
            projectId,
        },
    };

    return action;
}

function createProjectFailed(error: any): AnyAction {
    const action = {
        type: ProjectsActionTypes.CREATE_PROJECT_FAILED,
        payload: {
            error,
        },
    };

    return action;
}

export function createProjectAsync(data: any):
ThunkAction<Promise<void>, {}, {}, AnyAction> {
    return async (dispatch: ActionCreator<Dispatch>): Promise<void> => {
        const projectInstance = new cvat.classes.Project(data);

        dispatch(createProject());
        try {
            const savedProject = await projectInstance.save();
            dispatch(createProjectSuccess(savedProject.id));
        } catch (error) {
            // FIXME: error length
            dispatch(createProjectFailed(error));
        }
    };
}

function deleteProject(projectId: number): AnyAction {
    const action = {
        type: ProjectsActionTypes.DELETE_PROJECT,
        payload: {
            projectId,
        },
    };
    return action;
}

function deleteProjectSuccess(projectId: number): AnyAction {
    const action = {
        type: ProjectsActionTypes.DELETE_PROJECT_SUCCESS,
        payload: {
            projectId,
        },
    };
    return action;
}

function deleteProjectFailed(projectId: number, error: any): AnyAction {
    const action = {
        type: ProjectsActionTypes.DELETE_PROJECT_FAILED,
        payload: {
            projectId,
            error,
        },
    };
    return action;
}

export function deleteProjectAsync(projectInstance: any):
ThunkAction<Promise<void>, {}, {}, AnyAction> {
    return async (dispatch: ActionCreator<Dispatch>): Promise<void> => {
        dispatch(deleteProject(projectInstance.id));
        try {
            await projectInstance.delete();
            dispatch(deleteProjectSuccess(projectInstance.id));
        } catch (error) {
            // FIXME: error length
            dispatch(deleteProjectFailed(projectInstance.id, error));
        }
    };
}
