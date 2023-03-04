from drtrottoir.models import (
    Building,
    GarbageCollectionScheduleTemplate,
    GarbageCollectionScheduleTemplateEntry,
    GarbageType,
    Issue,
    LocationGroup,
    User,
)


def insert_dummy_garbage_type() -> GarbageType:
    gt = GarbageType(name="dummy garbage type")
    gt.save()

    return gt


def insert_dummy_location_group(name: str = "dummy location group") -> LocationGroup:
    lg = LocationGroup(name=name)
    lg.save()

    return lg


def insert_dummy_building(adress: str = "dummy adress", path: str = "dummy path") -> Building:
    lg = insert_dummy_location_group()

    building = Building(
        address=adress,
        guide_pdf_path=path,
        location_group=lg,
    )
    building.save()

    return building


def insert_dummy_garbage_collection_schedule_template() -> (
    GarbageCollectionScheduleTemplate
):
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


def insert_dummy_issue(dummy_user: User) -> Issue:
    building = insert_dummy_building()

    issue = Issue(building=building, message="dummy message", from_user=dummy_user)

    issue.save()

    return issue
