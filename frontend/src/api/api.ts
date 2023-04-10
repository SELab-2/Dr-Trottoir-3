import useSWR, {SWRResponse} from 'swr';
import {useSession} from 'next-auth/react';

export enum Api {
    /* eslint-disable no-unused-vars */
    /* eslint-disable max-len */
    GarbageCollectionScheduleTemplateDetail = '/garbage_collection_schedule_templates/:id/',
    GarbageCollectionScheduleTemplateDetailEntries = '/garbage_collection_schedule_templates/:id/entries/',
    GarbageCollectionScheduleTemplateEntryDetail = '/garbage_collection_schedule_template_entries/:id/',
    GarbageTypes = '/garbage_types/',
    GarbageTypeDetail = '/garbage_types/:id/',
    GarbageCollectionScheduleDetail = '/garbage_collection_schedules/:id',
    LocationGroups = '/location_groups/',
    LocationGroupDetail = '/location_groups/:id/',
    LocationGroupDetailBuildings = '/location_groups/:id/buildings/',
    LocationGroupDetailScheduleDefinitions = '/location_groups/:id/schedule_definitions/',
    Buildings = '/buildings/',
    BuildingDetail = '/buildings/:id/',
    BuildingDetailGarbageCollectionSchedules = '/buildings/:id/garbage_collection_schedules/',
    BuildingDetailGarbageCollectionScheduleTemplates = '/buildings/:id/garbage_collection_schedule_templates/',
    BuildingDetailIssues = '/buildings/:id/issues/',
    BuildingDetailScheduleDefinitions = '/buildings/:id/schedule_definitions/',
    ScheduleAssignments = '/schedule_assignments/',
    ScheduleAssignmentDetail = '/schedule_assignments/:id/',
    ScheduleWorkEntries = '/schedule_work_entries/',
    ScheduleWorkEntryDetail = '/schedule_work_entries/:id/',
    ScheduleDefinitions = '/schedule_definitions/',
    ScheduleDefinitionDetail = '/schedule_definitions/:id/',
    ScheduleDefinitionDetailBuildings = '/schedule_definitions/:id/buildings/',
    ScheduleDefinitionDetailScheduleAssignments = '/schedule_definitions/:id/schedule_assignments/',
    ScheduleDefinitionDetailScheduleWorkEntries = '/schedule_definitions/:id/schedule_work_entries/',
    Users = '/users/',
    UserDetail = '/users/:id/',
}

export type PaginatedResponse<T> = {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
};

/**
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
 * @param {Array<string>} args
 * @return {Promise<T[]>}
 * **/
async function fetcherArray<T>(args: {paths: string[], token: string}): Promise<T[]> {
    // @ts-ignore
    // eslint-disable-next-line no-undef
    const fetchSingle = (path) => {
        // eslint-disable-next-line no-undef
        const url = process.env.NEXT_API_URL + path.slice(1);
        return fetch(url, {
            headers: {
                'Authorization': `Bearer  ${args.token}`,
            },
        }).then((res)=> res.json() as T);
    };
    return Promise.all(args.paths.map(fetchSingle));
}

/**
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
    routeStr +='?'+ queryParams.toString();

    const {data: session} = useSession();

    // @ts-ignore
    const token = session ? session.accessToken : '';

    return useSWR<PaginatedResponse<T>>([token, routeStr], fetcher);
}

/**
 * @param {Api} route API route to request
 * @param {any} id ID of detail route to use
 * @return {SWRResponse}
 * **/
export function getDetail<T>(route: Api, id: number|undefined): SWRResponse<T, any> {
    // In case no id is given (for example, because a dependency hasn't been loaded yet),
    // we fetch the item with id 0, which always results in a 404.
    if (!id) id = 0;
    const routeStr = route.replace(':id', id.toString());
    console.log(`getting ${routeStr}`);

    const {data: session} = useSession();

    // @ts-ignore
    const token = session ? session.accessToken : '';

    return useSWR<T>([token, routeStr], fetcher);
}

export function getDetailArray<T>(route: Api | string, ids: number[] | undefined): SWRResponse<T[]> {
    if (!ids) ids = [0];
    const routeStrs = ids.map((id)=>route.replace(':id', id.toString()));
    const {data: session} = useSession();
    console.log(`getting array ${routeStrs}`);

    // @ts-ignore
    const token = session ? session.accessToken : '';
    return useSWR<T[]>([token, routeStrs], fetcherArray);
}
