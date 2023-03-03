import datetime


class DateConverter:
    regex: str = "\d{4}-\d{1,2}-\d{1,2}"
    format: str = "%Y-%m-%d"

    def to_python(self, value):
        return datetime.strptime(value, self.format).date()

    def to_url(self, value):
        return value.strftime(self.format)
