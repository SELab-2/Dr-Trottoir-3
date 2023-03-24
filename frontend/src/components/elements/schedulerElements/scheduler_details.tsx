import type {EventObject, ExternalEventTypes, Options} from '@toast-ui/calendar';
import {TZDate} from '@toast-ui/calendar';
import {useCallback, useEffect, useRef, useState} from 'react';

import {Calendar} from '../TUICalendar/TUICalendarComponent';
import {theme} from '../TUICalendar/TUICalendarTheme';
import {addHours} from '../TUICalendar/TUICalendarUtils';

type ViewType = 'month' | 'week' | 'day';

const today = new TZDate();

export default function SchedulerDetails() {
    const view: ViewType = 'week';

    const calendarRef = useRef<typeof Calendar>(null);
    const [, setSelectedDateRangeText] = useState('');
    const [selectedView, setSelectedView] = useState(view);
    const initialCalendars: Options['calendars'] = [
        {
            id: '0',
            name: 'Gent',
            backgroundColor: '#9e5fff',
            borderColor: '#9e5fff',
            dragBackgroundColor: '#9e5fff',
        },
        {
            id: '1',
            name: 'Leuven',
            backgroundColor: '#00a9ff',
            borderColor: '#00a9ff',
            dragBackgroundColor: '#00a9ff',
        },
    ];
    const initialEvents: Partial<EventObject>[] = [
        {
            id: '1',
            calendarId: '0',
            title: 'TOAST UI Calendar Study',
            category: 'time',
            start: today,
            end: addHours(today, 3),
        },
    ];

    // @ts-ignore
    const getCalInstance = useCallback(() => calendarRef.current?.getInstance?.(), []);

    const updateRenderRangeText = useCallback(() => {
        const calInstance = getCalInstance();
        if (!calInstance) {
            setSelectedDateRangeText('');
        }

        const viewName = calInstance.getViewName();
        const calDate = calInstance.getDate();
        const rangeStart = calInstance.getDateRangeStart();
        const rangeEnd = calInstance.getDateRangeEnd();

        let year = calDate.getFullYear();
        let month = calDate.getMonth() + 1;
        let date = calDate.getDate();
        let dateRangeText: string;

        switch (viewName) {
        case 'month': {
            dateRangeText = `${year}-${month}`;
            break;
        }
        case 'week': {
            year = rangeStart.getFullYear();
            month = rangeStart.getMonth() + 1;
            date = rangeStart.getDate();
            const endMonth = rangeEnd.getMonth() + 1;
            const endDate = rangeEnd.getDate();

            // eslint-disable-next-line max-len
            const start = `${year}-${month < 10 ? '0' : ''}${month}-${date < 10 ? '0' : ''}${date}`;
            const end = `${year}-${endMonth < 10 ? '0' : ''}${endMonth}-${
                endDate < 10 ? '0' : ''
            }${endDate}`;
            dateRangeText = `${start} ~ ${end}`;
            break;
        }
        default:
            dateRangeText = `${year}-${month}-${date}`;
        }

        setSelectedDateRangeText(dateRangeText);
    }, [getCalInstance]);

    useEffect(() => {
        setSelectedView(view);
    }, [view]);

    useEffect(() => {
        updateRenderRangeText();
    }, [selectedView, updateRenderRangeText]);

    const onAfterRenderEvent: ExternalEventTypes['afterRenderEvent'] = (res) => {

    };

    // eslint-disable-next-line max-len
    const onBeforeDeleteEvent: ExternalEventTypes['beforeDeleteEvent'] = (res) => {
        const {id, calendarId} = res;

        getCalInstance().deleteEvent(id, calendarId);
    };

    const onClickDayName: ExternalEventTypes['clickDayName'] = (res) => {

    };


    const onClickEvent: ExternalEventTypes['clickEvent'] = (res) => {};

    // eslint-disable-next-line max-len
    const onClickTimezonesCollapseBtn: ExternalEventTypes['clickTimezonesCollapseBtn'] = (

    ) => {
        const newTheme = {
            'week.daygridLeft.width': '100px',
            'week.timegridLeft.width': '100px',
        };

        getCalInstance().setTheme(newTheme);
    };

    // eslint-disable-next-line max-len
    const onBeforeUpdateEvent: ExternalEventTypes['beforeUpdateEvent'] = (updateData) => {
        const targetEvent = updateData.event;
        const changes = {...updateData.changes};

        getCalInstance().updateEvent(
            targetEvent.id,
            targetEvent.calendarId,
            changes
        );
    };

    // eslint-disable-next-line max-len
    const onBeforeCreateEvent: ExternalEventTypes['beforeCreateEvent'] = (eventData) => {
        const event = {
            calendarId: eventData.calendarId || '',
            id: String(Math.random()),
            title: eventData.title,
            isAllday: eventData.isAllday,
            start: eventData.start,
            end: eventData.end,
            category: eventData.isAllday ? 'allday' : 'time',
            dueDateClass: '',
            location: eventData.location,
            state: eventData.state,
            isPrivate: eventData.isPrivate,
        };

        getCalInstance().createEvents([event]);
    };

    // @ts-ignore
    return (
        <div style={{height: '100%'}}>
            <Calendar
                height={{height: '100%'}}
                calendars={initialCalendars}
                month={{startDayOfWeek: 1}}
                events={initialEvents}
                theme={theme}
                useDetailPopup={true}
                useFormPopup={true}
                view={selectedView}
                week={{
                    showTimezoneCollapseButton: true,
                    timezonesCollapsed: false,
                    eventView: false,
                    taskView: true,
                }}
                ref={calendarRef}
                onAfterRenderEvent={onAfterRenderEvent}
                onBeforeDeleteEvent={onBeforeDeleteEvent}
                onClickDayname={onClickDayName}
                onClickEvent={onClickEvent}
                onClickTimezonesCollapseBtn={onClickTimezonesCollapseBtn}
                onBeforeUpdateEvent={onBeforeUpdateEvent}
                onBeforeCreateEvent={onBeforeCreateEvent}
            />
        </div>
    );
}
