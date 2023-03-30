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
}

type PaginatedResponse<T> = {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
};

/**
 * @param {string} token
 * @param {string} url
 * @return {Promise<T>}
 * **/
async function fetcher<T>(token: string, url: string): Promise<T> {
    // @ts-ignore
    return fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`,
        }}).then((res) => {
        return res.json() as Promise<T>;
    });
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
    routeStr += queryParams.toString();

    const {data: session} = useSession();
    // @ts-ignore
    const token = session !== null ? session.accessToken : '';

    return useSWR<PaginatedResponse<T>>([token, routeStr], fetcher);
}

/**
 * @param {Api} route API route to request
 * @param {any} id ID of detail route to use
 * @return {SWRResponse}
 * **/
export function getDetail<T>(route: Api, id: number): SWRResponse<T, any> {
    const routeStr = route.replace(':id', id.toString());

    const {data: session} = useSession();
    // @ts-ignore
    const token = session !== null ? session.accessToken : '';

    return useSWR<T>([token, routeStr], fetcher);
}
