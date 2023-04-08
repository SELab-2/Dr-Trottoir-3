import * as React from 'react';
import {useEffect, useState} from 'react';
import styles from './buildingdetail.module.css';
import {Box, Link, List, Typography} from '@mui/material';
import {Building, GarbageCollectionSchedule, GarbageType, LocationGroup} from '@/api/models';
import {PictureAsPdf} from '@mui/icons-material';
import useSWR, {SWRResponse} from "swr";
import {useSession} from "next-auth/react";
import {IScheduleGarbageListItem, ScheduleGarbageListItem} from "@/components/elements/buildingdetailElement/scheduleGarbageListItem";
import { PaginatedResponse } from '@/api/api';
import {defaultBuildingImage} from "@/constants/images";

interface IBuildingDetail {
  id: number,
  location_group: string,
  name: string,
  address: string,
  pdf_guide: string | null,
  description: string | null
  image: string | null,
  syndicus: string,
  schedules: IScheduleGarbageListItem[]
}


// eslint-disable-next-line require-jsdoc
function createBuildingManualElement(path: string | null) {
  if (!path || path.length == 0) {
    return (<></>);
  }
  return (
    <Link href={path} className={styles.building_data_manual}>Manual<PictureAsPdf fontSize="small"></PictureAsPdf></Link>
  );
}

const sessionToken = () => {
  const {data: session} = useSession();
  // @ts-ignore
  return session ? session.accessToken : '';
}

const headers = (token: string) => {
  return {headers: {'Authorization': `Bearer  ${token}`}} as RequestInit
}

async function fetchDetail<T>(url: string, token: string) {
  const apiUrl =  `${process.env.NEXT_API_URL}${url}`
  return (await fetch(apiUrl, headers(token)).then(response => response.json())) as T
}

async function fetchSyndicus(buildingId: number, token: string) {
  return "SYNDICUS TODO"
}

async function fetchLocationGroup(id: number, token: string) {
  return await fetchDetail<LocationGroup>(`/location_groups/${id}/`, token)
}

async function fetchBuilding(id: number, token: string) {
  return await fetchDetail<Building>(`/buildings/${id}/`, token)
}

async function fetchGarbageType(id: number, token: string) {
  return await fetchDetail<GarbageType>(`/garbage_types/${id}/`, token)
}

async function fetchSchedules(id: number, token: string) {
  const schedulesUrl = `${process.env.NEXT_API_URL}/buildings/${id}/garbage_collection_schedules/`
  const schedules = (await fetch(schedulesUrl,headers(token)).then(response => response.json())) as PaginatedResponse<GarbageCollectionSchedule>

  let results: IScheduleGarbageListItem[] = []
  for (let schedule of schedules.results) {
    const garbage = await fetchGarbageType(schedule.garbage_type, token)

    const result: IScheduleGarbageListItem = {
      id: schedule.id,
      type: garbage.name,
      date: schedule.for_day,
      issue: ""
    }
    results.push(result)
  }
  return results
}

async function buildingFetch(args: any[]) {
  const [buildingId, token] = args;

  const buildingData = await fetchBuilding(buildingId, token)
  const locationGroup = await fetchLocationGroup(buildingData.location_group, token)
  const syndicus = await fetchSyndicus(buildingId, token)
  const schedules = await fetchSchedules(buildingId, token)

  const buildingDetail: IBuildingDetail = {
    id: buildingData.id,
    location_group: locationGroup.name,
    name: 'BUILDING NAME TODO',
    address: buildingData.address,
    pdf_guide: buildingData.pdf_guide,
    description: buildingData.description,
    image: buildingData.description,
    syndicus: syndicus,
    schedules: schedules
  }
  return buildingDetail
}


function useBuildingData(id: number) {
  const token = sessionToken()
  return useSWR<IBuildingDetail>([id, token], buildingFetch)
}


// eslint-disable-next-line require-jsdoc
export default function BuildingDetail(props: { id: number }) {
  // eslint-disable-next-line no-unused-vars
  const {id} = props;

  const [building, setBuilding] = useState<IBuildingDetail | null | undefined>(null);

  const buildingData = useBuildingData(id);
  useEffect(() => {
    setBuilding(buildingData.data);
  }, [id, buildingData]);


  if (!building) return <p>Loading...</p>;


  return (

    <Box className={styles.full}>
      {/* Top row */}
      <Box className={styles.top_row_container}
           sx={{background: 'var(--secondary-light)'}}>
        {/* Building data container */}
        <Box className={styles.building_data_container}>
          <Typography variant="h1" className={styles.building_data_header}>
            {building.name}
          </Typography>
          <Box className={styles.building_data_container_data}>
            <Typography className={styles.building_data_data}>
              {building.location_group}
            </Typography>
            <Typography className={styles.building_data_data}>
              {building.address}
            </Typography>
            <Typography className={styles.building_data_data}>
              {building.syndicus}
            </Typography>
          </Box>
          {createBuildingManualElement(building.pdf_guide)}
        </Box>

        {/* Building description container */}
        <Box className={styles.building_desc_container}>
          <Typography>{building.description}</Typography>
        </Box>

        {/* Building image container */}
        <Box className={styles.building_imag_container}>
          <img src={
            building.image ?
            building.image :
            defaultBuildingImage
          }
               alt={'Building'}/>
        </Box>
      </Box>

      {/* Middle row for spacing */}
      <Box className={styles.middle_row_divider}></Box>

      {/* Bottom row */}
      <Box className={styles.bottom_row_container}>
        {/* Garbage schedule list */}
        <Box className={styles.garbage_schedule_list}>
          <Typography
            variant="h1"
            className={styles.garbage_schedule_list_header}>
            Planning
          </Typography>
          <List>
            {building.schedules.map((schedule) =>
              ScheduleGarbageListItem({
                id: schedule.id, date: schedule.date,
                type: schedule.type, issue: schedule.issue,
              })
            )}
          </List>
        </Box>

        {/* Garbage schedule calendar */}
        <Box style={{background: 'limegreen', width: '100%'}}>
          Calendar here
        </Box>
      </Box>
    </Box>
  );
}
