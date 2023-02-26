from django.contrib.auth.models import AbstractUser
from django.db import models


class LocationGroup(models.Model):
    name = models.CharField(max_length=255)


class Building(models.Model):
    address = models.CharField(max_length=255)
    guide_pdf_path = models.CharField(max_length=255)
    location_group = models.ForeignKey(LocationGroup, on_delete=models.RESTRICT)
    is_active = models.BooleanField(default=True)


class ScheduleDefinition(models.Model):
    name = models.CharField(max_length=255)
    version = models.IntegerField()
    location_group = models.ForeignKey(LocationGroup, on_delete=models.RESTRICT)
    buildings = models.ManyToManyField(Building, through="ScheduleDefinitionBuilding")


class ScheduleDefinitionBuilding(models.Model):
    building = models.ForeignKey(Building, on_delete=models.CASCADE)
    schedule_definition = models.ForeignKey(
        ScheduleDefinition, on_delete=models.CASCADE
    )
    position = models.IntegerField()


class User(AbstractUser):
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    email = models.EmailField(max_length=255, unique=True)

    USERNAME_FIELD = "email"

    # email is explicitely *not* allowed to be in REQUIRED_FIELDS
    REQUIRED_FIELDS = ["first_name", "last_name"]


class Admin(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)


class Student(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    location_group = models.ForeignKey(LocationGroup, on_delete=models.RESTRICT)
    is_super_student = models.BooleanField(default=False)


class Syndicus(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    buildings = models.ManyToManyField(Building)


class Issue(models.Model):
    building = models.ForeignKey(Building, on_delete=models.RESTRICT)
    resolved = models.BooleanField(default=False)
    message = models.TextField()
    from_user = models.ForeignKey(
        User, on_delete=models.RESTRICT, related_name="issues_created"
    )
    approval_user = models.ForeignKey(
        User, on_delete=models.RESTRICT, related_name="issues_to_approve"
    )


class IssueImage(models.Model):
    image_path = models.CharField(max_length=255)
    issue = models.ForeignKey(Issue, on_delete=models.RESTRICT)


class ScheduleAssignment(models.Model):
    assigned_date = models.DateField()
    schedule_definition = models.ForeignKey(
        ScheduleDefinition, on_delete=models.RESTRICT
    )
    user = models.ForeignKey(User, on_delete=models.RESTRICT)


class ScheduleWorkEntry(models.Model):
    creation_timestamp = models.DateTimeField()
    image_path = models.CharField(max_length=255)
    creator = models.ForeignKey(User, on_delete=models.RESTRICT)
    building = models.ForeignKey(Building, on_delete=models.RESTRICT)
    schedule_definition = models.ForeignKey(
        ScheduleDefinition, on_delete=models.RESTRICT
    )


class GarbageCollectionScheduleTemplate(models.Model):
    name = models.CharField(max_length=255)
    building = models.ForeignKey(Building, on_delete=models.RESTRICT)


class GarbageType(models.Model):
    name = models.CharField(max_length=255)


class GarbageCollectionScheduleTemplateEntry(models.Model):
    day = models.SmallIntegerField()
    garbage_type = models.ForeignKey(GarbageType, on_delete=models.RESTRICT)
    garbage_collection_schedule_template = models.ForeignKey(
        GarbageCollectionScheduleTemplate, on_delete=models.CASCADE
    )


class GarbageCollectionSchedule(models.Model):
    for_day = models.DateField()
    building = models.ForeignKey(Building, on_delete=models.RESTRICT)
    garbage_type = models.ForeignKey(GarbageType, on_delete=models.RESTRICT)
