"""
Django command to populate the database with some predefined mock data.
"""
import datetime
import os
import random
import urllib.request

from django.core.files import File
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


def local_image_path_to_django_image_data(image_path: str) -> File:
    image_url = urllib.request.urlretrieve("file://" + image_path)
    image_data = File(open(image_url[0], "rb"))
    return image_data


# Date up until (inclusive) schedule assignments have an amount of schedule work entries
MAX_DATE_WITH_SCHEDULE_WORK_ENTRIES = datetime.date(2023, 5, 22)

location_group_data = ["Gent", "Leuven", "Antwerpen"]

building_data = {
    "Gent": {
        "Kouter": [
            ("Kouterhof", "Kouter 7", (51.05002183545168, 3.72482490152841)),
            ("B'eau Kouter", "Kouter 11", (51.05616023494771, 3.7274010884909328)),
            (
                "Res. Kouter",
                "Universiteitstraat 5",
                (51.05103492743229, 3.7238064129742763),
            ),
            ("Kouterdreef", "Kouterdreef 10", (51.05185433791377, 3.7254856165766546)),
        ],
        "Coupure": [
            (
                "Academie",
                "Sint-Margrietstraat 11",
                (51.05913274788998, 3.7207073420098227),
            ),
            ("Alencon", "Brugstraat 63", (51.05631402697834, 3.716799239960074)),
            (
                "Sint-Michiels",
                "Sint-Michielsplein 9",
                (51.05360506515851, 3.7185491534526887),
            ),
            ("Tu Casa", "Ingelandgat 29", (51.053103781864266, 3.7180647978291033)),
            (
                "KotCompany Coupure",
                "Theresianenstraat 14",
                (51.05375710547887, 3.7134100418101443),
            ),
        ],
        "Haven": [
            ("Oslo", "Londenstraat 5", (51.07416735234764, 3.72952063996095)),
            (
                "Kobenhavn",
                "Koperhagenstraat 2-12",
                (51.07430073953218, 3.728330011125224),
            ),
            ("Voorhaven", "Neusplein 2", (51.06813808508884, 3.72884308413937)),
            (
                "Nieuwland Blok C",
                "Désiré Fiévéstraat 14",
                (51.06330039611453, 3.7316075131754873),
            ),
        ],
        "Station": [
            (
                "Alberts House",
                "Floraliënlaan 11",
                (51.04093294430653, 3.719588439959294),
            ),
            (
                "Beaux-Arts",
                "Filips van Marnixstraat 9",
                (51.040723692050804, 3.718420979187942),
            ),
            (
                "Nassau",
                "Willem van Nassaustraat 1-21",
                (51.04014979252297, 3.7171643129737157),
            ),
            (
                "Paulus",
                "Rijsenbergstraat 144-146",
                (51.041782096146235, 3.7032817669448934),
            ),
            (
                "Ter Leie 1+2",
                "Eedverbondkaai 213-242",
                (51.04126155162434, 3.713626599480992),
            ),
            (
                "Maeterlinck",
                "Eedverbondkaai 185-200",
                (51.04121424352853, 3.7142471706452698),
            ),
        ],
        "Artevelde": [
            (
                "Artevelde",
                "Brabantdam 205-241",
                (51.049617775609676, 3.7335141129742215),
            ),
            (
                "Lamartine",
                "Brabantdam 147-171",
                (51.04979558585772, 3.7327494994814248),
            ),
            (
                "Oudescheldestraat",
                "Oudescheldestraat 10",
                (51.04904367993461, 3.7304564976311934),
            ),
            (
                "Frontenac",
                "Hubert Frère-Orbanlaan 130-143",
                (51.04472602788511, 3.7337050194379766),
            ),
        ],
    },
    "Antwerpen": {
        "Schelde": [
            (
                "Zuiderzin",
                "Kromme-Elleboogstraat 11",
                (51.21713222269407, 4.395024299734358),
            ),
            ("Aplace", "Vrijdagmarkt 1", (51.21870469186559, 4.398660239968136)),
            ("Cityhome", "Leeuwenstraat 11", (51.218908431282934, 4.399428197639618)),
            (
                "Holiday Home Zalig",
                "Lange Riddersstraat 77",
                (51.21567896261722, 4.396385868803705),
            ),
            (
                "Maison Nationale",
                "Nationalestraat 49",
                (51.21612407750074, 4.399306539968008),
            ),
        ],
        "Centrum Noord": [
            (
                "Residentie Helmstraat",
                "Helmstraat 1",
                (51.21667171850207, 4.430484997639523),
            ),
            ("De Kroon", "Turnhoutsebaan 65", (51.21645102097294, 4.431078168803776)),
            (
                "Kopergieterij",
                "Cronjestraat 12",
                (51.216561417199244, 4.437714811132286),
            ),
            (
                "Residentie Kistemaeckersstraat",
                "Kistemaeckersstraat 1",
                (51.219697748539055, 4.4374782264753945),
            ),
        ],
        "Park": [
            ("Ter Vijvere", "Van Eycklei 29", (51.210376696243806, 4.414793382296232)),
            (
                "Residentie Van Eycklei",
                "Van Eycklei 28",
                (51.21033411141256, 4.414720726474949),
            ),
            ("Primavera", "Van Eycklei 54", (51.20986810428488, 4.417578451610241)),
            (
                "Perfect Flat",
                "Plantin en Moretuslei 12",
                (51.210433987152776, 4.419427428325112),
            ),
        ],
        "Ter Zuid": [
            (
                "Van Hulsen Rachel",
                "Boomgaardstraat 39",
                (51.20041230263825, 4.420054568802977),
            ),
            ("Short Rentals", "Belgiëlei 180", (51.203207917167575, 4.413868555310323)),
            ("The Banker", "Belgiëlei 153", (51.203958114978086, 4.415757282295899)),
            (
                "Residentie Amberes",
                "Gounodstraat 2",
                (51.20619448660627, 4.409555684146244),
            ),
            (
                "Antwerp Rentals",
                "Isabellalei 50",
                (51.205327720850526, 4.416209497638955),
            ),
        ],
    },
    "Leuven": {
        "Ring Zuid": {
            ("Kot del sol", "Schapenstraat 86", (50.87100200738777, 4.697850968786639)),
            ("TopkotLeuven", "Groenstraat 2", (50.860008744163686, 4.696560066935868)),
            (
                "Flavus Student Residence",
                "Hoveniersdreef 33",
                (50.86394533504286, 4.699414999472231),
            ),
            ("Waversbaan", "Waversbaan 6", (50.86592519922484, 4.695886528308088)),
        },
        "Leuven Centrum": {
            (
                "Getaway Studios",
                "Vital Decosterstraat 23",
                (50.88022461906615, 4.705236282279895),
            ),
            (
                "Ambassador Suites",
                "Sint-Maartenstraat 21",
                (50.881789776813754, 4.705164055294403),
            ),
            (
                "Savoye Business Flat",
                "Savoyestraat 5",
                (50.87903439165979, 4.7035141841299986),
            ),
        },
        "Kruidtuin": {
            (
                "op kot bij de directeur",
                "Kapucijnenvoer 47",
                (50.87869623165756, 4.692394795772537),
            ),
            (
                "Goede Herder",
                "Minderbroedersstraat 21",
                (50.877545668523055, 4.692826453443984),
            ),
            (
                "Cohousing BotaniCo",
                "Kapucijnenvoer 47",
                (50.878709770680686, 4.692566457144436),
            ),
            (
                "Residentie COPAL",
                "Tervuursestraat 56",
                (50.87856334939567, 4.687689226458512),
            ),
            (
                "Xior Student Housing - Regina Mundi",
                "Janseniusstraat 38",
                (50.87570521074992, 4.692543926458334),
            ),
        },
    },
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
    ("Doris", "Dekeyser", "Leuven"),
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
    ("Garcon", "Goedmans", "Leuven"),
]

syndici_data = [
    ("Steven", "Siermans"),
    ("Sven", "Sanders"),
    ("Sophie", "Schildermans"),
    ("Saartje", "Smets"),
    ("Stijn", "Schoonoven"),
    ("Sandra", "Schoenmakers"),
]

garbage = [
    "Rest",
    "GFT",
    "Glas",
    "PMD",
    "KGA",
    "Nucleair",
]

building_images = [
    os.path.abspath(os.path.join(root, name))
    for root, files, names in os.walk("./mock_images/buildings/")
    for name in names
]

entrance_images = [
    os.path.abspath(os.path.join(root, name))
    for root, files, names in os.walk("./mock_images/entrances/")
    for name in names
]
garbage_images = [
    os.path.abspath(os.path.join(root, name))
    for root, files, names in os.walk("./mock_images/garbage/")
    for name in names
]


class Command(BaseCommand):
    def add_arguments(self, parser):
        parser.add_argument("admin_pass", type=str, action="store")

    def handle(self, *args, **options):
        # Predictable data
        random.seed(0)

        self.stdout.write("Adding location groups...")

        lgs = [LocationGroup(name=lg) for lg in location_group_data]
        for lg in lgs:
            lg.save()

        self.stdout.write("Adding schedule definitions and buildings...")

        buildings = []
        schedule_definitions = []
        for city, schedule_definition_data in building_data.items():
            location_group = LocationGroup.objects.get(name=city)
            for (
                schedule_definition_name,
                schedule_definition_building_list,
            ) in schedule_definition_data.items():
                schedule_definition_buildings = []
                for (
                    building_name,
                    building_address,
                    building_coordinates,
                ) in schedule_definition_building_list:
                    latitude, longitude = building_coordinates
                    image = random.choice(building_images)
                    building = Building(
                        address=building_address,
                        name=building_name,
                        location_group=location_group,
                        latitude=latitude,
                        longitude=longitude,
                        image=local_image_path_to_django_image_data(image),
                    )
                    building.save()
                    buildings.append(building)
                    schedule_definition_buildings.append(building)
                for version in range(1, 5):
                    schedule_definition = ScheduleDefinition(
                        name=schedule_definition_name,
                        version=version,
                        location_group=location_group,
                    )
                    schedule_definition.save()
                    for i, building in enumerate(schedule_definition_buildings):
                        schedule_definition_building = ScheduleDefinitionBuilding(
                            building=building,
                            schedule_definition=schedule_definition,
                            position=i,
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
        syndicus.buildings.set(buildings[:10])

        self.stdout.write("Adding admins...")

        for first_name, last_name in admin_data:
            u = User(
                username=generate_email_from_name(first_name),
                first_name=first_name,
                last_name=last_name,
            )
            u.save()
            admin = Admin(user=u)
            admin.save()

        self.stdout.write("Adding students...")

        for first_name, last_name, city in student_data:
            lg = LocationGroup.objects.get(name=city)
            u = User(
                username=generate_email_from_name(first_name),
                first_name=first_name,
                last_name=last_name,
            )
            u.save()

            student = Student(user=u, is_super_student=False, location_group=lg)
            student.save()
            students.append(student)

        self.stdout.write("Adding super students...")

        for first_name, last_name, city in super_student_data:
            lg = LocationGroup.objects.get(name=city)
            u = User(
                username=generate_email_from_name(first_name),
                first_name=first_name,
                last_name=last_name,
            )
            u.save()

            superstudent = Student(user=u, is_super_student=True, location_group=lg)
            superstudent.save()
            superstudents.append(superstudent)

        self.stdout.write("Adding syndici...")

        for first_name, last_name in syndici_data:
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

        # The schedule definition versions in the mock data range from 1 to 4
        # , so the latest definitions are always v. 4
        latest_schedule_definitions = [
            definition for definition in schedule_definitions if definition.version == 4
        ]

        schedule_assignments = []

        # In order to generate the mock schedule assignments, for every day, for
        # every (latest) schedule definition we roll a 50% chance to see if there
        # will be a schedule assignment on that day. If yes, we assign a random
        # student from that city
        for month in [4, 5, 6]:
            for day in range(1, 31):
                for definition in latest_schedule_definitions:
                    if random.random() > 0.5:  # 50% chance
                        definition_lg = definition.location_group
                        available_students = [
                            student
                            for student in students
                            if student.location_group == definition_lg
                        ]
                        student = random.choice(available_students)
                        schedule_assignments.append(
                            ScheduleAssignment(
                                assigned_date=f"2023-0{month}-{day}",
                                schedule_definition=definition,
                                user=student.user,
                            )
                        )

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

            # Only add entries if they happen before or during
            # MAX_DATE_WITH_SCHEDULE_WORK_ENTRIES
            str_year, str_month, str_day = schedule_assignment.assigned_date.split("-")
            assignment_date = datetime.date(int(str_year), int(str_month), int(str_day))
            if assignment_date <= MAX_DATE_WITH_SCHEDULE_WORK_ENTRIES:
                for index in range(len(buildings_in_schedule_definition_of_0) - 2):
                    building = buildings_in_schedule_definition_of_0[index]
                    entrance_image = random.choice(entrance_images)
                    garbage_image = random.choice(garbage_images)
                    work_entries.append(
                        ScheduleWorkEntry(
                            creation_timestamp=f"{date} 12:{index}0:00",
                            image=local_image_path_to_django_image_data(entrance_image),
                            creator=schedule_assignment.user,
                            building=building,
                            schedule_assignment=schedule_assignment,
                            entry_type="AR",
                        )
                    )
                    work_entries.append(
                        ScheduleWorkEntry(
                            creation_timestamp=f"{date} 12:{index}1:00",
                            image=local_image_path_to_django_image_data(entrance_image),
                            creator=schedule_assignment.user,
                            building=building,
                            schedule_assignment=schedule_assignment,
                            entry_type="AR",
                        )
                    )
                    work_entries.append(
                        ScheduleWorkEntry(
                            creation_timestamp=f"{date} 12:{index}2:00",
                            image=local_image_path_to_django_image_data(garbage_image),
                            creator=schedule_assignment.user,
                            building=building,
                            schedule_assignment=schedule_assignment,
                            entry_type="WO",
                        )
                    )
                    work_entries.append(
                        ScheduleWorkEntry(
                            creation_timestamp=f"{date} 12:{index}3:00",
                            image=local_image_path_to_django_image_data(garbage_image),
                            creator=schedule_assignment.user,
                            building=building,
                            schedule_assignment=schedule_assignment,
                            entry_type="WO",
                        )
                    )
                    work_entries.append(
                        ScheduleWorkEntry(
                            creation_timestamp=f"{date} 12:{index}4:00",
                            image=local_image_path_to_django_image_data(garbage_image),
                            creator=schedule_assignment.user,
                            building=building,
                            schedule_assignment=schedule_assignment,
                            entry_type="WO",
                        )
                    )
                    work_entries.append(
                        ScheduleWorkEntry(
                            creation_timestamp=f"{date} 12:{index}5:00",
                            image=local_image_path_to_django_image_data(entrance_image),
                            creator=schedule_assignment.user,
                            building=building,
                            schedule_assignment=schedule_assignment,
                            entry_type="DE",
                        )
                    )
                entrance_image = random.choice(entrance_images)
                garbage_image = random.choice(garbage_images)
                work_entries.append(
                    ScheduleWorkEntry(
                        creation_timestamp=f"{date} 13:00:00",
                        image=local_image_path_to_django_image_data(entrance_image),
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
                        image=local_image_path_to_django_image_data(garbage_image),
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
            "You can use the provided password to log into student@drtrottoir.be, superstudent@drtrottoir.be, syndicus@drtrottoir.be and admin@drtrottoir.be"  # noqa
        )
