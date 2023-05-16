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
    note: string;
};

export type Building = {
    id: number;
    name: string,
    address: string;
    pdf_guide: string;
    is_active: boolean;
    location_group: number;
    image: string;
    description: string;
    longitude: number | null,
    latitude: number | null,
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
    entry_type: 'AR' | 'WO' | 'DE';
};

export type ScheduleDefinition = {
    id: number;
    name: string;
    version: number;
    location_group: number;
    buildings: number[];
}

export type Student = {
    id: number,
    user: number,
    is_super_student: boolean,
    location_group: number,
}

export type Admin = {
    id: number,
    user: number,
}

export type Syndicus = {
    id: number,
    user: number,
    buildings: number[],
}

export type User = {
    id: number,
    first_name: string,
    last_name: string,
    student: undefined | Student,
    admin: undefined | Admin,
    syndicus: undefined | Syndicus,
    invite_link: string
}

export type Issue = {
    id: number
    resolved: boolean,
    message: string,
    building: number,
    from_user: number,
    approval_user: number | null | undefined
}
