// imports
import dynamic from 'next/dynamic';
import {forwardRef} from 'react';

// styling
import '@toast-ui/calendar/dist/toastui-calendar.min.css';

// dynamically load wrapper without ssr, use forwardRef for props
const TUICalendar = dynamic(() =>
    import('../TUICalendar/TUICalendarWrapper'), {ssr: false}
);

export const Calendar = forwardRef((props, ref) => (
    <TUICalendar {...props} forwardedRef={ref}></TUICalendar>
));
