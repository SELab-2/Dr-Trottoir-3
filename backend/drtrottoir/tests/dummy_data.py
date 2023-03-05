from drtrottoir.models import (
    Building,
    GarbageCollectionScheduleTemplate,
    GarbageCollectionScheduleTemplateEntry,
    GarbageType,
    Issue,
    LocationGroup,
    ScheduleAssignment,
    ScheduleDefinition,
    ScheduleDefinitionBuilding,
    User, ScheduleWorkEntry,
)


def insert_dummy_garbage_type() -> GarbageType:
    gt = GarbageType(name="dummy garbage type")
    gt.save()

    return gt


def insert_dummy_location_group() -> LocationGroup:
    lg = LocationGroup(name="some dummy group")
    lg.save()

    return lg


def insert_dummy_building() -> Building:
    lg = insert_dummy_location_group()

    building = Building(
        address="address",
        guide_pdf_path="path",
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


def insert_dummy_user() -> User:
    # Static variable, allows us to easily keep creating users when we need more than one
    insert_dummy_user.counter += 1

    email = f"test{insert_dummy_user.counter}@gmail.com"
    dummy_user: User = User.objects.create_user(
        username=email, password="test", email=email
    )
    return dummy_user


insert_dummy_user.counter = 0


# The ScheduleDefinition API is being written by Lander, but I need it for the ScheduleAssignment API
# Replace this when finished
# - Pim
def insert_dummy_schedule_definition() -> ScheduleDefinition:
    location_group = insert_dummy_location_group()
    definition = ScheduleDefinition(
        name="dummy schedule definition name",
        version=1,
        location_group=location_group,
    )
    definition.save()

    # Populate with some buildings
    building1 = insert_dummy_building()
    building2 = insert_dummy_building()
    ScheduleDefinitionBuilding(
        schedule_definition=definition, building=building1, position=1
    ).save()
    ScheduleDefinitionBuilding(
        schedule_definition=definition, building=building2, position=2
    ).save()

    return definition


def insert_dummy_schedule_assignment() -> ScheduleAssignment:
    user: User = insert_dummy_user()
    schedule_definition: ScheduleDefinition = insert_dummy_schedule_definition()
    assignment = ScheduleAssignment(
        assigned_date="2022-01-26", schedule_definition=schedule_definition, user=user
    )
    assignment.save()
    return assignment


def insert_dummy_schedule_work_entry() -> ScheduleWorkEntry:
    creator = insert_dummy_user()
    building = insert_dummy_building()
    schedule_definition = insert_dummy_schedule_definition()
    work_entry = ScheduleWorkEntry(
        creation_timestamp="2022-01-26 06:00",
        image_path="pics/image.png",
        creator=creator,
        building=building,
        schedule_definition=schedule_definition
    )
    work_entry.save()
    return work_entry
