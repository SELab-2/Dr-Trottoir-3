// imports
import dynamic from 'next/dynamic';
import {forwardRef, ForwardRefExoticComponent, RefAttributes, RefObject} from 'react';

// styling
import '@toast-ui/calendar/dist/toastui-calendar.min.css';
// dynamically load wrapper without ssr, use forwardRef for props
const TUICalendar = dynamic(() =>
    import('../TUICalendar/TUICalendarWrapper'), {ssr: false}
);

type calendarProps = {
    height: string,
    calendars: any,
    month: any,
    events: Partial<any>,
    theme: any,
    useDetailPopup: boolean,
    useFormPopup: boolean,
    view: string,
    week: any,
    ref: RefObject<ForwardRefExoticComponent<Omit<calendarProps, 'ref'> & RefAttributes<unknown>>>,
    onAfterRenderEvent: any,
    onBeforeDeleteEvent: any,
    onClickDayname: any,
    onClickEvent: any,
    onClickTimezonesCollapseBtn: any,
    onBeforeUpdateEvent: any,
    onBeforeCreateEvent: any,
};
export const Calendar = forwardRef((props: calendarProps, ref) => (
    <TUICalendar {...props} forwardedRef={ref}></TUICalendar>
));
