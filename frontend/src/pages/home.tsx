import {useSession} from "next-auth/react";
import {useEffect} from "react";
import {getMe, useAuthenticatedApi} from "@/api/api";
import {User} from "@/api/models";
import {useRouter} from "next/router";

export default function Home() {
    const {data: session} = useSession();

    const [userData, setUserData] = useAuthenticatedApi<User>();

    const router = useRouter();

    useEffect(() => {
        if(session) {
            //@ts-ignore
            getMe(session, setUserData);
        }
    }, [session]);

    useEffect(() => {
        if (userData && userData.data) {
            if (userData.data.student && !userData.data.student.is_super_student) {
                router.push('/my-schedule')
            } else if (userData.data.syndicus) {
                router.push('/my-buildings')
            } else {
                router.push('/live_routes')
            }

            // mobileNavbarComponent = <MobileNavbarComponent loading={loading} nextPath={nextPath} setNextPath={setNextPath}
            //                                                    router={router} children={props.children} topButtons={topButtonsForUser}/>
            // desktopNavbarComponent = <DesktopNavbarComponent loading={loading} nextPath={nextPath} setNextPath={setNextPath}
            //                                                      router={router} children={props.children} topButtons={topButtonsForUser}/>
        }
    }, [userData]);
    return (<div></div>)
}
