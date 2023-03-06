import datetime

from drtrottoir.models import (Building, GarbageCollectionSchedule,
                               GarbageCollectionScheduleTemplate,
                               GarbageCollectionScheduleTemplateEntry,
                               GarbageType, Issue, LocationGroup,
                               ScheduleDefinition, ScheduleDefinitionBuilding,
                               Syndicus, User)


def insert_dummy_garbage_type() -> GarbageType:
    gt = GarbageType(name="dummy garbage type")
    gt.save()

    return gt


def insert_dummy_location_group(name: str = "dummy location group") -> LocationGroup:
    lg = LocationGroup(name=name)
    lg.save()

    return lg


def insert_dummy_building(
    adress: str = "dummy adress", path: str = "dummy path", lg=None
) -> Building:
    if lg is None:
        lg = insert_dummy_location_group()

    building = Building(
        address=adress,
        guide_pdf_path=path,
        location_group=lg,
    )
    building.save()

    return building


def insert_dummy_schedule_definition(
    name: str = "dummy schedule definition", verion=0, lg=None
) -> ScheduleDefinition:
    if lg is None:
        lg = insert_dummy_location_group()
    schedule_definiton = ScheduleDefinition(
        name=name,
        version=verion,
        location_group=lg,
    )

    schedule_definiton.save()
    return schedule_definiton


def insert_dummy_syndicus(
    user: User,
    buildings=None,
):
    syndicus = Syndicus(
        user=user,
    )
    syndicus.save()

    if buildings is None:
        building = insert_dummy_building()
        syndicus.buildings.add(building)
    else:
        for building in buildings:
            syndicus.buildings.add(building)

    syndicus.save()
    return syndicus


def insert_dummy_schedule_definition_building(
    building=None, sd=None, pos: int = 0
) -> ScheduleDefinitionBuilding:
    if building is None:
        building = insert_dummy_building()
    if sd is None:
        sd = insert_dummy_schedule_definition()
    schedule_definition_building = ScheduleDefinitionBuilding(
        building=building, schedule_definition=sd, position=pos
    )
    schedule_definition_building.save()
    return schedule_definition_building


def insert_dummy_garbage_collection_schedule(building=None, date=None):
    if building is None:
        building = insert_dummy_building()
    if date is None:
        date = datetime.date(2000, 1, 1)
    garbage_type = insert_dummy_garbage_type()
    schedule = GarbageCollectionSchedule(
        for_day=date,
        garbage_type=garbage_type,
        building=building,
    )
    schedule.save()
    return schedule


def insert_dummy_garbage_collection_schedule_template(
    building=None,
) -> GarbageCollectionScheduleTemplate:
    if building is None:
        building = insert_dummy_building()
    template = GarbageCollectionScheduleTemplate(
        name="dummy template", building=building
    )
    template.save()

    return template


def insert_dummy_garbage_collection_schedule_template_entry() -> (
    GarbageCollectionScheduleTemplateEntry
):
    garbage_type = insert_dummy_garbage_type()
    template = insert_dummy_garbage_collection_schedule_template()
    entry = GarbageCollectionScheduleTemplateEntry(
        day=4,
        garbage_type=garbage_type,
        garbage_collection_schedule_template=template,
    )
    entry.save()

    return entry


def insert_dummy_issue(dummy_user=None, dummy_building=None) -> Issue:
    if dummy_building is None:
        dummy_building = insert_dummy_building()

    if dummy_user is None:
        dummy_user = User.objects.create_user(
            username="test@gmail.com", password="test"
        )

    issue = Issue(
        building=dummy_building, message="dummy message", from_user=dummy_user
    )

    issue.save()

    return issue
