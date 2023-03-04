from drtrottoir.models import Building, GarbageType, LocationGroup


def insert_dummy_garbage_type() -> GarbageType:
    gt = GarbageType(name="dummy garbage type")
    gt.save()

    return gt


def insert_dummy_location_group(name: str = "dummy location group") -> LocationGroup:
    lg = LocationGroup(name=name)
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
