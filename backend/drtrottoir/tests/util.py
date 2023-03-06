"""
Utility functions for testing purposes
"""

from dateutil import parser


def time_difference_in_seconds(date_str1: str, date_str2: str) -> float:
    date1 = parser.parse(date_str1).replace(tzinfo=None)
    date2 = parser.parse(date_str2).replace(tzinfo=None)
    difference_in_secs = abs((date1 - date2).total_seconds())
    return difference_in_secs


def date_equals(date_str1: str, date_str2: str) -> bool:
    """
    Test whether two date strings are the same
    """
    # We see two dates as equal if there is less than a second difference between them
    return time_difference_in_seconds(date_str1, date_str2) < 1
