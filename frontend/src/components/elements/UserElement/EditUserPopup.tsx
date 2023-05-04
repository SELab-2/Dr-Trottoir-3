import React from 'react';
import {Admin, Student, Syndicus} from '@/api/models';


type EditUserPopupProps = {
    userId: number,
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    prevFirstName: string,
    prevLastName: string,
    prevAdmin: Admin,
    prevStudent: Student,
    prevSyndic: Syndicus,
}

export default function EditUserPopup({userId, open, setOpen, prevFirstName, prevLastName, prevAdmin, prevStudent,
    prevSyndic}: EditUserPopupProps) {

}
