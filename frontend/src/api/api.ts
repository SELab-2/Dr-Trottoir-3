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
  GarbageCollectionScheduleDetail = '/garbage_collection_schedules/:id/',
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
  Issues = '/issues/',
  IssueDetail = '/issues/:id/'
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

async function patcher<T>(
    args: {path: string, token: string, body: object}): Promise<T> {
    // eslint-disable-next-line no-undef
    const url = process.env.NEXT_API_URL + args.path;
    return fetch(url,
        {
            method: 'PATCH',
            body: JSON.stringify(args.body),
            headers: {
                'Authorization': `Bearer  ${args.token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        }
    ).then((res) => res.json() as T);
}

async function deleter<T>(args: {path: string, token: string}): Promise<Response> {
    // eslint-disable-next-line no-undef
    const url = process.env.NEXT_API_URL + args.path;
    return fetch(url,
        {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer  ${args.token}`,
            },
        }
    );
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
    routeStr += '?' + queryParams.toString();

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const {data: session} = useSession();

    // @ts-ignore
    const token = session ? session.accessToken : '';

    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useSWR<PaginatedResponse<T>>([token, routeStr], fetcher);
}

/**
 * @param {Api} route API route to request
 * @param {any} id ID of detail route to use
 * @return {SWRResponse}
 * **/
export function getDetail<T>(route: Api, id: number | undefined): SWRResponse<T, any> {
    // In case no id is given (for example, because a dependency hasn't been loaded yet),
    // we fetch the item with id 0, which always results in a 404.
    if (!id) id = 0;
    const routeStr = route.replace(':id', id.toString());

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const {data: session} = useSession();

    // @ts-ignore
    const token = session ? session.accessToken : '';

    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useSWR<T>([token, routeStr], fetcher);
}

export function patchDetail<T>(route: Api, id: number, body: object, token: string): Promise<T> {
    // Note: I don't believe a token can be added here, because patch requests usually happen at
    // the press of a button, and are thus conditional. If you find a way to use useSession here,
    // please change accordingly.
    const routeStr = route.replace(':id', id.toString());
    return patcher<T>({token: token, path: routeStr, body: body});
}

export function deleteDetail<T>(route: Api, id: number, token: string): Promise<Response> {
    const routeStr = route.replace(':id', id.toString());
    return deleter({path: routeStr, token: token});
}
