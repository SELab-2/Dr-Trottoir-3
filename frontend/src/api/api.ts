import axios, {AxiosResponse} from 'axios';
import {Session} from 'next-auth';
import useSWR, {SWRResponse} from 'swr';
import {useSession} from 'next-auth/react';
import {useState} from 'react';

export enum Api {
    /* eslint-disable no-unused-vars */
    /* eslint-disable max-len */
    GarbageCollectionScheduleTemplates = 'garbage_collection_schedule_templates/',
    GarbageCollectionScheduleTemplateEntries = 'garbage_collection_schedule_template_entries/',
    GarbageCollectionScheduleTemplateDetail = 'garbage_collection_schedule_templates/:id/',
    GarbageCollectionScheduleTemplateDetailEntries = 'garbage_collection_schedule_templates/:id/entries/',
    GarbageCollectionScheduleTemplateEntryDetail = 'garbage_collection_schedule_template_entries/:id/',
    GarbageTypes = 'garbage_types/',
    GarbageTypeDetail = 'garbage_types/:id/',
    GarbageCollectionSchedules = 'garbage_collection_schedules/',
    GarbageCollectionScheduleDetail = 'garbage_collection_schedules/:id/',
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
    BuildingGenerateLink = 'buildings/:id/generate_link/',
    ScheduleAssignments = 'schedule_assignments/',
    ScheduleAssignmentDetail = 'schedule_assignments/:id/',
    ScheduleWorkEntries = 'schedule_work_entries/',
    ScheduleWorkEntryDetail = 'schedule_work_entries/:id/',
    ScheduleDefinitions = 'schedule_definitions/',
    LatestScheduleDefinitions = 'schedule_definitions/newest/',
    ScheduleDefinitionDetail = 'schedule_definitions/:id/',
    ScheduleDefinitionDetailBuildings = 'schedule_definitions/:id/buildings/',
    ScheduleDefinitionDetailOrder = 'schedule_definitions/:id/order/',
    ScheduleDefinitionDetailScheduleAssignments = 'schedule_definitions/:id/schedule_assignments/',
    ScheduleDefinitionDetailScheduleWorkEntries = 'schedule_definitions/:id/schedule_work_entries/',
    ScheduleDefinitionAssignedToMe = 'schedule_definitions/assigned_to_me/',
    Users = 'users/',
    UserDetail = 'users/:id/',
    Issues = 'issues/',
    IssueDetail = 'issues/:id/',
    IssueImages = 'issue_images/',
    Me = 'users/me/',
    InviteLink = 'users/invite/:id/',
    ResetPassword = 'users/reset_password/',
    ResetPasswordLink = 'users/reset_password/:id/',
    UserAnalytics = 'users/:id/analytics/'
}


export type ApiData<T> = {data: T, status: number, success: boolean}

function useAuthenticatedApi<T>(): [ApiData<T> | undefined, (e: ApiData<T> | undefined) => void] {
    const {data: session} = useSession();

    const [data, setData] = useState<ApiData<T> | undefined>(undefined);

    const setDataWrapper = (newData: ApiData<T> | undefined) => {
        if (session) {
            setData(newData);
        }
    };

    return [data, setDataWrapper];
}

class ApiError<T> extends Error {
    public apiData: AxiosResponse<any>;

    constructor(apiData: AxiosResponse<any>) {
        super('');
        this.apiData = apiData;
    }
}


type PaginatedResponse<T> = {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
};

/**
 * @deprecated The method should not be used
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
function getList<T>(route: Api, params: any, query: any): SWRResponse<PaginatedResponse<T>, any> {
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
function getDetail<T>(route: Api, id: number): SWRResponse<T, any> {
    const routeStr = route.replace(':id', id.toString());

    const {data: session} = useSession();

    // @ts-ignore
    const token = session ? session.accessToken : '';

    return useSWR<T>([token, routeStr], fetcher);
}


export const getAuthHeader = (session: any) => (session ? {Authorization: `Bearer ${session.accessToken}`} : {});

async function getListFromApi(route: Api, session: any, params: any, query: any) {
    let routeStr = route.toString();
    for (const property in params) {
        routeStr = routeStr.replace(':' + property, params[property]);
    }
    const queryParams = new URLSearchParams(query);
    routeStr += '?' + queryParams.toString();

    const data = await axios.get(process.env.NEXT_API_URL + routeStr, {headers: getAuthHeader(session)});

    if (!('data' in data)) {
        throw new ApiError(data);
    }

    return data;
}

async function getDetailsFromAPI(route: Api, session: any, id: number | string) {
    const routeStr = route.replace(':id', id.toString());

    const data = await axios.get(process.env.NEXT_API_URL + routeStr, {headers: getAuthHeader(session)});

    if (!('data' in data)) {
        throw new ApiError(data);
    }

    return data;
}

async function patchDetailsOnAPI(route: Api, session: any, id: number, patchData: any) {
    const routeStr = route.replace(':id', id.toString());

    const data = await axios.patch(process.env.NEXT_API_URL + routeStr, patchData, {headers: getAuthHeader(session)});

    if (!('data' in data)) {
        throw new ApiError(data);
    }

    return data;
}

async function postDetailsToAPI(route: Api, session: any, postData: any) {
    const routeStr = route.toString();

    const data = await axios.post(process.env.NEXT_API_URL + routeStr, postData, {headers: getAuthHeader(session)});

    if (!('data' in data)) {
        throw new ApiError(data);
    }

    return data;
}

async function postDetailsOnAPIWithId(route: Api, session: any, id: number | string, patchData: any) {
    const routeStr = route.replace(':id', id.toString());

    const data = await axios.post(process.env.NEXT_API_URL + routeStr, patchData, {headers: getAuthHeader(session)});

    if (!('data' in data)) {
        throw new ApiError(data);
    }

    return data;
}

async function deleteDetailsOnAPI(route: Api, session: any, id: number) {
    const routeStr = route.replace(':id', id.toString());

    const data = await axios.delete(process.env.NEXT_API_URL + routeStr, {headers: getAuthHeader(session)});

    if (!('data' in data)) {
        throw new Error('failed deleting data on api');
    }

    return data;
}


const getLocationGroupsList = (session: Session | null, setter: ((e:any) => void), query?: any, params?: any) => {
    getListFromApi(Api.LocationGroups, session, params ? params : {}, query ? query : {})
        .then((e) => {
            setter({success: true, status: e.status, data: e.data});
        })
        .catch((e) => {
            setter({success: false, status: e.status, data: []});
        });
};


const getUsersList = (session: Session | null, setter: ((e:any) => void), query?: any, params?: any) => {
    getListFromApi(Api.Users, session, params ? params : {}, query ? query : {})
        .then((e) => {
            setter({success: true, status: e.status, data: e.data});
        })
        .catch((e) => {
            setter({success: false, status: e.status, data: []});
        });
};

const getBuildingsList = (session: Session | null, setter: ((e:any) => void), query?: any, params?: any) => {
    getListFromApi(Api.Buildings, session, params ? params : {}, query ? query : {})
        .then((e) => {
            setter({success: true, status: e.status, data: e.data});
        })
        .catch((e) => {
            setter({success: false, status: e.status, data: []});
        });
};

const getScheduleDefinitionsList = (session: Session | null, setter: ((e:any) => void), query?: any, params?: any) => {
    getListFromApi(Api.ScheduleDefinitions, session, params ? params : {}, query ? query : {})
        .then((e) => {
            setter({success: true, status: e.status, data: e.data});
        })
        .catch((e) => {
            setter({success: false, status: e.status, data: []});
        });
};

const getScheduleDefinitionsAssignedToMeList = (session: Session | null, setter: ((e:any) => void), query?: any, params?: any) => {
    getListFromApi(Api.ScheduleDefinitionAssignedToMe, session, params ? params : {}, query ? query : {})
        .then((e) => {
            setter({success: true, status: e.status, data: e.data});
        })
        .catch((e) => {
            setter({success: false, status: e.status, data: []});
        });
};

const getLatestScheduleDefinitionsList = (session: Session | null, setter: ((e:any) => void), query?: any, params?: any) => {
    getListFromApi(Api.LatestScheduleDefinitions, session, params ? params : {}, query ? query : {})
        .then((e) => {
            setter({success: true, status: e.status, data: e.data});
        })
        .catch((e) => {
            setter({success: false, status: e.status, data: []});
        });
};

const getScheduleAssignmentsList = (session: Session | null, setter: ((e:any) => void), query?: any, params?: any) => {
    getListFromApi(Api.ScheduleAssignments, session, params ? params : {}, query ? query : {})
        .then((e) => {
            setter({success: true, status: e.status, data: e.data});
        })
        .catch( (e) => {
            setter({success: false, status: e.status, data: []});
        });
};

const getGarbageCollectionsSchedulesList = (session: Session | null, setter: ((e:any) => void), query?: any, params?: any) => {
    getListFromApi(Api.GarbageCollectionSchedules, session, params ? params : {}, query ? query : {})
        .then((e) => {
            setter({success: true, status: e.status, data: e.data});
        })
        .catch((e) => {
            setter({success: false, status: e.status, data: []});
        });
};


const getScheduleWorkEntriesList = (session: Session | null, setter: ((e:any) => void), query?: any, params?: any) => {
    getListFromApi(Api.ScheduleWorkEntries, session, params ? params : {}, query ? query : {})
        .then((e) => {
            setter({success: true, status: e.status, data: e.data});
        })
        .catch((e) => {
            setter({success: false, status: e.status, data: []});
        });
};

const getGarbageTypesList = (session: Session | null, setter: ((e:any) => void), query?: any, params?: any) => {
    getListFromApi(Api.GarbageTypes, session, params ? params : {}, query ? query : {})
        .then((e) => {
            setter({success: true, status: e.status, data: e.data});
        })
        .catch((e) => {
            setter({success: false, status: e.status, data: []});
        });
};


const getGarbageCollectionScheduleTemplateDetail = (session: Session | null, setter: ((e:any) => void), id: number) => {
    getDetailsFromAPI(Api.GarbageCollectionScheduleTemplateDetail, session, id)
        .then((e) => {
            setter({success: true, status: e.status, data: e.data});
        })
        .catch((e) => {
            setter({success: false, status: e.status, data: e});
        });
};

const getGarbageCollectionScheduleTemplateDetailEntries = (session: Session | null, setter: ((e:any) => void), id: number) => {
    getDetailsFromAPI(Api.GarbageCollectionScheduleTemplateDetailEntries, session, id)
        .then((e) => {
            setter({success: true, status: e.status, data: e.data});
        })
        .catch((e) => {
            setter({success: false, status: e.status, data: e});
        });
};

const getGarbageCollectionScheduleTemplateEntryDetail = (session: Session | null, setter: ((e:any) => void), id: number) => {
    getDetailsFromAPI(Api.GarbageCollectionScheduleTemplateEntryDetail, session, id)
        .then((e) => {
            setter({success: true, status: e.status, data: e.data});
        })
        .catch((e) => {
            setter({success: false, status: e.status, data: e});
        });
};

const getGarbageTypeDetail = (session: Session | null, setter: ((e:any) => void), id: number) => {
    getDetailsFromAPI(Api.GarbageTypeDetail, session, id)
        .then((e) => {
            setter({success: true, status: e.status, data: e.data});
        })
        .catch((e) => {
            setter({success: false, status: e.status, data: e});
        });
};

const getGarbageCollectionScheduleDetail = (session: Session | null, setter: ((e:any) => void), id: number) => {
    getDetailsFromAPI(Api.GarbageCollectionScheduleDetail, session, id)
        .then((e) => {
            setter({success: true, status: e.status, data: e.data});
        })
        .catch((e) => {
            setter({success: false, status: e.status, data: e});
        });
};

const getLocationGroupDetail = (session: Session | null, setter: ((e:any) => void), id: number) => {
    getDetailsFromAPI(Api.LocationGroupDetail, session, id)
        .then((e) => {
            setter({success: true, status: e.status, data: e.data});
        })
        .catch((e) => {
            setter({success: false, status: e.status, data: e});
        });
};

const getLocationGroupDetailBuildings = (session: Session | null, setter: ((e:any) => void), id: number) => {
    getDetailsFromAPI(Api.LocationGroupDetailBuildings, session, id)
        .then((e) => {
            setter({success: true, status: e.status, data: e.data});
        })
        .catch((e) => {
            setter({success: false, status: e.status, data: e});
        });
};

const getLocationGroupDetailScheduleDefinitions = (session: Session | null, setter: ((e:any) => void), id: number) => {
    getDetailsFromAPI(Api.LocationGroupDetailScheduleDefinitions, session, id)
        .then((e) => {
            setter({success: true, status: e.status, data: e.data});
        })
        .catch((e) => {
            setter({success: false, status: e.status, data: e});
        });
};

const getBuildingDetail = (session: Session | null, setter: ((e:any) => void), id: number) => {
    getDetailsFromAPI(Api.BuildingDetail, session, id)
        .then((e) => {
            setter({success: true, status: e.status, data: e.data});
        })
        .catch((e) => {
            setter({success: false, status: e.status, data: e});
        });
};

const postBuildingGenerateLink = (session: Session | null, id: number, setter?: ((e:any) => void)) => {
    postDetailsOnAPIWithId(Api.BuildingGenerateLink, session, id, {})
        .then((e) => {
            setter ? setter({success: true, status: e.status, data: e.data}) : undefined;
        })
        .catch((e) => {
            setter ? setter({success: false, status: e.status, data: e}) : undefined;
        });
};

const getBuildingDetailGarbageCollectionSchedules = (session: Session | null, setter: ((e:any) => void), id: number) => {
    getDetailsFromAPI(Api.BuildingDetailGarbageCollectionSchedules, session, id)
        .then((e) => {
            setter({success: true, status: e.status, data: e.data});
        })
        .catch((e) => {
            setter({success: false, status: e.status, data: e});
        });
};

const getBuildingDetailGarbageCollectionScheduleTemplates = (session: Session | null, setter: ((e:any) => void), id: number) => {
    getDetailsFromAPI(Api.BuildingDetailGarbageCollectionScheduleTemplates, session, id)
        .then((e) => {
            setter({success: true, status: e.status, data: e.data});
        })
        .catch((e) => {
            setter({success: false, status: e.status, data: e});
        });
};

const getScheduleWorkEntryDetail = (session: Session | null, setter: ((e:any) => void), id: number) => {
    getDetailsFromAPI(Api.ScheduleWorkEntryDetail, session, id)
        .then((e) => {
            setter({success: true, status: e.status, data: e.data});
        })
        .catch((e) => {
            setter({success: false, status: e.status, data: e});
        });
};


const getBuildingDetailScheduleDefinitions = (session: Session | null, setter: ((e:any) => void), id: number) => {
    getDetailsFromAPI(Api.BuildingDetailScheduleDefinitions, session, id)
        .then((e) => {
            setter({success: true, status: e.status, data: e.data});
        })
        .catch((e) => {
            setter({success: false, status: e.status, data: e});
        });
};

const getScheduleAssignmentDetail = (session: Session | null, setter: ((e:any) => void), id: number) => {
    getDetailsFromAPI(Api.ScheduleAssignmentDetail, session, id)
        .then((e) => {
            setter({success: true, status: e.status, data: e.data});
        })
        .catch((e) => {
            setter({success: false, status: e.status, data: e});
        });
};

const getScheduleDefinitionDetail = (session: Session | null, setter: ((e:any) => void), id: number) => {
    getDetailsFromAPI(Api.ScheduleDefinitionDetail, session, id)
        .then((e) => {
            setter({success: true, status: e.status, data: e.data});
        })
        .catch((e) => {
            setter({success: false, status: e.status, data: e});
        });
};

const getScheduleDefinitionDetailBuildings = (session: Session | null, setter: ((e:any) => void), id: number) => {
    getDetailsFromAPI(Api.ScheduleDefinitionDetailBuildings, session, id)
        .then((e) => {
            setter({success: true, status: e.status, data: e.data});
        })
        .catch((e) => {
            setter({success: false, status: e.status, data: e});
        });
};

const getScheduleDefinitionDetailOrder = (session: Session | null, setter: ((e:any) => void), id: number) => {
    getDetailsFromAPI(Api.ScheduleDefinitionDetailOrder, session, id)
        .then((e) => {
            setter({success: true, status: e.status, data: e.data});
        })
        .catch((e) => {
            setter({success: false, status: e.status, data: e});
        });
};

const getScheduleDefinitionDetailScheduleAssignments = (session: Session | null, setter: ((e:any) => void), id: number) => {
    getDetailsFromAPI(Api.ScheduleDefinitionDetailScheduleAssignments, session, id)
        .then((e) => {
            setter({success: true, status: e.status, data: e.data});
        })
        .catch((e) => {
            setter({success: false, status: e.status, data: e});
        });
};

const getBuildingDetailIssues = (session: Session | null, setter: ((e:any) => void), id: number) => {
    getDetailsFromAPI(Api.BuildingDetailIssues, session, id)
        .then((e) => {
            setter({success: true, status: e.status, data: e.data});
        })
        .catch((e) => {
            setter({success: false, status: e.status, data: e});
        });
};

const getScheduleDefinitionDetailScheduleWorkEntries = (session: Session | null, setter: ((e:any) => void), id: number) => {
    getDetailsFromAPI(Api.ScheduleDefinitionDetailScheduleWorkEntries, session, id)
        .then((e) => {
            setter({success: true, status: e.status, data: e.data});
        })
        .catch((e) => {
            setter({success: false, status: e.status, data: e});
        });
};

const getUserDetail = (session: Session | null, setter: ((e:any) => void), id: number) => {
    getDetailsFromAPI(Api.UserDetail, session, id)
        .then((e) => {
            setter({success: true, status: e.status, data: e.data});
        })
        .catch((e) => {
            setter({success: false, status: e.status, data: e});
        });
};

const getUserAnalytics = (session: Session | null, setter: ((e:any) => void), id: number) => {
    getDetailsFromAPI(Api.UserAnalytics, session, id)
        .then((e) => {
            setter({success: true, status: e.status, data: e.data});
        })
        .catch((e) => {
            setter({success: false, status: e.status, data: e});
        });
};

const getUserInvite = (session: Session | null, setter: ((e:any) => void), uuid: string) => {
    getDetailsFromAPI(Api.InviteLink, session, uuid)
        .then((e) => {
            setter({success: true, status: e.status, data: e.data});
        })
        .catch((e) => {
            setter({success: false, status: e.status, data: e});
        });
};

const getUserResetPassword = (session: Session | null, setter: ((e:any) => void), uuid: string) => {
    getDetailsFromAPI(Api.ResetPasswordLink, session, uuid)
        .then((e) => {
            setter({success: true, status: e.status, data: e.data});
        })
        .catch((e) => {
            setter({success: false, status: e.status, data: e});
        });
};

const getIssueDetail = (session: Session | null, setter: ((e:any) => void), id: number) => {
    getDetailsFromAPI(Api.IssueDetail, session, id)
        .then((e) => {
            setter({success: true, status: e.status, data: e.data});
        })
        .catch((e) => {
            setter({success: false, status: e.status, data: e});
        });
};

const postUserInvite = (session: Session | null, uuid: string, data: any, setter?: ((e:any) => void)) => {
    postDetailsOnAPIWithId(Api.InviteLink, session, uuid, data)
        .then((e) => {
            setter ? setter({success: true, status: e.status, data: e.data}) : undefined;
        })
        .catch((e) => {
            setter ? setter({success: false, status: e.status, data: e}) : undefined;
        });
};

const postUserCreateResetPassword = (session: Session | null, data: any, setter?: ((e:any) => void)) => {
    postDetailsToAPI(Api.ResetPassword, session, data)
        .then((e) => {
            setter ? setter({success: true, status: e.status, data: e.data}) : undefined;
        })
        .catch((e) => {
            setter ? setter({success: false, status: e.status, data: e}) : undefined;
        });
};

const postUserResetPassword = (session: Session | null, uuid: string, data: any, setter?: ((e:any) => void)) => {
    postDetailsOnAPIWithId(Api.ResetPasswordLink, session, uuid, data)
        .then((e) => {
            setter ? setter({success: true, status: e.status, data: e.data}) : undefined;
        })
        .catch((e) => {
            setter ? setter({success: false, status: e.status, data: e}) : undefined;
        });
};

const postGarbageCollectionScheduleTemplate = (session: Session | null, data: any, setter?: ((e:any) => void)) => {
    postDetailsToAPI(Api.GarbageCollectionScheduleTemplates, session, data)
        .then((e) => {
            setter ? setter({success: true, status: e.status, data: e.data}) : undefined;
        })
        .catch((e) => {
            setter ? setter({success: false, status: e.status, data: e}) : undefined;
        });
};

const postGarbageCollectionScheduleTemplateEntry = (session: Session | null, data: any, setter?: ((e:any) => void)) => {
    postDetailsToAPI(Api.GarbageCollectionScheduleTemplateEntries, session, data)
        .then((e) => {
            setter ? setter({success: true, status: e.status, data: e.data}) : undefined;
        })
        .catch((e) => {
            setter ? setter({success: false, status: e.status, data: e}) : undefined;
        });
};

const postGarbageType = (session: Session | null, data: any, setter?: ((e:any) => void)) => {
    postDetailsToAPI(Api.GarbageTypes, session, data)
        .then((e) => {
            setter ? setter({success: true, status: e.status, data: e.data}) : undefined;
        })
        .catch((e) => {
            setter ? setter({success: false, status: e.status, data: e}) : undefined;
        });
};

const postGarbageCollectionSchedule = (session: Session | null, data: any, setter?: ((e:any) => void)) => {
    postDetailsToAPI(Api.GarbageCollectionSchedules, session, data)
        .then((e) => {
            setter ? setter({success: true, status: e.status, data: e.data}) : undefined;
        })
        .catch((e) => {
            setter ? setter({success: false, status: e.status, data: e}) : undefined;
        });
};

const postLocationGroup = (session: Session | null, data: any, setter?: ((e:any) => void)) => {
    postDetailsToAPI(Api.LocationGroups, session, data)
        .then((e) => {
            setter ? setter({success: true, status: e.status, data: e.data}) : undefined;
        })
        .catch((e) => {
            setter ? setter({success: false, status: e.status, data: e}) : undefined;
        });
};

const postBuilding = (session: Session | null, data: any, setter?: ((e:any) => void)) => {
    postDetailsToAPI(Api.Buildings, session, data)
        .then((e) => {
            setter ? setter({success: true, status: e.status, data: e.data}) : undefined;
        })
        .catch((e) => {
            setter ? setter({success: false, status: e.status, data: e}) : undefined;
        });
};

const postScheduleAssignment = (session: Session | null, data: any, setter?: ((e:any) => void)) => {
    postDetailsToAPI(Api.ScheduleAssignments, session, data)
        .then((e) => {
            setter ? setter({success: true, status: e.status, data: e.data}) : undefined;
        })
        .catch((e) => {
            setter ? setter({success: false, status: e.status, data: e}) : undefined;
        });
};

const postScheduleWorkEntry = (session: Session | null, data: any, setter?: ((e:any) => void)) => {
    postDetailsToAPI(Api.ScheduleWorkEntries, session, data)
        .then((e) => {
            setter ? setter({success: true, status: e.status, data: e.data}) : undefined;
        })
        .catch((e) => {
            setter ? setter({success: false, status: e.status, data: e}) : undefined;
        });
};

const postScheduleDefinition = (session: Session | null, data: any, setter?: ((e:any) => void)) => {
    postDetailsToAPI(Api.ScheduleDefinitions, session, data)
        .then((e) => {
            setter ? setter({success: true, status: e.status, data: e.data}) : undefined;
        })
        .catch((e) => {
            setter ? setter({success: false, status: e.status, data: e}) : undefined;
        });
};

const postScheduleDefinitionDetailOrder = (session: Session | null, id: number, data: any, setter?: ((e:any) => void)) => {
    postDetailsOnAPIWithId(Api.ScheduleDefinitionDetailOrder, session, id, data)
        .then((e) => {
            setter ? setter({success: true, status: e.status, data: e.data}) : undefined;
        })
        .catch((e) => {
            setter ? setter({success: false, status: e.status, data: e}) : undefined;
        });
};

const postUser = (session: Session | null, data: any, setter?: ((e:any) => void)) => {
    postDetailsToAPI(Api.Users, session, data)
        .then((e) => {
            setter ? setter({success: true, status: e.status, data: e.data}) : undefined;
        })
        .catch((e) => {
            setter ? setter({success: false, status: e.status, data: e}) : undefined;
        });
};


const postIssue = (session: Session | null, data: any, setter?: ((e:any) => void)) => {
    postDetailsToAPI(Api.Issues, session, data)
        .then((e) => {
            setter ? setter({success: true, status: e.status, data: e.data}) : undefined;
        })
        .catch((e) => {
            setter ? setter({success: false, status: e.status, data: e}) : undefined;
        });
};

const postIssueImage = (session: Session | null, data: any, setter?: ((e:any) => void)) => {
    postDetailsToAPI(Api.IssueImages, session, data)
        .then((e) => {
            setter ? setter({success: true, status: e.status, data: e.data}) : undefined;
        })
        .catch((e) => {
            setter ? setter({success: false, status: e.status, data: e}) : undefined;
        });
};


const deleteGarbageCollectionScheduleTemplate = (session: Session | null, id: number, setter?: ((e:any) => void)) => {
    deleteDetailsOnAPI(Api.GarbageCollectionScheduleTemplateDetail, session, id)
        .then((e) => {
            setter ? setter({success: true, status: e.status, data: e.data}) : undefined;
        })
        .catch((e) => {
            setter ? setter({success: false, status: e.status, data: e}) : undefined;
        });
};

const deleteGarbageCollectionScheduleTemplateEntry = (session: Session | null, id: number, setter?: ((e:any) => void)) => {
    deleteDetailsOnAPI(Api.GarbageCollectionScheduleTemplateEntryDetail, session, id)
        .then((e) => {
            setter ? setter({success: true, status: e.status, data: e.data}) : undefined;
        })
        .catch((e) => {
            setter ? setter({success: false, status: e.status, data: e}) : undefined;
        });
};

const deleteGarbageType = (session: Session | null, id: number, setter?: ((e:any) => void)) => {
    deleteDetailsOnAPI(Api.GarbageTypeDetail, session, id)
        .then((e) => {
            setter ? setter({success: true, status: e.status, data: e.data}) : undefined;
        })
        .catch((e) => {
            setter ? setter({success: false, status: e.status, data: e}) : undefined;
        });
};

const deleteGarbageCollectionSchedule = (session: Session | null, id: number, setter?: ((e:any) => void)) => {
    deleteDetailsOnAPI(Api.GarbageCollectionScheduleDetail, session, id)
        .then((e) => {
            setter ? setter({success: true, status: e.status, data: e.data}) : undefined;
        })
        .catch((e) => {
            setter ? setter({success: false, status: e.status, data: e}) : undefined;
        });
};

const deleteLocationGroup = (session: Session | null, id: number, setter?: ((e:any) => void)) => {
    deleteDetailsOnAPI(Api.LocationGroupDetail, session, id)
        .then((e) => {
            setter ? setter({success: true, status: e.status, data: e.data}) : undefined;
        })
        .catch((e) => {
            setter ? setter({success: false, status: e.status, data: e}) : undefined;
        });
};

const deleteBuilding = (session: Session | null, id: number, setter?: ((e:any) => void)) => {
    deleteDetailsOnAPI(Api.BuildingDetail, session, id)
        .then((e) => {
            setter ? setter({success: true, status: e.status, data: e.data}) : undefined;
        })
        .catch((e) => {
            setter ? setter({success: false, status: e.status, data: e}) : undefined;
        });
};

const deleteScheduleAssignment = (session: Session | null, id: number, setter?: ((e:any) => void)) => {
    deleteDetailsOnAPI(Api.ScheduleAssignmentDetail, session, id)
        .then((e) => {
            setter ? setter({success: true, status: e.status, data: e.data}) : undefined;
        })
        .catch((e) => {
            setter ? setter({success: false, status: e.status, data: e}) : undefined;
        });
};

const deleteScheduleWorkEntry = (session: Session | null, id: number, setter?: ((e:any) => void)) => {
    deleteDetailsOnAPI(Api.ScheduleWorkEntryDetail, session, id)
        .then((e) => {
            setter ? setter({success: true, status: e.status, data: e.data}) : undefined;
        })
        .catch((e) => {
            setter ? setter({success: false, status: e.status, data: e}) : undefined;
        });
};

const deleteScheduleDefinition = (session: Session | null, id: number, setter?: ((e:any) => void)) => {
    deleteDetailsOnAPI(Api.ScheduleDefinitionDetail, session, id)
        .then((e) => {
            setter ? setter({success: true, status: e.status, data: e.data}) : undefined;
        })
        .catch((e) => {
            setter ? setter({success: false, status: e.status, data: e}) : undefined;
        });
};

const deleteUser = (session: Session | null, id: number, setter?: ((e:any) => void)) => {
    deleteDetailsOnAPI(Api.UserDetail, session, id)
        .then((e) => {
            setter ? setter({success: true, status: e.status, data: e.data}) : undefined;
        })
        .catch((e) => {
            setter ? setter({success: false, status: e.status, data: e}) : undefined;
        });
};

const deleteIssue = (session: Session | null, id: number, setter?: ((e:any) => void)) => {
    deleteDetailsOnAPI(Api.IssueDetail, session, id)
        .then((e) => {
            setter ? setter({success: true, status: e.status, data: e.data}) : undefined;
        })
        .catch((e) => {
            setter ? setter({success: false, status: e.status, data: e}) : undefined;
        });
};


const patchGarbageCollectionScheduleTemplateDetail = (session: Session | null, id: number, data: any, setter?: ((e:any) => void)) => {
    patchDetailsOnAPI(Api.GarbageCollectionScheduleTemplateDetail, session, id, data)
        .then((e) => {
            setter ? setter({success: true, status: e.status, data: e.data}) : undefined;
        })
        .catch((e) => {
            setter ? setter({success: false, status: e.status, data: e}) : undefined;
        });
};

const patchGarbageCollectionScheduleTemplateEntryDetail = (session: Session | null, id: number, data: any, setter?: ((e:any) => void)) => {
    patchDetailsOnAPI(Api.GarbageCollectionScheduleTemplateEntryDetail, session, id, data)
        .then((e) => {
            setter ? setter({success: true, status: e.status, data: e.data}) : undefined;
        })
        .catch((e) => {
            setter ? setter({success: false, status: e.status, data: e}) : undefined;
        });
};

const patchGarbageTypeDetail = (session: Session | null, id: number, data: any, setter?: ((e:any) => void)) => {
    patchDetailsOnAPI(Api.GarbageTypeDetail, session, id, data)
        .then((e) => {
            setter ? setter({success: true, status: e.status, data: e.data}) : undefined;
        })
        .catch((e) => {
            setter ? setter({success: false, status: e.status, data: e}) : undefined;
        });
};

const patchGarbageCollectionScheduleDetail = (session: Session | null, id: number, data: any, setter?: ((e:any) => void)) => {
    patchDetailsOnAPI(Api.GarbageCollectionScheduleDetail, session, id, data)
        .then((e) => {
            setter ? setter({success: true, status: e.status, data: e.data}) : undefined;
        })
        .catch((e) => {
            setter ? setter({success: false, status: e.status, data: e}) : undefined;
        });
};

const patchLocationGroupDetail = (session: Session | null, id: number, data: any, setter?: ((e:any) => void)) => {
    patchDetailsOnAPI(Api.LocationGroupDetail, session, id, data)
        .then((e) => {
            setter ? setter({success: true, status: e.status, data: e.data}) : undefined;
        })
        .catch((e) => {
            setter ? setter({success: false, status: e.status, data: e}) : undefined;
        });
};

const patchBuildingDetail = (session: Session | null, id: number, data: any, setter?: ((e:any) => void)) => {
    patchDetailsOnAPI(Api.BuildingDetail, session, id, data)
        .then((e) => {
            setter ? setter({success: true, status: e.status, data: e.data}) : undefined;
        })
        .catch((e) => {
            setter ? setter({success: false, status: e.status, data: e}) : undefined;
        });
};

const patchScheduleAssignmentDetail = (session: Session | null, id: number, data: any, setter?: ((e:any) => void)) => {
    patchDetailsOnAPI(Api.ScheduleAssignmentDetail, session, id, data)
        .then((e) => {
            setter ? setter({success: true, status: e.status, data: e.data}) : undefined;
        })
        .catch((e) => {
            setter ? setter({success: false, status: e.status, data: e}) : undefined;
        });
};

const patchScheduleWorkEntryDetail = (session: Session | null, id: number, data: any, setter?: ((e:any) => void)) => {
    patchDetailsOnAPI(Api.ScheduleWorkEntryDetail, session, id, data)
        .then((e) => {
            setter ? setter({success: true, status: e.status, data: e.data}) : undefined;
        })
        .catch((e) => {
            setter ? setter({success: false, status: e.status, data: e}) : undefined;
        });
};

const patchScheduleDefinitionDetail = (session: Session | null, id: number, data: any, setter?: ((e:any) => void)) => {
    patchDetailsOnAPI(Api.ScheduleDefinitionDetail, session, id, data)
        .then((e) => {
            setter ? setter({success: true, status: e.status, data: e.data}) : undefined;
        })
        .catch((e) => {
            setter ? setter({success: false, status: e.status, data: e}) : undefined;
        });
};

const patchUserDetail = (session: Session | null, id: number, data: any, setter?: ((e:any) => void)) => {
    patchDetailsOnAPI(Api.UserDetail, session, id, data)
        .then((e) => {
            setter ? setter({success: true, status: e.status, data: e.data}) : undefined;
        })
        .catch((e) => {
            setter ? setter({success: false, status: e.status, data: e}) : undefined;
        });
};

const patchIssueDetail = (session: Session | null, id: number, data: any, setter?: ((e:any) => void)) => {
    patchDetailsOnAPI(Api.IssueDetail, session, id, data)
        .then((e) => {
            setter ? setter({success: true, status: e.status, data: e.data}) : undefined;
        })
        .catch((e) => {
            setter ? setter({success: false, status: e.status, data: e}) : undefined;
        });
};

async function getMeFromAPI(route: Api, session: any) {
    const data = await axios.get(process.env.NEXT_API_URL + route, {headers: getAuthHeader(session)});

    if (!('data' in data)) {
        throw new ApiError(data);
    }

    return data;
}
const getMe = (session: Session | null, setter: ((e:any) => void)) => {
    getMeFromAPI(Api.Me, session)
        .then((e) => {
            setter({success: true, status: e.status, data: e.data});
        })
        .catch((e) => {
            setter({success: false, status: e.status, data: e});
        });
};

export {
    useAuthenticatedApi,

    getGarbageCollectionScheduleTemplateDetail,
    getGarbageCollectionScheduleTemplateDetailEntries,
    getGarbageCollectionScheduleTemplateEntryDetail,
    getGarbageTypesList,
    getGarbageTypeDetail,
    getGarbageCollectionsSchedulesList,
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
    getScheduleDefinitionsAssignedToMeList,
    getScheduleAssignmentDetail,
    getScheduleWorkEntriesList,
    getScheduleWorkEntryDetail,
    getScheduleDefinitionsList,
    getLatestScheduleDefinitionsList,
    getScheduleDefinitionDetail,
    getScheduleDefinitionDetailBuildings,
    getScheduleDefinitionDetailOrder,
    getScheduleDefinitionDetailScheduleAssignments,
    getScheduleDefinitionDetailScheduleWorkEntries,
    getUsersList,
    getUserDetail,
    getIssueDetail,
    getMe,
    getUserInvite,
    getUserResetPassword,
    getUserAnalytics,

    postGarbageCollectionScheduleTemplate,
    postGarbageCollectionScheduleTemplateEntry,
    postGarbageType,
    postGarbageCollectionSchedule,
    postLocationGroup,
    postBuilding,
    postBuildingGenerateLink,
    postScheduleAssignment,
    postScheduleWorkEntry,
    postScheduleDefinition,
    postScheduleDefinitionDetailOrder,
    postUser,
    postIssue,
    postIssueImage,
    postUserInvite,
    postUserCreateResetPassword,
    postUserResetPassword,

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
    deleteIssue,

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
    patchIssueDetail,
};
