class DocsTesting:
    """A class for testing docs generation"""

    """ A string contained in the class
    """
    string: str

    def __init__(self, string: str) -> None:
        """The constructor of the class.

        Args:
            string (str): A string that will be stored.
        """
        self.string = string

    def upper(self) -> str:
        """Returns an uppercase version of the string

        Returns:
            str: The stored string, but uppercase.
        """
        return self.string.upper()
