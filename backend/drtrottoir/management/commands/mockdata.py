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


def generate_email_from_name(first_name: str) -> str:
    return f"{first_name.lower()}@drtrottoir.be"


location_group_data = [
    "Gent",
    "Leuven",
    "Antwerpen"
]

building_data = {
    "Gent": {
        "Kouter": [
            ("Kouterhof", "Kouter 7"),
            ("B'eau Kouter", "Kouter 11"),
            ("Res. Kouter", "Universiteitsstraat 5"),
            ("Kouterdreef", "Kouterdreef 10")
        ],
        "Coupure": [
            ("Academie", "Sint-Margrietstraat 11"),
            ("Alencon", "Brugstraat 63"),
            ("Sint-Michiels", "Sint-Michielsplein 9"),
            ("Tu Casa", "Ingelandgat 29"),
            ("KotCompany Coupure", "Theresianenstraat 14")
        ],
        "Haven": [
            ("Oslo", "Londenstraat 5"),
            ("Kobenhavn", "Koperhagenstraat 2-12"),
            ("Voorhaven", "Neusplein 2"),
            ("Nieuwland Blok C", "Désiré Fiévéstraat 14"),
        ],
        "Station": [
            ("Alberts House", "Floraliënlaan 11"),
            ("Beaux-Arts", "Filips van Marnixlaan 9"),
            ("Nassau", "Willem van Nassaustraat 1-21"),
            ("Paulus", "Rijsenbergstraat 144-146"),
            ("Ter Leie 1+2", "Eedverbondkaai 213-242"),
            ("Maeterlinck", "Eedverbondkaai 185-200"),
        ],
        "Artevelde": [
            ("Artevelde", "Brabantdam 205-241"),
            ("Lamartine", "Brabantdam 147-171"),
            ("Oude Scheldestraat", "Oude Scheldestraat 10"),
            ("Frontenac", "Hubert Frère-Orbanlaan 130-143"),
        ]
    },
    "Antwerpen": {
        "Schelde": [
            ("Zuiderzin", "Kromme-Elleboogstraat 11"),
            ("Aplace", "Vrijdagmarkt 1"),
            ("Cityhome", "Leeuwenstraat 11"),
            ("Holiday Home Zalig", "Lange Riddersstraat 77"),
            ("Maison Nationale", "Nationalestraat 49"),
        ],
        "Centrum Noord": [
            ("Residentie Helmstraat", "Helmstraat 1"),
            ("De Kroon", "Turnhoutsebaan 65"),
            ("Kopergieterij", "Cronjestraat 12"),
            ("Residentie Kistemaeckersstraat", "Kistemaeckersstraat"),
        ],
        "Park": [
            ("Ter Vijvere", "Van Eycklei 29"),
            ("Residentie Van Eycklei", "Van Eycklei 28"),
            ("Primavera", "Van Eycklei 54"),
            ("Perfect Flat", "Plantin en Moretuslei 12")
        ],
        "Ter Zuid": [
            ("Van Hulsen Rachel", "Boomgaardstraat 39"),
            ("Short Rentals", "Belgiëlei 180"),
            ("The Banker", "Belgiëlei 153"),
            ("Residentie Amberes", "Gounodstraat 2"),
            ("Antwerp Rentals", "Isabellalei 50")

        ]
    },
    "Leuven": {
        "Ring Zuid": {
            ("Kot del sol", "Schapenstraat 86"),
            ("TopkotLeuven", "Groenstraat 2"),
            ("Flavus Student Residence", "Hoveniersdreef 33"),
            ("Waversbaan", "Waversbaan 6")
        },
        "Leuven Centrum": {
            ("Getaway Studios", "Vital Decosterstraat 23"),
            ("Ambassador Suites", "Sint-Maartenstraat 21"),
            ("Savoye Business Flat", "Savoyestraat 5")
        },
        "Kruidtuin": {
            ("op kot bij de directeur", "Kapucijnenvoer 47"),
            ("Goede Herder", "Minderbroedersstraat 21"),
            ("Cohousing BotaniCo", "Kapucijnenvoer 47"),
            ("Residentie COPAL", "Tervuursestraat 56"),
            ("Xior Student Housing - Regina Mundi", "Janseniusstraat 38")
        }
    }
}

admin_data = [
    ("Alex", "Adriaansens"),
    ("Aline", "Aerts"),
]

student_data = [
    # Gent
    ("Bart", "Berens", "Gent"),
    ("Brecht", "Bouwers", "Gent"),
    ("Bob", "Bowie", "Gent"),
    # Antwerpen
    ("Cecil", "Claes", "Antwerpen"),
    ("Cedric", "Claermans", "Antwerpen"),
    ("Caro", "Clauwens", "Antwerpen"),
    # Leuven
    ("Dennis", "D'Haese", "Leuven"),
    ("Daniel", "Dale", "Leuven"),
    ("Doris", "Dekeyser", "Leuven")
]

super_student_data = [
    # Gent
    ("Emil", "Evenaers", "Gent"),
    ("Evelyn", "Eckers", "Gent"),
    # Antwerpen
    ("Frederick", "Ferrier", "Antwerpen"),
    ("Flora", "Fiermans", "Antwerpen"),
    # Leuven
    ("Goedele", "Gerards", "Leuven"),
    ("Garcon", "Goedmans", "Leuven")
]

syndici_data = [
    ("Steven", "Siermans"),
    ("Sven", "Sanders"),
    ("Sophie", "Schildermans"),
    ("Saartje", "Smets"),
    ("Stijn", "Schoonoven"),
    ("Sandra", "Schoenmakers")
]

garbage = [
    "Rest",
    "GFT",
    "Glas",
    "PMD",
    "KGA",
    "Nucleair",
]


class Command(BaseCommand):
    def add_arguments(self, parser):
        parser.add_argument("admin_pass", type=str, action="store")

    def handle(self, *args, **options):
        # Predictable data
        random.seed(0)

        self.stdout.write("Adding location groups...")

        lgs = [
            LocationGroup(name=lg)
            for lg in location_group_data
        ]
        for lg in lgs:
            lg.save()

        self.stdout.write("Adding schedule definitions and buildings...")

        buildings = []
        schedule_definitions = []
        for (city, schedule_definition_data) in building_data.items():
            location_group = LocationGroup.objects.get(name=city)
            for (schedule_definition_name, schedule_definition_building_list) in schedule_definition_data.items():
                schedule_definition_buildings = []
                for (building_name, building_address) in schedule_definition_building_list:
                    building = Building(
                        address=building_address,
                        name=building_name,
                        location_group=location_group
                    )
                    building.save()
                    buildings.append(building)
                    schedule_definition_buildings.append(building)
                for version in range(1, 5):
                    schedule_definition = ScheduleDefinition(
                        name=schedule_definition_name,
                        version=version,
                        location_group=location_group
                    )
                    schedule_definition.save()
                    for (i, building) in enumerate(schedule_definition_buildings):
                        schedule_definition_building = ScheduleDefinitionBuilding(
                            building=building,
                            schedule_definition=schedule_definition,
                            position=i
                        )
                        schedule_definition_building.save()
                    schedule_definitions.append(schedule_definition)
        self.stdout.write("Adding authenticated users...")

        u = User(
            username="admin@drtrottoir.be", first_name="Admin", last_name="DrTrottoir"
        )
        u.set_password(options["admin_pass"])
        u.save()
        admin = Admin(user=u)
        admin.save()

        students = []
        superstudents = []

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

        self.stdout.write("Adding admins...")

        for (first_name, last_name) in admin_data:
            u = User(
                username=generate_email_from_name(first_name),
                first_name=first_name,
                last_name=last_name
            )
            u.save()
            admin = Admin(user=u)
            admin.save()

        self.stdout.write("Adding students...")

        for (first_name, last_name, city) in student_data:
            lg = LocationGroup.objects.get(name=city)
            u = User(
                username=generate_email_from_name(first_name),
                first_name=first_name,
                last_name=last_name
            )
            u.save()

            student = Student(
                user=u, is_super_student=False, location_group=lg
            )
            student.save()
            students.append(student)

        self.stdout.write("Adding super students...")

        for (first_name, last_name, city) in super_student_data:
            lg = LocationGroup.objects.get(name=city)
            u = User(
                username=generate_email_from_name(first_name),
                first_name=first_name,
                last_name=last_name
            )
            u.save()

            superstudent = Student(
                user=u, is_super_student=True, location_group=lg
            )
            superstudent.save()
            superstudents.append(superstudent)

        self.stdout.write("Adding syndici...")

        for (first_name, last_name) in syndici_data:
            u = User(
                username=generate_email_from_name(first_name),
                first_name=first_name,
                last_name=last_name,
            )
            u.save()

            syndicus = Syndicus(user=u)
            syndicus.save()
            syndicus.buildings.set(random.choices(buildings, k=5))

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
                assigned_date=f"2023-0{month}-{day}",
                schedule_definition=schedule_definition,
                user=random.choice(students).user,
            )
            for day in range(1, 30, 3)
            for month in [4, 5, 6]
            for schedule_definition in schedule_definitions[0:3]
        ]

        for s in schedule_assignments:
            s.save()

        self.stdout.write("Adding garbage types...")

        garbage_types = [GarbageType(name=t) for t in garbage]

        for x in garbage_types:
            x.save()

        self.stdout.write(
            "Adding garbage collection schedules and schedule work entries..."
        )

        for schedule_assignment in schedule_assignments:
            schedule_definition_of_0 = schedule_assignment.schedule_definition
            date = schedule_assignment.assigned_date

            buildings_in_schedule_definition_of_0 = (
                schedule_definition_of_0.buildings.all()
            )

            # Add garbage schedules
            for building in buildings_in_schedule_definition_of_0:
                garbage_collection_schedule_1 = GarbageCollectionSchedule(
                    for_day=date, building=building, garbage_type=garbage_types[0]
                )
                garbage_collection_schedule_2 = GarbageCollectionSchedule(
                    for_day=date, building=building, garbage_type=garbage_types[1]
                )
                garbage_collection_schedule_1.save()
                garbage_collection_schedule_2.save()

            # Add work entries
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

        self.stdout.write("Done!")
        self.stdout.write(
            "You can use the provided password to log into student@drtrottoir.be, superstudent@drtrottoir.be, " +
            "syndicus@drtrottoir.be and admin@drtrottoir.be"
            # noqa
        )
