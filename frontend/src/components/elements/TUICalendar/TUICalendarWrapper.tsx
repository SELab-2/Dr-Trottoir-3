import React from 'react';
import Calendar from '@toast-ui/react-calendar';

export default (props: any) => (
    <Calendar {...props} ref={props.forwardedRef}/>
);
