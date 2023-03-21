"""
Django command to populate the database with some predefined mock data.
"""
import random

from django.core.management.base import BaseCommand

from drtrottoir.models import (
    Admin,
    Building,
    GarbageCollectionSchedule,
    GarbageCollectionScheduleTemplate,
    GarbageCollectionScheduleTemplateEntry,
    GarbageType,
    Issue,
    LocationGroup,
    ScheduleAssignment,
    ScheduleDefinition,
    ScheduleDefinitionBuilding,
    ScheduleWorkEntry,
    Student,
    Syndicus,
    User,
)


class Command(BaseCommand):
    def add_arguments(self, parser):
        parser.add_argument("admin_pass", type=str, action="store")

    def handle(self, *args, **options):
        # Predictable data
        random.seed(0)

        self.stdout.write("Adding location groups...")

        lgs = [
            LocationGroup(name="Gent"),
            LocationGroup(name="Antwerpen"),
            LocationGroup(name="Leuven"),
        ]

        for lg in lgs:
            lg.save()

        self.stdout.write("Adding buildings...")

        buildings = [
            Building(
                address=f"address {i}",
                location_group=lgs[i % len(lgs)],
            )
            for i in range(50)
        ]

        for b in buildings:
            b.save()

        self.stdout.write("Adding authenticated users...")

        u = User(
            username="admin@drtrottoir.be", first_name="Admin", last_name="DrTrottoir"
        )
        u.set_password(options["admin_pass"])
        u.save()
        admin = Admin(user=u)
        admin.save()

        students = []

        u = User(
            username="superstudent@drtrottoir.be",
            first_name="SuperStudent",
            last_name="DrTrottoir",
        )
        u.set_password(options["admin_pass"])
        u.save()
        student = Student(user=u, is_super_student=True, location_group=lgs[0])
        student.save()
        students.append(student)

        u = User(
            username="student@drtrottoir.be",
            first_name="Student",
            last_name="DrTrottoir",
        )
        u.set_password(options["admin_pass"])
        u.save()
        student = Student(user=u, is_super_student=False, location_group=lgs[0])
        student.save()
        students.append(student)

        u = User(
            username="syndicus@drtrottoir.be",
            first_name="Syndicus",
            last_name="DrTrottoir",
        )
        u.set_password(options["admin_pass"])
        u.save()
        syndicus = Syndicus(user=u)
        syndicus.save()
        syndicus.buildings.set(buildings)

        self.stdout.write("Adding students...")

        for i in range(10):
            u = User(
                username=f"student{i}@drtrottoir.be",
                first_name=f"Student{i}",
                last_name="DrTrottoir",
            )
            u.save()

            student = Student(
                user=u, is_super_student=False, location_group=lgs[i % len(lgs)]
            )
            student.save()

            students.append(student)

        self.stdout.write("Adding syndici...")

        for i in range(10):
            u = User(
                username=f"syndicus{i}@drtrottoir.be",
                first_name=f"Syndicus{i}",
                last_name="DrTrottoir",
            )
            u.save()

            syndicus = Syndicus(user=u)
            syndicus.save()
            syndicus.buildings.set(random.choices(buildings, k=5))

        self.stdout.write("Adding schedule definitions...")

        schedule_definitions = []

        for i in range(10):
            lg = lgs[i % len(lgs)]
            sched = ScheduleDefinition(
                name=f"schedule definition {i}", version=1, location_group=lg
            )
            sched.save()
            sched_buildings = [
                ScheduleDefinitionBuilding(
                    building=b, schedule_definition=sched, position=j
                )
                for j, b in enumerate(random.choices(buildings, k=5))
            ]

            for sched_building in sched_buildings:
                sched_building.save()

            schedule_definitions.append(sched)

        self.stdout.write("Adding issues...")

        issues = [
            Issue(
                building=random.choice(buildings),
                message="a message",
                from_user=random.choice(students).user,
            )
            for _ in range(25)
        ]

        for issue in issues:
            issue.save()

        self.stdout.write("Adding schedule assignments...")

        schedule_assignments = [
            ScheduleAssignment(
                assigned_date="2023-03-16",
                schedule_definition=random.choice(schedule_definitions),
                user=random.choice(students).user,
            )
            for _ in range(25)
        ]

        for s in schedule_assignments:
            s.save()

        self.stdout.write("Adding schedule work entries...")

        work_entries = [
            ScheduleWorkEntry(
                creation_timestamp="2023-03-16 12:00:00",
                image="/some/path",
                creator=random.choice(students).user,
                building=random.choice(buildings),
                schedule_assignment=random.choice(schedule_assignments),
            )
        ]

        for x in work_entries:
            x.save()

        self.stdout.write("Adding garbage types...")
        types = [
            "Rest",
            "GFT",
            "Glas",
            "PMD",
            "Klein Gevaarlijk Afval",
            "Nucleair Afval",
        ]
        garbage_types = [GarbageType(name=t) for t in types]

        for x in garbage_types:
            x.save()

        self.stdout.write("Adding garbage collection schedule templates...")

        gcs_templates = [
            GarbageCollectionScheduleTemplate(name=f"template {i}", building=b)
            for b in buildings
        ]

        for template in gcs_templates:
            template.save()

            entries = [
                GarbageCollectionScheduleTemplateEntry(
                    day=random.randint(1, 7),
                    garbage_type=random.choice(garbage_types),
                    garbage_collection_schedule_template=template,
                )
                for _ in range(20)
            ]

            for e in entries:
                e.save()

        self.stdout.write("Adding garbage collection schedules...")

        for _ in range(25):
            gcs = GarbageCollectionSchedule(
                for_day="2023-02-17",
                building=random.choice(buildings),
                garbage_type=random.choice(garbage_types),
            )
            gcs.save()

        self.stdout.write("Done!")
        self.stdout.write(
            "You can use the provided password to log into student@drtrottoir.be, superstudent@drtrottoir.be, syndicus@drtrottoir.be and admin@drtrottoir.be"  # noqa
        )
