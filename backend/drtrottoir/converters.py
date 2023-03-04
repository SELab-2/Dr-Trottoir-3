import datetime


class DateConverter:
    regex: str = r"\d{4}-\d{1,2}-\d{1,2}"
    format: str = "%Y-%m-%d"

    def to_python(self, value: str) -> datetime.date:
        return datetime.datetime.strptime(value, self.format).date()

    def to_url(self, value: datetime.date) -> str:
        return value.strftime(self.format)
