import axios from 'axios';
import {Session} from 'next-auth';
// import useSWR, {SWRResponse} from 'swr';
// import {useSession} from 'next-auth/react';
// import {any} from 'prop-types';

export enum Api {
    /* eslint-disable no-unused-vars */
    /* eslint-disable max-len */
    GarbageCollectionScheduleTemplateDetail = 'garbage_collection_schedule_templates/:id/',
    GarbageCollectionScheduleTemplateDetailEntries = 'garbage_collection_schedule_templates/:id/entries/',
    GarbageCollectionScheduleTemplateEntryDetail = 'garbage_collection_schedule_template_entries/:id/',
    GarbageTypes = 'garbage_types/',
    GarbageTypeDetail = 'garbage_types/:id/',
    GarbageCollectionScheduleDetail = 'garbage_collection_schedules/:id',
    LocationGroups = 'location_groups/',
    LocationGroupDetail = 'location_groups/:id/',
    LocationGroupDetailBuildings = 'location_groups/:id/buildings/',
    LocationGroupDetailScheduleDefinitions = 'location_groups/:id/schedule_definitions/',
    Buildings = 'buildings/',
    BuildingDetail = 'buildings/:id/',
    BuildingDetailGarbageCollectionSchedules = 'buildings/:id/garbage_collection_schedules/',
    BuildingDetailGarbageCollectionScheduleTemplates = 'buildings/:id/garbage_collection_schedule_templates/',
    BuildingDetailIssues = 'buildings/:id/issues/',
    BuildingDetailScheduleDefinitions = 'buildings/:id/schedule_definitions/',
    ScheduleAssignments = 'schedule_assignments/',
    ScheduleAssignmentDetail = 'schedule_assignments/:id/',
    ScheduleWorkEntries = 'schedule_work_entries/',
    ScheduleWorkEntryDetail = 'schedule_work_entries/:id/',
    ScheduleDefinitions = 'schedule_definitions/',
    ScheduleDefinitionDetail = 'schedule_definitions/:id/',
    ScheduleDefinitionDetailBuildings = 'schedule_definitions/:id/buildings/',
    ScheduleDefinitionDetailScheduleAssignments = 'schedule_definitions/:id/schedule_assignments/',
    ScheduleDefinitionDetailScheduleWorkEntries = 'schedule_definitions/:id/schedule_work_entries/',
    Users = 'users/',
    UserDetail = 'users/:id/',
}


// type PaginatedResponse<T> = {
//     count: number;
//     next: string | null;
//     previous: string | null;
//     results: T[];
// };
//
// /**
//  * @param {Array<string>} args
//  * @return {Promise<T>}
//  * **/
// async function fetcher<T>(args: Array<string>): Promise<T> {
//     // @ts-ignore
//     // eslint-disable-next-line no-undef
//     return fetch(process.env.NEXT_API_URL + args[1].slice(1), {
//         headers: {
//             'Authorization': `Bearer ${args[0]}`,
//         },
//     }).then((res) => {
//         return res.json() as Promise<T>;
//     });
// }
//
// /**
//  * @param {Api} route API route to request
//  * @param {any} params :param parameters to replace in request URL (e.g. :id)
//  * @param {any} query query parameters to include in request
//  * @return {SWRResponse}
//  * **/
// export function getList<T>(route: Api, params: any, query: any): SWRResponse<PaginatedResponse<T>, any> {
//     let routeStr = route.toString();
//     for (const property in params) {
//         routeStr = routeStr.replace(':' + property, params[property]);
//     }
//
//     const queryParams = new URLSearchParams(query);
//     routeStr += '?' + queryParams.toString();
//
//     const {data: session} = useSession();
//
//     // @ts-ignore
//     const token = session ? session.accessToken : '';
//
//     return useSWR<PaginatedResponse<T>>([token, routeStr], fetcher);
// }
//
// /**
//  * @param {Api} route API route to request
//  * @param {any} id ID of detail route to use
//  * @return {SWRResponse}
//  * **/
// export function getDetail<T>(route: Api, id: number): SWRResponse<T, any> {
//     const routeStr = route.replace(':id', id.toString());
//
//     const {data: session} = useSession();
//
//     // @ts-ignore
//     const token = session ? session.accessToken : '';
//
//     return useSWR<T>([token, routeStr], fetcher);
// }


const getAuthHeader = (session: any) => (session ? {Authorization: `Bearer ${session.accessToken}`} : {});

export async function getListFromApi(route: Api, session: any, params: any, query: any) {
    let routeStr = route.toString();
    for (const property in params) {
        routeStr = routeStr.replace(':' + property, params[property]);
    }
    const queryParams = new URLSearchParams(query);
    routeStr += '?' + queryParams.toString();

    const data = await axios.get(process.env.NEXT_API_URL + routeStr, {headers: getAuthHeader(session)});

    if (!('data' in data) || !('results' in data.data)) {
        throw new Error('could not fetch data from api');
    }

    return data.data.results;
}

export async function getDetailsFromAPI(route: Api, session: any, id: number) {
    const routeStr = route.replace(':id', id.toString());

    const data = await axios.get(process.env.NEXT_API_URL + routeStr, {headers: getAuthHeader(session)});

    if (!('data' in data) || !('results' in data.data)) {
        throw new Error('failed fetching data from api');
    }

    return data.data.results;
}

export async function patchDetailsOnAPI(route: Api, session: any, id: number, patchData: any) {
    const routeStr = route.replace(':id', id.toString());

    const data = await axios.patch(process.env.NEXT_API_URL + routeStr, patchData, {headers: getAuthHeader(session)});

    if (!('data' in data) || !('results' in data.data)) {
        throw new Error('failed patching data on api');
    }

    return data;
}

export async function postDetailsToAPI(route: Api, session: any, postData: any) {
    const routeStr = route.toString();

    const data = await axios.post(process.env.NEXT_API_URL + routeStr, postData, {headers: getAuthHeader(session)});

    if (!('data' in data) || data.status != 201) {
        throw new Error('failed posting data to api');
    }

    return data;
}

export async function deleteDetailsOnAPI(route: Api, session: any, id: number) {
    const routeStr = route.replace(':id', id.toString());

    const data = await axios.delete(process.env.NEXT_API_URL + routeStr, {headers: getAuthHeader(session)});

    if (!('data' in data) || data.status != 201) {
        throw new Error('failed deleting data on api');
    }

    return data;
}


const getLocationGroupsList = (session: Session | null, setter: ((e:any) => void), query?: any, params?: any) => {
    if (session) {
        getListFromApi(Api.LocationGroups, session, params ? params : {}, query ? query : {})
            .then((e) => setter(e))
            .catch(() =>setter([]));
    } else {
        setter([]);
    }
};


const getUsersList = (session: Session | null, setter: ((e:any) => void), query?: any, params?: any) => {
    if (session) {
        getListFromApi(Api.Users, session, params ? params : {}, query ? query : {})
            .then((e) => setter(e))
            .catch(() =>setter([]));
    } else {
        setter([]);
    }
};

const getBuildingsList = (session: Session | null, setter: ((e:any) => void), query?: any, params?: any) => {
    if (session) {
        getListFromApi(Api.Buildings, session, params ? params : {}, query ? query : {})
            .then((e) => setter(e))
            .catch(() =>setter([]));
    } else {
        setter([]);
    }
};

const getScheduleDefinitionsList = (session: Session | null, setter: ((e:any) => void), query?: any, params?: any) => {
    if (session) {
        getListFromApi(Api.ScheduleDefinitions, session, params ? params : {}, query ? query : {})
            .then((e) => setter(e))
            .catch(() =>setter([]));
    } else {
        setter([]);
    }
};

const getScheduleAssignmentsList = (session: Session | null, setter: ((e:any) => void), query?: any, params?: any) => {
    if (session) {
        getListFromApi(Api.ScheduleAssignments, session, params ? params : {}, query ? query : {})
            .then((e) => setter(e))
            .catch(() =>setter([]));
    } else {
        setter([]);
    }
};

const getScheduleWorkEntriesList = (session: Session | null, setter: ((e:any) => void), query?: any, params?: any) => {
    if (session) {
        getListFromApi(Api.ScheduleWorkEntries, session, params ? params : {}, query ? query : {})
            .then((e) => setter(e))
            .catch(() =>setter([]));
    } else {
        setter([]);
    }
};

const getGarbageTypesList = (session: Session | null, setter: ((e:any) => void), query?: any, params?: any) => {
    if (session) {
        getListFromApi(Api.GarbageTypes, session, params ? params : {}, query ? query : {})
            .then((e) => setter(e))
            .catch(() =>setter([]));
    } else {
        setter([]);
    }
};


const getGarbageCollectionScheduleTemplateDetail = (session: Session | null, setter: ((e:any) => void), id: number) => {
    if (session) {
        getDetailsFromAPI(Api.GarbageCollectionScheduleTemplateDetail, session, id)
            .then((e) => setter(e))
            .catch(() =>setter(null));
    } else {
        setter(null);
    }
};

const getGarbageCollectionScheduleTemplateDetailEntries = (session: Session | null, setter: ((e:any) => void), id: number) => {
    if (session) {
        getDetailsFromAPI(Api.GarbageCollectionScheduleTemplateDetailEntries, session, id)
            .then((e) => setter(e))
            .catch(() =>setter(null));
    } else {
        setter(null);
    }
};

const getGarbageCollectionScheduleTemplateEntryDetail = (session: Session | null, setter: ((e:any) => void), id: number) => {
    if (session) {
        getDetailsFromAPI(Api.GarbageCollectionScheduleTemplateEntryDetail, session, id)
            .then((e) => setter(e))
            .catch(() =>setter(null));
    } else {
        setter(null);
    }
};

const getGarbageTypeDetail = (session: Session | null, setter: ((e:any) => void), id: number) => {
    if (session) {
        getDetailsFromAPI(Api.GarbageTypeDetail, session, id)
            .then((e) => setter(e))
            .catch(() =>setter(null));
    } else {
        setter(null);
    }
};

const getGarbageCollectionScheduleDetail = (session: Session | null, setter: ((e:any) => void), id: number) => {
    if (session) {
        getDetailsFromAPI(Api.GarbageCollectionScheduleDetail, session, id)
            .then((e) => setter(e))
            .catch(() =>setter(null));
    } else {
        setter(null);
    }
};

const getLocationGroupDetail = (session: Session | null, setter: ((e:any) => void), id: number) => {
    if (session) {
        getDetailsFromAPI(Api.LocationGroupDetail, session, id)
            .then((e) => setter(e))
            .catch(() =>setter(null));
    } else {
        setter(null);
    }
};

const getLocationGroupDetailBuildings = (session: Session | null, setter: ((e:any) => void), id: number) => {
    if (session) {
        getDetailsFromAPI(Api.LocationGroupDetailBuildings, session, id)
            .then((e) => setter(e))
            .catch(() =>setter(null));
    } else {
        setter(null);
    }
};

const getLocationGroupDetailScheduleDefinitions = (session: Session | null, setter: ((e:any) => void), id: number) => {
    if (session) {
        getDetailsFromAPI(Api.LocationGroupDetailScheduleDefinitions, session, id)
            .then((e) => setter(e))
            .catch(() =>setter(null));
    } else {
        setter(null);
    }
};

const getBuildingDetail = (session: Session | null, setter: ((e:any) => void), id: number) => {
    if (session) {
        getDetailsFromAPI(Api.BuildingDetail, session, id)
            .then((e) => setter(e))
            .catch(() =>setter(null));
    } else {
        setter(null);
    }
};

const getBuildingDetailGarbageCollectionSchedules = (session: Session | null, setter: ((e:any) => void), id: number) => {
    if (session) {
        getDetailsFromAPI(Api.BuildingDetailGarbageCollectionSchedules, session, id)
            .then((e) => setter(e))
            .catch(() =>setter(null));
    } else {
        setter(null);
    }
};

const getBuildingDetailGarbageCollectionScheduleTemplates = (session: Session | null, setter: ((e:any) => void), id: number) => {
    if (session) {
        getDetailsFromAPI(Api.BuildingDetailGarbageCollectionScheduleTemplates, session, id)
            .then((e) => setter(e))
            .catch(() =>setter(null));
    } else {
        setter(null);
    }
};

const getScheduleWorkEntryDetail = (session: Session | null, setter: ((e:any) => void), id: number) => {
    if (session) {
        getDetailsFromAPI(Api.ScheduleWorkEntryDetail, session, id)
            .then((e) => setter(e))
            .catch(() =>setter(null));
    } else {
        setter(null);
    }
};


const getBuildingDetailScheduleDefinitions = (session: Session | null, setter: ((e:any) => void), id: number) => {
    if (session) {
        getDetailsFromAPI(Api.BuildingDetailScheduleDefinitions, session, id)
            .then((e) => setter(e))
            .catch(() =>setter(null));
    } else {
        setter(null);
    }
};

const getScheduleAssignmentDetail = (session: Session | null, setter: ((e:any) => void), id: number) => {
    if (session) {
        getDetailsFromAPI(Api.ScheduleAssignmentDetail, session, id)
            .then((e) => setter(e))
            .catch(() =>setter(null));
    } else {
        setter(null);
    }
};

const getScheduleDefinitionDetail = (session: Session | null, setter: ((e:any) => void), id: number) => {
    if (session) {
        getDetailsFromAPI(Api.ScheduleDefinitionDetail, session, id)
            .then((e) => setter(e))
            .catch(() =>setter(null));
    } else {
        setter(null);
    }
};

const getScheduleDefinitionDetailBuildings = (session: Session | null, setter: ((e:any) => void), id: number) => {
    if (session) {
        getDetailsFromAPI(Api.ScheduleDefinitionDetailBuildings, session, id)
            .then((e) => setter(e))
            .catch(() =>setter(null));
    } else {
        setter(null);
    }
};

const getScheduleDefinitionDetailScheduleAssignments = (session: Session | null, setter: ((e:any) => void), id: number) => {
    if (session) {
        getDetailsFromAPI(Api.ScheduleDefinitionDetailScheduleAssignments, session, id)
            .then((e) => setter(e))
            .catch(() =>setter(null));
    } else {
        setter(null);
    }
};

const getBuildingDetailIssues = (session: Session | null, setter: ((e:any) => void), id: number) => {
    if (session) {
        getDetailsFromAPI(Api.BuildingDetailIssues, session, id)
            .then((e) => setter(e))
            .catch(() =>setter(null));
    } else {
        setter(null);
    }
};

const getScheduleDefinitionDetailScheduleWorkEntries = (session: Session | null, setter: ((e:any) => void), id: number) => {
    if (session) {
        getDetailsFromAPI(Api.ScheduleDefinitionDetailScheduleWorkEntries, session, id)
            .then((e) => setter(e))
            .catch(() =>setter(null));
    } else {
        setter(null);
    }
};

const getUserDetail = (session: Session | null, setter: ((e:any) => void), id: number) => {
    if (session) {
        getDetailsFromAPI(Api.UserDetail, session, id)
            .then((e) => setter(e))
            .catch(() =>setter(null));
    } else {
        setter(null);
    }
};

const postGarbageType = (session: Session | null, data: any) => {
    if (session) {
        postDetailsToAPI(Api.GarbageTypes, session, data);
    }
};

const postLocationGroup = (session: Session | null, data: any) => {
    if (session) {
        postDetailsToAPI(Api.LocationGroups, session, data);
    }
};

const postBuilding = (session: Session | null, data: any) => {
    if (session) {
        postDetailsToAPI(Api.Buildings, session, data);
    }
};

const postScheduleAssignment = (session: Session | null, data: any) => {
    if (session) {
        postDetailsToAPI(Api.ScheduleAssignments, session, data);
    }
};

const postScheduleWorkEntrie = (session: Session | null, data: any) => {
    if (session) {
        postDetailsToAPI(Api.ScheduleWorkEntries, session, data);
    }
};

const postScheduleDefinition = (session: Session | null, data: any) => {
    if (session) {
        postDetailsToAPI(Api.ScheduleDefinitions, session, data);
    }
};

const postUser = (session: Session | null, data: any) => {
    if (session) {
        postDetailsToAPI(Api.Users, session, data);
    }
};

const deleteGarbageCollectionScheduleTemplate = (session: Session | null, id: number) => {
    if (session) {
        deleteDetailsOnAPI(Api.GarbageCollectionScheduleTemplateDetail, session, id);
    }
};

const deleteGarbageCollectionScheduleTemplateEntry = (session: Session | null, id: number) => {
    if (session) {
        deleteDetailsOnAPI(Api.GarbageCollectionScheduleTemplateEntryDetail, session, id);
    }
};

const deleteGarbageType = (session: Session | null, id: number) => {
    if (session) {
        deleteDetailsOnAPI(Api.GarbageTypeDetail, session, id);
    }
};

const deleteGarbageCollectionSchedule = (session: Session | null, id: number) => {
    if (session) {
        deleteDetailsOnAPI(Api.GarbageCollectionScheduleDetail, session, id);
    }
};

const deleteLocationGroup = (session: Session | null, id: number) => {
    if (session) {
        deleteDetailsOnAPI(Api.LocationGroupDetail, session, id);
    }
};

const deleteBuilding = (session: Session | null, id: number) => {
    if (session) {
        deleteDetailsOnAPI(Api.BuildingDetail, session, id);
    }
};

const deleteScheduleAssignment = (session: Session | null, id: number) => {
    if (session) {
        deleteDetailsOnAPI(Api.ScheduleAssignmentDetail, session, id);
    }
};

const deleteScheduleWorkEntry = (session: Session | null, id: number) => {
    if (session) {
        deleteDetailsOnAPI(Api.ScheduleWorkEntryDetail, session, id);
    }
};

const deleteScheduleDefinition = (session: Session | null, id: number) => {
    if (session) {
        deleteDetailsOnAPI(Api.ScheduleDefinitionDetail, session, id);
    }
};

const deleteUser = (session: Session | null, id: number) => {
    if (session) {
        deleteDetailsOnAPI(Api.UserDetail, session, id);
    }
};

const patchGarbageCollectionScheduleTemplateDetail = (session: Session | null, id: number, data: any) => {
    if (session) {
        patchDetailsOnAPI(Api.GarbageCollectionScheduleTemplateDetail, session, id, data);
    }
};

const patchGarbageCollectionScheduleTemplateEntryDetail = (session: Session | null, id: number, data: any) => {
    if (session) {
        patchDetailsOnAPI(Api.GarbageCollectionScheduleTemplateEntryDetail, session, id, data);
    }
};

const patchGarbageTypeDetail = (session: Session | null, id: number, data: any) => {
    if (session) {
        patchDetailsOnAPI(Api.GarbageTypeDetail, session, id, data);
    }
};

const patchGarbageCollectionScheduleDetail = (session: Session | null, id: number, data: any) => {
    if (session) {
        patchDetailsOnAPI(Api.GarbageCollectionScheduleDetail, session, id, data);
    }
};

const patchLocationGroupDetail = (session: Session | null, id: number, data: any) => {
    if (session) {
        patchDetailsOnAPI(Api.LocationGroupDetail, session, id, data);
    }
};

const patchBuildingDetail = (session: Session | null, id: number, data: any) => {
    if (session) {
        patchDetailsOnAPI(Api.BuildingDetail, session, id, data);
    }
};

const patchScheduleAssignmentDetail = (session: Session | null, id: number, data: any) => {
    if (session) {
        patchDetailsOnAPI(Api.ScheduleAssignmentDetail, session, id, data);
    }
};

const patchScheduleWorkEntryDetail = (session: Session | null, id: number, data: any) => {
    if (session) {
        patchDetailsOnAPI(Api.ScheduleWorkEntryDetail, session, id, data);
    }
};

const patchScheduleDefinitionDetail = (session: Session | null, id: number, data: any) => {
    if (session) {
        patchDetailsOnAPI(Api.ScheduleDefinitionDetail, session, id, data);
    }
};

const patchUserDetail = (session: Session | null, id: number, data: any) => {
    if (session) {
        patchDetailsOnAPI(Api.UserDetail, session, id, data);
    }
};


export {
    getGarbageCollectionScheduleTemplateDetail,
    getGarbageCollectionScheduleTemplateDetailEntries,
    getGarbageCollectionScheduleTemplateEntryDetail,
    getGarbageTypesList,
    getGarbageTypeDetail,
    getGarbageCollectionScheduleDetail,
    getLocationGroupsList,
    getLocationGroupDetail,
    getLocationGroupDetailBuildings,
    getLocationGroupDetailScheduleDefinitions,
    getBuildingsList,
    getBuildingDetail,
    getBuildingDetailGarbageCollectionSchedules,
    getBuildingDetailGarbageCollectionScheduleTemplates,
    getBuildingDetailIssues,
    getBuildingDetailScheduleDefinitions,
    getScheduleAssignmentsList,
    getScheduleAssignmentDetail,
    getScheduleWorkEntriesList,
    getScheduleWorkEntryDetail,
    getScheduleDefinitionsList,
    getScheduleDefinitionDetail,
    getScheduleDefinitionDetailBuildings,
    getScheduleDefinitionDetailScheduleAssignments,
    getScheduleDefinitionDetailScheduleWorkEntries,
    getUsersList,
    getUserDetail,

    postGarbageType,
    postLocationGroup,
    postBuilding,
    postScheduleAssignment,
    postScheduleWorkEntrie,
    postScheduleDefinition,
    postUser,

    deleteGarbageCollectionScheduleTemplate,
    deleteGarbageCollectionScheduleTemplateEntry,
    deleteGarbageType,
    deleteGarbageCollectionSchedule,
    deleteLocationGroup,
    deleteBuilding,
    deleteScheduleAssignment,
    deleteScheduleWorkEntry,
    deleteScheduleDefinition,
    deleteUser,

    patchGarbageCollectionScheduleTemplateDetail,
    patchGarbageCollectionScheduleTemplateEntryDetail,
    patchGarbageTypeDetail,
    patchGarbageCollectionScheduleDetail,
    patchLocationGroupDetail,
    patchBuildingDetail,
    patchScheduleAssignmentDetail,
    patchScheduleWorkEntryDetail,
    patchScheduleDefinitionDetail,
    patchUserDetail,
};
