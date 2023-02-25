from django.db import models


class LocationGroup(models.Model):
    location_group_name = models.CharField(max_length=255)


class Building(models.Model):
    address = models.CharField(max_length=255)
    building_guide_pdf_path = models.CharField(max_length=255)
    location_group = models.ForeignKey(LocationGroup, on_delete=models.RESTRICT)


class ScheduleDefinition(models.Model):
    name = models.CharField(max_length=255)
    version = models.IntegerField()
    location_group = models.ForeignKey(LocationGroup, on_delete=models.RESTRICT)
    buildings = models.ManyToManyField(Building)


class Role(models.Model):
    name = models.CharField(max_length=255)


class User(models.Model):
    location_group = models.ForeignKey(LocationGroup, on_delete=models.RESTRICT)
    role = models.ForeignKey(Role, on_delete=models.RESTRICT)


class Issue(models.Model):
    message = models.TextField()
    from_user = models.ForeignKey(
        User, on_delete=models.RESTRICT, related_name="issues_created"
    )
    approval_user = models.ForeignKey(
        User, on_delete=models.RESTRICT, related_name="issues_to_approve"
    )


class IssueImage(models.Model):
    image_path = models.CharField(max_length=255)
    issue = models.ForeignKey(Issue, on_delete=models.CASCADE)


class ScheduleAssignment(models.Model):
    assigned_date = models.DateField()
    schedule_definition = models.ForeignKey(
        ScheduleDefinition, on_delete=models.RESTRICT
    )
    user = models.ForeignKey(User, on_delete=models.RESTRICT)


class ScheduleWorkEntry(models.Model):
    creation_timestamp = models.DateTimeField()
    image_path = models.CharField(max_length=255)
    creator = models.ForeignKey(User, on_delete=models.CASCADE)
    building = models.ForeignKey(Building, on_delete=models.CASCADE)
    schedule_definition = models.ForeignKey(
        ScheduleDefinition, on_delete=models.CASCADE
    )


class GarbageCollectionScheduleTemplate(models.Model):
    name = models.CharField(max_length=255)
    building = models.ForeignKey(Building, on_delete=models.CASCADE)


class GarbageType(models.Model):
    name = models.CharField(max_length=255)


class GarbageCollectionScheduleTemplateEntry(models.Model):
    day = models.DateField()
    garbage_type = models.ForeignKey(GarbageType, on_delete=models.RESTRICT)
    garbage_collection_schedule_template = models.ForeignKey(
        GarbageCollectionScheduleTemplate, on_delete=models.CASCADE
    )


class GarbageCollectionSchedule(models.Model):
    for_day = models.DateField()
    building = models.ForeignKey(Building, on_delete=models.CASCADE)
    garbage_type = models.ForeignKey(GarbageType, on_delete=models.RESTRICT)
