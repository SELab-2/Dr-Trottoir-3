import datetime
from datetime import date


def get_date_today() -> date:
    return date.today()


def get_date_today_with_offset(days: int) -> date:
    return date.today() + datetime.timedelta(days=days)
