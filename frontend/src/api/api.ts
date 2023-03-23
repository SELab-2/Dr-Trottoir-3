import useSWR, {SWRResponse} from 'swr';

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
        }}).then((res) => res.json<T>());
}

/**
 * @param {Api} route
 * @return {SWRResponse}
 * **/
export function get<T>(route: Api): SWRResponse<T, any> {
    const { data: session } = useSession();
    return useSWR<T>([session.accessToken, route], fetcher);
}

/**
 * @param {string} route
 * @param {any} params
 * @return {SWRResponse}
 * **/
export function getParams<T>(route: Api, params: any): SWRResponse<T, any> {
    for (const property in params) {
        route = route.replace(':' + property, params[property]);
    }

    const { data: session } = useSession();
    return useSWR<T>([session.accessToken, route], fetcher);
}
