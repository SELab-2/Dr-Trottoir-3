import axios from 'axios';
import {Session} from 'next-auth';
import useSWR, {SWRResponse} from 'swr';
import {useSession} from 'next-auth/react';

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


type PaginatedResponse<T> = {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
};

/**
 * @deprecated The method should not be used
 * @param {Array<string>} args
 * @return {Promise<T>}
 * **/
async function fetcher<T>(args: Array<string>): Promise<T> {
    // @ts-ignore
    // eslint-disable-next-line no-undef
    return fetch(process.env.NEXT_API_URL + args[1].slice(1), {
        headers: {
            'Authorization': `Bearer ${args[0]}`,
        },
    }).then((res) => {
        return res.json() as Promise<T>;
    });
}

/**
 * @deprecated The method should not be used
 * @param {Api} route API route to request
 * @param {any} params :param parameters to replace in request URL (e.g. :id)
 * @param {any} query query parameters to include in request
 * @return {SWRResponse}
 * **/
export function getList<T>(route: Api, params: any, query: any): SWRResponse<PaginatedResponse<T>, any> {
    let routeStr = route.toString();
    for (const property in params) {
        routeStr = routeStr.replace(':' + property, params[property]);
    }

    const queryParams = new URLSearchParams(query);
    routeStr += '?' + queryParams.toString();

    const {data: session} = useSession();

    // @ts-ignore
    const token = session ? session.accessToken : '';

    return useSWR<PaginatedResponse<T>>([token, routeStr], fetcher);
}

/**
 * @deprecated The method should not be used
 * @param {Api} route API route to request
 * @param {any} id ID of detail route to use
 * @return {SWRResponse}
 * **/
export function getDetail<T>(route: Api, id: number): SWRResponse<T, any> {
    const routeStr = route.replace(':id', id.toString());

    const {data: session} = useSession();

    // @ts-ignore
    const token = session ? session.accessToken : '';

    return useSWR<T>([token, routeStr], fetcher);
}


const getAuthHeader = (session: any) => (session ? {Authorization: `Bearer ${session.accessToken}`} : {});

async function getListFromApi(route: Api, session: any, params: any, query: any) {
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

    return data;
}

async function getDetailsFromAPI(route: Api, session: any, id: number) {
    const routeStr = route.replace(':id', id.toString());

    const data = await axios.get(process.env.NEXT_API_URL + routeStr, {headers: getAuthHeader(session)});

    if (!('data' in data) || !('results' in data.data)) {
        throw new Error('failed fetching data from api');
    }

    return data;
}

async function patchDetailsOnAPI(route: Api, session: any, id: number, patchData: any) {
    const routeStr = route.replace(':id', id.toString());

    const data = await axios.patch(process.env.NEXT_API_URL + routeStr, patchData, {headers: getAuthHeader(session)});

    if (!('data' in data) || !('results' in data.data)) {
        throw new Error('failed patching data on api');
    }

    return data;
}

async function postDetailsToAPI(route: Api, session: any, postData: any) {
    const routeStr = route.toString();

    const data = await axios.post(process.env.NEXT_API_URL + routeStr, postData, {headers: getAuthHeader(session)});

    if (!('data' in data) || data.status != 201) {
        throw new Error('failed posting data to api');
    }

    return data;
}

async function deleteDetailsOnAPI(route: Api, session: any, id: number) {
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
            .then((e) => {
                setter(e);
                return true;
            })
            .catch(() => {
                setter([]);
                return false;
            });
    } else {
        setter([]);
        return false;
    }
};


const getUsersList = (session: Session | null, setter: ((e:any) => void), query?: any, params?: any) => {
    if (session) {
        return getListFromApi(Api.Users, session, params ? params : {}, query ? query : {})
            .then((e) => {
                setter(e);
                return true;
            })
            .catch(() => {
                setter([]);
                return false;
            });
    } else {
        setter([]);
        return false;
    }
};

const getBuildingsList = (session: Session | null, setter: ((e:any) => void), query?: any, params?: any) => {
    if (session) {
        getListFromApi(Api.Buildings, session, params ? params : {}, query ? query : {})
            .then((e) => {
                setter({success: true, status: e.status, data: e.data.results});
            })
            .catch((e) => {
                setter({success: false, status: e.status, data: []});
            });
    } else {
        setter({success: false, status: 403, data: []});
    }
};

const getScheduleDefinitionsList = (session: Session | null, setter: ((e:any) => void), query?: any, params?: any) => {
    if (session) {
        getListFromApi(Api.ScheduleDefinitions, session, params ? params : {}, query ? query : {})
            .then((e) => {
                setter({success: true, status: e.status, data: e.data.results});
            })
            .catch((e) => {
                setter({success: false, status: e.status, data: []});
            });
    } else {
        setter({success: false, status: 403, data: []});
    }
};

const getScheduleAssignmentsList = (session: Session | null, setter: ((e:any) => void), query?: any, params?: any) => {
    if (session) {
        getListFromApi(Api.ScheduleAssignments, session, params ? params : {}, query ? query : {})
            .then((e) => {
                setter({success: true, status: e.status, data: e.data.results});
            })
            .catch((e) => {
                setter({success: false, status: e.status, data: []});
            });
    } else {
        setter({success: false, status: 403, data: []});
    }
};

const getScheduleWorkEntriesList = (session: Session | null, setter: ((e:any) => void), query?: any, params?: any) => {
    if (session) {
        getListFromApi(Api.ScheduleWorkEntries, session, params ? params : {}, query ? query : {})
            .then((e) => {
                setter({success: true, status: e.status, data: e.data.results});
            })
            .catch((e) => {
                setter({success: false, status: e.status, data: []});
            });
    } else {
        setter({success: false, status: 403, data: []});
    }
};

const getGarbageTypesList = (session: Session | null, setter: ((e:any) => void), query?: any, params?: any) => {
    if (session) {
        getListFromApi(Api.GarbageTypes, session, params ? params : {}, query ? query : {})
            .then((e) => {
                setter({success: true, status: e.status, data: e.data.results});
            })
            .catch((e) => {
                setter({success: false, status: e.status, data: []});
            });
    } else {
        setter({success: false, status: 403, data: []});
    }
};


const getGarbageCollectionScheduleTemplateDetail = (session: Session | null, setter: ((e:any) => void), id: number) => {
    if (session) {
        getDetailsFromAPI(Api.GarbageCollectionScheduleTemplateDetail, session, id)
            .then((e) => {
                setter({success: true, status: e.status, data: e.data.results});
            })
            .catch((e) => {
                setter({success: false, status: e.status, data: null});
            });
    } else {
        setter({success: false, status: 403, data: null});
    }
};

const getGarbageCollectionScheduleTemplateDetailEntries = (session: Session | null, setter: ((e:any) => void), id: number) => {
    if (session) {
        getDetailsFromAPI(Api.GarbageCollectionScheduleTemplateDetailEntries, session, id)
            .then((e) => {
                setter({success: true, status: e.status, data: e.data.results});
            })
            .catch((e) => {
                setter({success: false, status: e.status, data: null});
            });
    } else {
        setter({success: false, status: 403, data: null});
    }
};

const getGarbageCollectionScheduleTemplateEntryDetail = (session: Session | null, setter: ((e:any) => void), id: number) => {
    if (session) {
        getDetailsFromAPI(Api.GarbageCollectionScheduleTemplateEntryDetail, session, id)
            .then((e) => {
                setter({success: true, status: e.status, data: e.data.results});
            })
            .catch((e) => {
                setter({success: false, status: e.status, data: null});
            });
    } else {
        setter({success: false, status: 403, data: null});
    }
};

const getGarbageTypeDetail = (session: Session | null, setter: ((e:any) => void), id: number) => {
    if (session) {
        getDetailsFromAPI(Api.GarbageTypeDetail, session, id)
            .then((e) => {
                setter({success: true, status: e.status, data: e.data.results});
            })
            .catch((e) => {
                setter({success: false, status: e.status, data: null});
            });
    } else {
        setter({success: false, status: 403, data: null});
    }
};

const getGarbageCollectionScheduleDetail = (session: Session | null, setter: ((e:any) => void), id: number) => {
    if (session) {
        getDetailsFromAPI(Api.GarbageCollectionScheduleDetail, session, id)
            .then((e) => {
                setter({success: true, status: e.status, data: e.data.results});
            })
            .catch((e) => {
                setter({success: false, status: e.status, data: null});
            });
    } else {
        setter({success: false, status: 403, data: null});
    }
};

const getLocationGroupDetail = (session: Session | null, setter: ((e:any) => void), id: number) => {
    if (session) {
        getDetailsFromAPI(Api.LocationGroupDetail, session, id)
            .then((e) => {
                setter({success: true, status: e.status, data: e.data.results});
            })
            .catch((e) => {
                setter({success: false, status: e.status, data: null});
            });
    } else {
        setter({success: false, status: 403, data: null});
    }
};

const getLocationGroupDetailBuildings = (session: Session | null, setter: ((e:any) => void), id: number) => {
    if (session) {
        return getDetailsFromAPI(Api.LocationGroupDetailBuildings, session, id)
            .then((e) => {
                setter({success: true, status: e.status, data: e.data.results});
            })
            .catch((e) => {
                setter({success: false, status: e.status, data: null});
            });
    } else {
        setter({success: false, status: 403, data: null});
    }
};

const getLocationGroupDetailScheduleDefinitions = (session: Session | null, setter: ((e:any) => void), id: number) => {
    if (session) {
        getDetailsFromAPI(Api.LocationGroupDetailScheduleDefinitions, session, id)
            .then((e) => {
                setter({success: true, status: e.status, data: e.data.results});
            })
            .catch((e) => {
                setter({success: false, status: e.status, data: null});
            });
    } else {
        setter({success: false, status: 403, data: null});
    }
};

const getBuildingDetail = (session: Session | null, setter: ((e:any) => void), id: number) => {
    if (session) {
        getDetailsFromAPI(Api.BuildingDetail, session, id)
            .then((e) => {
                setter({success: true, status: e.status, data: e.data.results});
            })
            .catch((e) => {
                setter({success: false, status: e.status, data: null});
            });
    } else {
        setter({success: false, status: 403, data: null});
    }
};

const getBuildingDetailGarbageCollectionSchedules = (session: Session | null, setter: ((e:any) => void), id: number) => {
    if (session) {
        getDetailsFromAPI(Api.BuildingDetailGarbageCollectionSchedules, session, id)
            .then((e) => {
                setter({success: true, status: e.status, data: e.data.results});
            })
            .catch((e) => {
                setter({success: false, status: e.status, data: null});
            });
    } else {
        setter({success: false, status: 403, data: null});
    }
};

const getBuildingDetailGarbageCollectionScheduleTemplates = (session: Session | null, setter: ((e:any) => void), id: number) => {
    if (session) {
        getDetailsFromAPI(Api.BuildingDetailGarbageCollectionScheduleTemplates, session, id)
            .then((e) => {
                setter({success: true, status: e.status, data: e.data.results});
            })
            .catch((e) => {
                setter({success: false, status: e.status, data: null});
            });
    } else {
        setter({success: false, status: 403, data: null});
    }
};

const getScheduleWorkEntryDetail = (session: Session | null, setter: ((e:any) => void), id: number) => {
    if (session) {
        getDetailsFromAPI(Api.ScheduleWorkEntryDetail, session, id)
            .then((e) => {
                setter({success: true, status: e.status, data: e.data.results});
            })
            .catch((e) => {
                setter({success: false, status: e.status, data: null});
            });
    } else {
        setter({success: false, status: 403, data: null});
    }
};


const getBuildingDetailScheduleDefinitions = (session: Session | null, setter: ((e:any) => void), id: number) => {
    if (session) {
        getDetailsFromAPI(Api.BuildingDetailScheduleDefinitions, session, id)
            .then((e) => {
                setter({success: true, status: e.status, data: e.data.results});
            })
            .catch((e) => {
                setter({success: false, status: e.status, data: null});
            });
    } else {
        setter({success: false, status: 403, data: null});
    }
};

const getScheduleAssignmentDetail = (session: Session | null, setter: ((e:any) => void), id: number) => {
    if (session) {
        getDetailsFromAPI(Api.ScheduleAssignmentDetail, session, id)
            .then((e) => {
                setter({success: true, status: e.status, data: e.data.results});
            })
            .catch((e) => {
                setter({success: false, status: e.status, data: null});
            });
    } else {
        setter({success: false, status: 403, data: null});
    }
};

const getScheduleDefinitionDetail = (session: Session | null, setter: ((e:any) => void), id: number) => {
    if (session) {
        getDetailsFromAPI(Api.ScheduleDefinitionDetail, session, id)
            .then((e) => {
                setter({success: true, status: e.status, data: e.data.results});
            })
            .catch((e) => {
                setter({success: false, status: e.status, data: null});
            });
    } else {
        setter({success: false, status: 403, data: null});
    }
};

const getScheduleDefinitionDetailBuildings = (session: Session | null, setter: ((e:any) => void), id: number) => {
    if (session) {
        getDetailsFromAPI(Api.ScheduleDefinitionDetailBuildings, session, id)
            .then((e) => {
                setter({success: true, status: e.status, data: e.data.results});
            })
            .catch((e) => {
                setter({success: false, status: e.status, data: null});
            });
    } else {
        setter({success: false, status: 403, data: null});
    }
};

const getScheduleDefinitionDetailScheduleAssignments = (session: Session | null, setter: ((e:any) => void), id: number) => {
    if (session) {
        getDetailsFromAPI(Api.ScheduleDefinitionDetailScheduleAssignments, session, id)
            .then((e) => {
                setter({success: true, status: e.status, data: e.data.results});
            })
            .catch((e) => {
                setter({success: false, status: e.status, data: null});
            });
    } else {
        setter({success: false, status: 403, data: null});
    }
};

const getBuildingDetailIssues = (session: Session | null, setter: ((e:any) => void), id: number) => {
    if (session) {
        getDetailsFromAPI(Api.BuildingDetailIssues, session, id)
            .then((e) => {
                setter({success: true, status: e.status, data: e.data.results});
            })
            .catch((e) => {
                setter({success: false, status: e.status, data: null});
            });
    } else {
        setter({success: false, status: 403, data: null});
    }
};

const getScheduleDefinitionDetailScheduleWorkEntries = (session: Session | null, setter: ((e:any) => void), id: number) => {
    if (session) {
        getDetailsFromAPI(Api.ScheduleDefinitionDetailScheduleWorkEntries, session, id)
            .then((e) => {
                setter({success: true, status: e.status, data: e.data.results});
            })
            .catch((e) => {
                setter({success: false, status: e.status, data: null});
            });
    } else {
        setter({success: false, status: 403, data: null});
    }
};

const getUserDetail = (session: Session | null, setter: ((e:any) => void), id: number) => {
    if (session) {
        getDetailsFromAPI(Api.UserDetail, session, id)
            .then((e) => {
                setter({success: true, status: e.status, data: e.data.results});
            })
            .catch((e) => {
                setter({success: false, status: e.status, data: null});
            });
    } else {
        setter({success: false, status: 403, data: null});
    }
};

const postGarbageType = (session: Session | null, data: any, setter?: ((e:any) => void)) => {
    if (session) {
        postDetailsToAPI(Api.GarbageTypes, session, data)
            .then((e) => {
                setter ? setter({success: true, status: e.status, data: e.data}) : undefined;
            })
            .catch((e) => {
                setter ? setter({success: false, status: e.status, data: null}) : undefined;
            });
    } else {
        setter ? setter({success: false, status: 403, data: null}) : undefined;
    }
};

const postLocationGroup = (session: Session | null, data: any, setter?: ((e:any) => void)) => {
    if (session) {
        postDetailsToAPI(Api.LocationGroups, session, data)
            .then((e) => {
                setter ? setter({success: true, status: e.status, data: e.data}) : undefined;
            })
            .catch((e) => {
                setter ? setter({success: false, status: e.status, data: null}) : undefined;
            });
    } else {
        setter ? setter({success: false, status: 403, data: null}) : undefined;
    }
};

const postBuilding = (session: Session | null, data: any, setter?: ((e:any) => void)) => {
    if (session) {
        postDetailsToAPI(Api.Buildings, session, data)
            .then((e) => {
                setter ? setter({success: true, status: e.status, data: e.data}) : undefined;
            })
            .catch((e) => {
                setter ? setter({success: false, status: e.status, data: null}) : undefined;
            });
    } else {
        setter ? setter({success: false, status: 403, data: null}) : undefined;
    }
};

const postScheduleAssignment = (session: Session | null, data: any, setter?: ((e:any) => void)) => {
    if (session) {
        postDetailsToAPI(Api.ScheduleAssignments, session, data)
            .then((e) => {
                setter ? setter({success: true, status: e.status, data: e.data}) : undefined;
            })
            .catch((e) => {
                setter ? setter({success: false, status: e.status, data: null}) : undefined;
            });
    } else {
        setter ? setter({success: false, status: 403, data: null}) : undefined;
    }
};

const postScheduleWorkEntrie = (session: Session | null, data: any, setter?: ((e:any) => void)) => {
    if (session) {
        postDetailsToAPI(Api.ScheduleWorkEntries, session, data)
            .then((e) => {
                setter ? setter({success: true, status: e.status, data: e.data}) : undefined;
            })
            .catch((e) => {
                setter ? setter({success: false, status: e.status, data: null}) : undefined;
            });
    } else {
        setter ? setter({success: false, status: 403, data: null}) : undefined;
    }
};

const postScheduleDefinition = (session: Session | null, data: any, setter?: ((e:any) => void)) => {
    if (session) {
        postDetailsToAPI(Api.ScheduleDefinitions, session, data)
            .then((e) => {
                setter ? setter({success: true, status: e.status, data: e.data}) : undefined;
            })
            .catch((e) => {
                setter ? setter({success: false, status: e.status, data: null}) : undefined;
            });
    } else {
        setter ? setter({success: false, status: 403, data: null}) : undefined;
    }
};

const postUser = (session: Session | null, data: any, setter?: ((e:any) => void)) => {
    if (session) {
        postDetailsToAPI(Api.Users, session, data)
            .then((e) => {
                setter ? setter({success: true, status: e.status, data: e.data}) : undefined;
            })
            .catch((e) => {
                setter ? setter({success: false, status: e.status, data: null}) : undefined;
            });
    } else {
        setter ? setter({success: false, status: 403, data: null}) : undefined;
    }
};

const deleteGarbageCollectionScheduleTemplate = (session: Session | null, id: number, setter?: ((e:any) => void)) => {
    if (session) {
        deleteDetailsOnAPI(Api.GarbageCollectionScheduleTemplateDetail, session, id)
            .then((e) => {
                setter ? setter({success: true, status: e.status, data: e.data}) : undefined;
            })
            .catch((e) => {
                setter ? setter({success: false, status: e.status, data: null}) : undefined;
            });
    } else {
        setter ? setter({success: false, status: 403, data: null}) : undefined;
    }
};

const deleteGarbageCollectionScheduleTemplateEntry = (session: Session | null, id: number, setter?: ((e:any) => void)) => {
    if (session) {
        deleteDetailsOnAPI(Api.GarbageCollectionScheduleTemplateEntryDetail, session, id)
            .then((e) => {
                setter ? setter({success: true, status: e.status, data: e.data}) : undefined;
            })
            .catch((e) => {
                setter ? setter({success: false, status: e.status, data: null}) : undefined;
            });
    } else {
        setter ? setter({success: false, status: 403, data: null}) : undefined;
    }
};

const deleteGarbageType = (session: Session | null, id: number, setter?: ((e:any) => void)) => {
    if (session) {
        deleteDetailsOnAPI(Api.GarbageTypeDetail, session, id)
            .then((e) => {
                setter ? setter({success: true, status: e.status, data: e.data}) : undefined;
            })
            .catch((e) => {
                setter ? setter({success: false, status: e.status, data: null}) : undefined;
            });
    } else {
        setter ? setter({success: false, status: 403, data: null}) : undefined;
    }
};

const deleteGarbageCollectionSchedule = (session: Session | null, id: number, setter?: ((e:any) => void)) => {
    if (session) {
        deleteDetailsOnAPI(Api.GarbageCollectionScheduleDetail, session, id)
            .then((e) => {
                setter ? setter({success: true, status: e.status, data: e.data}) : undefined;
            })
            .catch((e) => {
                setter ? setter({success: false, status: e.status, data: null}) : undefined;
            });
    } else {
        setter ? setter({success: false, status: 403, data: null}) : undefined;
    }
};

const deleteLocationGroup = (session: Session | null, id: number, setter?: ((e:any) => void)) => {
    if (session) {
        deleteDetailsOnAPI(Api.LocationGroupDetail, session, id)
            .then((e) => {
                setter ? setter({success: true, status: e.status, data: e.data}) : undefined;
            })
            .catch((e) => {
                setter ? setter({success: false, status: e.status, data: null}) : undefined;
            });
    } else {
        setter ? setter({success: false, status: 403, data: null}) : undefined;
    }
};

const deleteBuilding = (session: Session | null, id: number, setter?: ((e:any) => void)) => {
    if (session) {
        deleteDetailsOnAPI(Api.BuildingDetail, session, id)
            .then((e) => {
                setter ? setter({success: true, status: e.status, data: e.data}) : undefined;
            })
            .catch((e) => {
                setter ? setter({success: false, status: e.status, data: null}) : undefined;
            });
    } else {
        setter ? setter({success: false, status: 403, data: null}) : undefined;
    }
};

const deleteScheduleAssignment = (session: Session | null, id: number, setter?: ((e:any) => void)) => {
    if (session) {
        deleteDetailsOnAPI(Api.ScheduleAssignmentDetail, session, id)
            .then((e) => {
                setter ? setter({success: true, status: e.status, data: e.data}) : undefined;
            })
            .catch((e) => {
                setter ? setter({success: false, status: e.status, data: null}) : undefined;
            });
    } else {
        setter ? setter({success: false, status: 403, data: null}) : undefined;
    }
};

const deleteScheduleWorkEntry = (session: Session | null, id: number, setter?: ((e:any) => void)) => {
    if (session) {
        deleteDetailsOnAPI(Api.ScheduleWorkEntryDetail, session, id)
            .then((e) => {
                setter ? setter({success: true, status: e.status, data: e.data}) : undefined;
            })
            .catch((e) => {
                setter ? setter({success: false, status: e.status, data: null}) : undefined;
            });
    } else {
        setter ? setter({success: false, status: 403, data: null}) : undefined;
    }
};

const deleteScheduleDefinition = (session: Session | null, id: number, setter?: ((e:any) => void)) => {
    if (session) {
        deleteDetailsOnAPI(Api.ScheduleDefinitionDetail, session, id)
            .then((e) => {
                setter ? setter({success: true, status: e.status, data: e.data}) : undefined;
            })
            .catch((e) => {
                setter ? setter({success: false, status: e.status, data: null}) : undefined;
            });
    } else {
        setter ? setter({success: false, status: 403, data: null}) : undefined;
    }
};

const deleteUser = (session: Session | null, id: number, setter?: ((e:any) => void)) => {
    if (session) {
        deleteDetailsOnAPI(Api.UserDetail, session, id)
            .then((e) => {
                setter ? setter({success: true, status: e.status, data: e.data}) : undefined;
            })
            .catch((e) => {
                setter ? setter({success: false, status: e.status, data: null}) : undefined;
            });
    } else {
        setter ? setter({success: false, status: 403, data: null}) : undefined;
    }
};

const patchGarbageCollectionScheduleTemplateDetail = (session: Session | null, id: number, data: any, setter?: ((e:any) => void)) => {
    if (session) {
        patchDetailsOnAPI(Api.GarbageCollectionScheduleTemplateDetail, session, id, data)
            .then((e) => {
                setter ? setter({success: true, status: e.status, data: e.data}) : undefined;
            })
            .catch((e) => {
                setter ? setter({success: false, status: e.status, data: null}) : undefined;
            });
    } else {
        setter ? setter({success: false, status: 403, data: null}) : undefined;
    }
};

const patchGarbageCollectionScheduleTemplateEntryDetail = (session: Session | null, id: number, data: any, setter?: ((e:any) => void)) => {
    if (session) {
        patchDetailsOnAPI(Api.GarbageCollectionScheduleTemplateEntryDetail, session, id, data)
            .then((e) => {
                setter ? setter({success: true, status: e.status, data: e.data}) : undefined;
            })
            .catch((e) => {
                setter ? setter({success: false, status: e.status, data: null}) : undefined;
            });
    } else {
        setter ? setter({success: false, status: 403, data: null}) : undefined;
    }
};

const patchGarbageTypeDetail = (session: Session | null, id: number, data: any, setter?: ((e:any) => void)) => {
    if (session) {
        patchDetailsOnAPI(Api.GarbageTypeDetail, session, id, data)
            .then((e) => {
                setter ? setter({success: true, status: e.status, data: e.data}) : undefined;
            })
            .catch((e) => {
                setter ? setter({success: false, status: e.status, data: null}) : undefined;
            });
    } else {
        setter ? setter({success: false, status: 403, data: null}) : undefined;
    }
};

const patchGarbageCollectionScheduleDetail = (session: Session | null, id: number, data: any, setter?: ((e:any) => void)) => {
    if (session) {
        patchDetailsOnAPI(Api.GarbageCollectionScheduleDetail, session, id, data)
            .then((e) => {
                setter ? setter({success: true, status: e.status, data: e.data}) : undefined;
            })
            .catch((e) => {
                setter ? setter({success: false, status: e.status, data: null}) : undefined;
            });
    } else {
        setter ? setter({success: false, status: 403, data: null}) : undefined;
    }
};

const patchLocationGroupDetail = (session: Session | null, id: number, data: any, setter?: ((e:any) => void)) => {
    if (session) {
        patchDetailsOnAPI(Api.LocationGroupDetail, session, id, data)
            .then((e) => {
                setter ? setter({success: true, status: e.status, data: e.data}) : undefined;
            })
            .catch((e) => {
                setter ? setter({success: false, status: e.status, data: null}) : undefined;
            });
    } else {
        setter ? setter({success: false, status: 403, data: null}) : undefined;
    }
};

const patchBuildingDetail = (session: Session | null, id: number, data: any, setter?: ((e:any) => void)) => {
    if (session) {
        patchDetailsOnAPI(Api.BuildingDetail, session, id, data)
            .then((e) => {
                setter ? setter({success: true, status: e.status, data: e.data}) : undefined;
            })
            .catch((e) => {
                setter ? setter({success: false, status: e.status, data: null}) : undefined;
            });
    } else {
        setter ? setter({success: false, status: 403, data: null}) : undefined;
    }
};

const patchScheduleAssignmentDetail = (session: Session | null, id: number, data: any, setter?: ((e:any) => void)) => {
    if (session) {
        patchDetailsOnAPI(Api.ScheduleAssignmentDetail, session, id, data)
            .then((e) => {
                setter ? setter({success: true, status: e.status, data: e.data}) : undefined;
            })
            .catch((e) => {
                setter ? setter({success: false, status: e.status, data: null}) : undefined;
            });
    } else {
        setter ? setter({success: false, status: 403, data: null}) : undefined;
    }
};

const patchScheduleWorkEntryDetail = (session: Session | null, id: number, data: any, setter?: ((e:any) => void)) => {
    if (session) {
        patchDetailsOnAPI(Api.ScheduleWorkEntryDetail, session, id, data)
            .then((e) => {
                setter ? setter({success: true, status: e.status, data: e.data}) : undefined;
            })
            .catch((e) => {
                setter ? setter({success: false, status: e.status, data: null}) : undefined;
            });
    } else {
        setter ? setter({success: false, status: 403, data: null}) : undefined;
    }
};

const patchScheduleDefinitionDetail = (session: Session | null, id: number, data: any, setter?: ((e:any) => void)) => {
    if (session) {
        patchDetailsOnAPI(Api.ScheduleDefinitionDetail, session, id, data)
            .then((e) => {
                setter ? setter({success: true, status: e.status, data: e.data}) : undefined;
            })
            .catch((e) => {
                setter ? setter({success: false, status: e.status, data: null}) : undefined;
            });
    } else {
        setter ? setter({success: false, status: 403, data: null}) : undefined;
    }
};

const patchUserDetail = (session: Session | null, id: number, data: any, setter?: ((e:any) => void)) => {
    if (session) {
        patchDetailsOnAPI(Api.UserDetail, session, id, data)
            .then((e) => {
                setter ? setter({success: true, status: e.status, data: e.data}) : undefined;
            })
            .catch((e) => {
                setter ? setter({success: false, status: e.status, data: null}) : undefined;
            });
    } else {
        setter ? setter({success: false, status: 403, data: null}) : undefined;
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
