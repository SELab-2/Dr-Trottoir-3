export type LocationGroup = {
    id: number;
    name: string;
};

export type GarbageCollectionScheduleTemplate = {
    id: number;
    name: string;
    building: number;
};

export type GarbageCollectionScheduleTemplateEntry = {
    id: number;
    day: number;
    garbage_type: number;
    garbage_collection_schedule_template: number;
};

export type GarbageType = {
    id: number;
    name: string;
};

export type GarbageCollectionSchedule = {
    id: number;
    for_day: string;
    building: number;
    garbage_type: number;
};

export type Building = {
    id: number;
    address: string;
    pdf_guide: string;
    is_active: boolean;
    location_group: number;
};

export type ScheduleAssignment = {
    id: number;
    assigned_date: string;
    schedule_definition: number;
    user: number;
};

export type ScheduleWorkEntry = {
    id: number;
    creation_timestamp: string;
    image: string;
    creator: number;
    building: number;
    schedule_assignment: number;
};

export type ScheduleDefinition = {
    id: number;
    name: string;
    version: number;
    location_group: number;
    buildings: number[];
}
