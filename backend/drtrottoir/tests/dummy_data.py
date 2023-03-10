import datetime

from drtrottoir.models import (
    Admin,
    Building,
    GarbageCollectionSchedule,
    GarbageCollectionScheduleTemplate,
    GarbageCollectionScheduleTemplateEntry,
    GarbageType,
    Issue,
    IssueImage,
    LocationGroup,
    ScheduleAssignment,
    ScheduleDefinition,
    ScheduleDefinitionBuilding,
    ScheduleWorkEntry,
    Student,
    Syndicus,
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


def insert_dummy_building(address: str = "dummy address", lg=None) -> Building:
    if lg is None:
        lg = insert_dummy_location_group()

    building = Building(
        address=address,
        location_group=lg,
    )
    building.save()

    return building


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


def insert_dummy_issue_image(dummy_user: User) -> IssueImage:
    issue = insert_dummy_issue(dummy_user)

    issue_image = IssueImage(issue=issue, image="test_path.jpg")
    issue_image.save()

    return issue_image


def insert_dummy_user(email: str = "test@gmail.com") -> User:
    dummy_user: User = User.objects.create_user(
        username=email, password="test", email=email
    )
    return dummy_user


def insert_dummy_admin(email="tes@gmail.com") -> Admin:
    user = insert_dummy_user(email)
    admin = Admin(user=user)
    admin.save()
    return admin


def insert_dummy_student(email="tes@gmail.com", is_super_student=False) -> Student:
    user = insert_dummy_user(email)
    lg = insert_dummy_location_group()
    student = Student(user=user, location_group=lg, is_super_student=is_super_student)
    student.save()

    return student


# The ScheduleDefinition API is being written by Lander, but I  need
# it for the ScheduleAssignment API. Replace this when finished.
# - Pim
def insert_dummy_schedule_definition(
    buildings=None, name="dummy schedule definition name", lg=None, version=1
) -> ScheduleDefinition:
    if lg is None:
        lg = insert_dummy_location_group()
    definition = ScheduleDefinition(
        name=name,
        version=version,
        location_group=lg,
    )
    definition.save()

    # Populate with some buildings
    if buildings is None:
        building1 = insert_dummy_building()
        building2 = insert_dummy_building()
        ScheduleDefinitionBuilding(
            schedule_definition=definition, building=building1, position=1
        ).save()
        ScheduleDefinitionBuilding(
            schedule_definition=definition, building=building2, position=2
        ).save()

    else:
        for b in buildings:
            ScheduleDefinitionBuilding(
                schedule_definition=definition, building=b, position=1
            ).save()

    return definition


def insert_dummy_schedule_assignment(user: User) -> ScheduleAssignment:
    schedule_definition: ScheduleDefinition = insert_dummy_schedule_definition()
    assignment = ScheduleAssignment(
        assigned_date="2022-01-26", schedule_definition=schedule_definition, user=user
    )
    assignment.save()
    return assignment


def insert_dummy_schedule_work_entry(creator: User) -> ScheduleWorkEntry:
    building = insert_dummy_building()
    schedule_definition = insert_dummy_schedule_definition()
    work_entry = ScheduleWorkEntry(
        creation_timestamp="2022-01-26 06:00",
        image="image.png",
        creator=creator,
        building=building,
        schedule_definition=schedule_definition,
    )
    work_entry.save()
    return work_entry
