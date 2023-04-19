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
            for version in range(1):
                sched = ScheduleDefinition(
                    name=f"schedule definition {i}", version=version, location_group=lg
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
                assigned_date=f"2023-04-{i}",
                schedule_definition=schedule_definition,
                user=random.choice(students).user,
            )
            for i in range(10, 25, 2)
            for schedule_definition in schedule_definitions[0:3]
        ]

        for s in schedule_assignments:
            s.save()

        self.stdout.write("Adding schedule work entries...")

        for schedule_assignment in schedule_assignments:
            schedule_definition_of_0 = schedule_assignment.schedule_definition
            date = schedule_assignment.assigned_date

            buildings_in_schedule_definition_of_0 = (
                schedule_definition_of_0.buildings.all()
            )

            work_entries = []

            for index in range(len(buildings_in_schedule_definition_of_0) - 2):
                building = buildings_in_schedule_definition_of_0[index]
                work_entries.append(
                    ScheduleWorkEntry(
                        creation_timestamp=f"{date} 12:{index}0:00",
                        image="/some/path",
                        creator=schedule_assignment.user,
                        building=building,
                        schedule_assignment=schedule_assignment,
                        entry_type="AR",
                    )
                )
                work_entries.append(
                    ScheduleWorkEntry(
                        creation_timestamp=f"{date} 12:{index}1:00",
                        image="/some/path",
                        creator=schedule_assignment.user,
                        building=building,
                        schedule_assignment=schedule_assignment,
                        entry_type="AR",
                    )
                )
                work_entries.append(
                    ScheduleWorkEntry(
                        creation_timestamp=f"{date} 12:{index}2:00",
                        image="/some/path",
                        creator=schedule_assignment.user,
                        building=building,
                        schedule_assignment=schedule_assignment,
                        entry_type="WO",
                    )
                )
                work_entries.append(
                    ScheduleWorkEntry(
                        creation_timestamp=f"{date} 12:{index}3:00",
                        image="/some/path",
                        creator=schedule_assignment.user,
                        building=building,
                        schedule_assignment=schedule_assignment,
                        entry_type="WO",
                    )
                )
                work_entries.append(
                    ScheduleWorkEntry(
                        creation_timestamp=f"{date} 12:{index}4:00",
                        image="/some/path",
                        creator=schedule_assignment.user,
                        building=building,
                        schedule_assignment=schedule_assignment,
                        entry_type="WO",
                    )
                )
                work_entries.append(
                    ScheduleWorkEntry(
                        creation_timestamp=f"{date} 12:{index}5:00",
                        image="/some/path",
                        creator=schedule_assignment.user,
                        building=building,
                        schedule_assignment=schedule_assignment,
                        entry_type="DE",
                    )
                )

            work_entries.append(
                ScheduleWorkEntry(
                    creation_timestamp=f"{date} 13:00:00",
                    image="/some/path",
                    creator=schedule_assignment.user,
                    building=buildings_in_schedule_definition_of_0[
                        len(buildings_in_schedule_definition_of_0) - 2
                    ],
                    schedule_assignment=schedule_assignment,
                    entry_type="AR",
                )
            )
            work_entries.append(
                ScheduleWorkEntry(
                    creation_timestamp=f"{date} 13:07:00",
                    image="/some/path",
                    creator=schedule_assignment.user,
                    building=buildings_in_schedule_definition_of_0[
                        len(buildings_in_schedule_definition_of_0) - 2
                    ],
                    schedule_assignment=schedule_assignment,
                    entry_type="WO",
                )
            )

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
