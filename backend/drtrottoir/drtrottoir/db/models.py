from django.db import models


class LocationGroup(models.Model):
    location_group_name = models.CharField()


class Building(models.Model):
    address = models.CharField()
    building_guide_pdf_path = models.CharField()
    location_group = models.ForeignKey(LocationGroup, on_delete=models.RESTRICT)


class ScheduleDefinition(models.Model):
    name = models.CharField()
    version = models.IntegerField()
    location_group = models.ForeignKey(LocationGroup, on_delete=models.RESTRICT)


class Role(models.Model):
    name = models.CharField(max_length=255)


class User(models.Model):
    location_group = models.ForeignKey(LocationGroup, on_delete=models.RESTRICT)
    role = models.ForeignKey(Role, on_delete=models.RESTRICT)


class Issue(models.Model):
    message = models.CharField()
    from_user = models.ForeignKey(User, on_delete=models.RESTRICT)
    approval_user = models.ForeignKey(User, on_delete=models.RESTRICT)


class IssueImage(models.Model):
    image_path = models.CharField()
    issue = models.ForeignKey(Issue, on_delete=models.CASCADE)


class ScheduleAssignment(models.Model):
    assigned_date = models.DateField()
    schedule_definition = models.ForeignKey(
        ScheduleDefinition, on_delete=models.RESTRICT
    )
    user = models.ForeignKey(User, on_delete=models.RESTRICT)


class ScheduleWorkEntry(models.Model):
    creation_timestamp = models.DateTimeField()
    image_path = models.CharField()
    creator = models.ForeignKey(User, on_delete=models.CASCADE)
    building = models.ForeignKey(Building, on_delete=models.CASCADE)
    schedule_definition = models.ForeignKey(
        ScheduleDefinition, on_delete=models.CASCADE
    )
