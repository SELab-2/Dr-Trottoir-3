import os
import uuid

from django.contrib.auth.models import AbstractUser
from django.db import models


class LocationGroup(models.Model):
    """
    Represents the general location, this is used for multiple objects like users,
    buildings, … so that the displayed options for the user in the frontend can be
    restricted.

    Attributes:
        name (str): Name of the location group.
    """

    name = models.CharField(max_length=255)


def get_file_path_building_pdf_guide(instance, filename):
    extension = filename.split(".")[-1]
    filename = str(uuid.uuid4()) + "." + extension
    return os.path.join("building_pdf_guides/", filename)


def get_file_path_building_image(instance, filename):
    extension = filename.split(".")[-1]
    filename = str(uuid.uuid4()) + "." + extension
    return os.path.join("building_images/", filename)


class Building(models.Model):
    """
    Represents a building.

    Attributes:
        address (str): Address of the building.
        pdf_guide (file): Path of a resource on the server.
        location_group (LocationGroup): The location group that the building is in.
        is_active (bool): Whether a building is active. Defaults to True
    """

    name = models.CharField(max_length=255, default="")
    address = models.CharField(max_length=255)
    pdf_guide = models.FileField(upload_to=get_file_path_building_pdf_guide, null=True)
    location_group = models.ForeignKey(
        LocationGroup, on_delete=models.RESTRICT, related_name="buildings"
    )
    is_active = models.BooleanField(default=True)
    description = models.TextField(null=True)
    image = models.ImageField(upload_to=get_file_path_building_image, null=True)
    secret_link = models.UUIDField(null=True, unique=True)
    longitude = models.DecimalField(max_digits=22, decimal_places=16, null=True)
    latitude = models.DecimalField(max_digits=22, decimal_places=16, null=True)


class ScheduleDefinition(models.Model):
    """
    Represents a schedule definition. A student's route follows one of these
    schedule definitions.

    A student's actual work is tracked using work entries. A schedule
    definition allows the database to know what route the student was
    *supposed* to do. This way, we can know when a building was skipped for
    whatever reason.

    Attributes:
        name (str): name of the schedule definition (e.g. Kouter)
        version (int): which version of the schedule definition this is
        location_group (LocationGroup): location group this schedule belongs to.
        buildings ([ScheduleDefinitionBuilding]): list of buildings that make
            up this schedule, represented using a separate many-to-many model
    """

    name = models.CharField(max_length=255)
    version = models.IntegerField()
    location_group = models.ForeignKey(
        LocationGroup, on_delete=models.RESTRICT, related_name="schedule_definitions"
    )
    buildings = models.ManyToManyField(Building, through="ScheduleDefinitionBuilding")


class ScheduleDefinitionBuilding(models.Model):
    """
    Intermediate table used to link buildings and schedule definitions.

    Attributes:
        building (Building): building to link
        schedule_definition (ScheduleDefinition): schedule definition to link
        position (int): order in which the building appears in the schedule definition
    """

    building = models.ForeignKey(Building, on_delete=models.CASCADE)
    schedule_definition = models.ForeignKey(
        ScheduleDefinition, on_delete=models.CASCADE
    )
    position = models.IntegerField()

    # class Meta:
    #     constraints = [models.UniqueConstraint(fields=['building',
    #     'position'], name='unique_building_position')]


class User(AbstractUser):
    """
    Representing any user (student, syndicus or admin). Email is stored in the
    username field.

    Attributes:
        first_name (str): this user's first name
        last_name (str): this user's last name
    """

    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    invite_link = models.UUIDField(null=True, unique=True)
    reset_password_link = models.UUIDField(null=True, unique=True)

    # email is explicitly *not* allowed to be in REQUIRED_FIELDS
    REQUIRED_FIELDS = ["first_name", "last_name"]


class Admin(models.Model):
    """
    An Admin user

    Attributes:
        user (User): the user model of this admin
    """

    user = models.OneToOneField(User, on_delete=models.CASCADE)


class Student(models.Model):
    """
    A Student user

    Attributes:
        user (User): the user model of this student
        location_group (LocationGroup): In what location this student works
        is_super_student (bool): Whether this user is a super_student
    """

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    location_group = models.ForeignKey(
        LocationGroup, on_delete=models.RESTRICT, related_name="students"
    )
    is_super_student = models.BooleanField(default=False)


class Syndicus(models.Model):
    """
    A Syndicus user

    Attributes:
        user (User): the user model of this syndicus
        buildings (Building): a list of buildings this syndicus oversees
    """

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    buildings = models.ManyToManyField(Building, related_name="syndici")


class Issue(models.Model):
    """
    Represents an issue made by a Student or SuperStudent while working their assigned route.

    Attributes:
        building (Building): building for which the issue was made.
        resolved (bool): a boolean stating if the issue was resolved by the syndicus.
        message (str): the message from the student to the syndicus describing the issue.
        from_user (User): the user that created the issue.
        approval_user (User): the user that approved the issue and sent the issue to the syndicus.
    """  # noqa

    building = models.ForeignKey(
        Building, on_delete=models.RESTRICT, related_name="issues"
    )
    resolved = models.BooleanField(default=False)
    message = models.TextField()
    from_user = models.ForeignKey(
        User, on_delete=models.RESTRICT, related_name="issues_created"
    )
    approval_user = models.ForeignKey(
        User, on_delete=models.RESTRICT, related_name="issues_to_approve", null=True
    )


def get_file_path_issue_image(instance, filename):
    extension = filename.split(".")[-1]
    filename = str(uuid.uuid4()) + "." + extension
    return os.path.join("issue_images/", filename)


class IssueImage(models.Model):
    """
    Contains images that are linked to an Issue.

    Attributes:
        image (Image): an image showing for what the issue was made.
        issue (Issue): the corresponding issue for this image.
    """

    image = models.ImageField(upload_to=get_file_path_issue_image)
    issue = models.ForeignKey(Issue, on_delete=models.RESTRICT, related_name="images")


class ScheduleAssignment(models.Model):
    """
    Represents a schedule assigned to a (super)student they must complete on
     a specific day.

    Attributes:
        user (Student): The user id of the student who must do the schedule.
        schedule_definition (ScheduleDefinition): The id of the schedule_definition
            which outlines the route the student must follow.
        assigned_date (Date): The date on which the student must do their
            schedule.
    """

    assigned_date = models.DateField()
    schedule_definition = models.ForeignKey(
        ScheduleDefinition, on_delete=models.RESTRICT, related_name="assignments"
    )
    user = models.ForeignKey(
        User, on_delete=models.RESTRICT, related_name="assignments"
    )


def get_file_path_schedule_work_entry_image(instance, filename):
    extension = filename.split(".")[-1]
    filename = str(uuid.uuid4()) + "." + extension
    return os.path.join("schedule_work_entry_images/", filename)


class ScheduleWorkEntry(models.Model):
    """
    Represents a single piece of progress in a student's schedule. Whenever a
    student completes part of their route (arriving at the building, taking the
    trash bins out, or leaving the building), they take a picture and upload it
    to the database so the super students can track their progress. A schedule
    work entry represents one single action with picture that proves they have
    completed that part of their route.

    Attributes:
        creator (Student): The id of the student who created the schedule work entry.
        building (Building): The id of the building the student is at when making the
            schedule work entry.
        schedule_definition (ScheduleDefinition): The id of schedule definition that
            describes the route the user must follow.
        creation_timestamp (DateTime): The time and date on which the entry is
            created.
        image (Image): An image to prove the student has indeed completed that
            part of their schedule.

    """

    TYPE_CHOICES = [
        ("AR", "Arrival"),
        ("WO", "Working"),
        ("DE", "Departure"),
    ]

    creation_timestamp = models.DateTimeField()
    image = models.ImageField(upload_to=get_file_path_schedule_work_entry_image)
    creator = models.ForeignKey(
        User, on_delete=models.RESTRICT, related_name="schedule_work_entries"
    )
    building = models.ForeignKey(
        Building, on_delete=models.RESTRICT, related_name="schedule_work_entries"
    )
    schedule_assignment = models.ForeignKey(
        ScheduleAssignment, on_delete=models.RESTRICT, related_name="work_entries"
    )
    entry_type = models.CharField(max_length=2, choices=TYPE_CHOICES, default="AR")


class GarbageCollectionScheduleTemplate(models.Model):
    """
    Represents a template from which a garbage collection schedule can be
    created.

    Attributes:
        name (str): name of the template
        building (Building): What building this template is for
    """

    name = models.CharField(max_length=255)
    building = models.ForeignKey(
        Building,
        on_delete=models.RESTRICT,
        related_name="garbage_collection_schedule_templates",
    )


class GarbageType(models.Model):
    """
    Stores the name of a single garbage type.

    Attributes:
        name (str): name of the garbage type.
    """

    name = models.CharField(max_length=255)


class GarbageCollectionScheduleTemplateEntry(models.Model):
    """
    An entry for a garbage collection schedule template (e.g. on Monday, GFT
    needs to be collected)

    Attributes:
        day (int): what day of the week this entry represents (1-7)
        garbage_type (GarbageType): what garbage type this is an entry for
        garbage_collection_schedule_template (GarbageCollectionScheduleTemplate):
            what schedule this entry is a part of
    """

    day = models.SmallIntegerField()
    garbage_type = models.ForeignKey(GarbageType, on_delete=models.RESTRICT)
    garbage_collection_schedule_template = models.ForeignKey(
        GarbageCollectionScheduleTemplate,
        on_delete=models.CASCADE,
        related_name="entries",
    )


class GarbageCollectionSchedule(models.Model):
    """
    Represents a garbage collection schedule. Uses a template to get what needs to be collected on what day.

    Attributes:
        for_day (date): the date on which this garbage collection has to happen.
        building (Building): the building where this garbage collection has to happen.
        garbage_type (GarbageType): the type of garbage that is collected for this garbage collection.
    """  # noqa

    for_day = models.DateField()
    building = models.ForeignKey(
        Building, on_delete=models.RESTRICT, related_name="garbage_collection_schedules"
    )
    garbage_type = models.ForeignKey(
        GarbageType, on_delete=models.RESTRICT, related_name="collection_schedules"
    )
    note = models.TextField(null=True)
