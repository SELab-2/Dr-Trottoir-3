def add(a: float, b: float) -> float:
    """Add two numbers to each other.

    Examples:
        >>> add(1.0, 2.0)
        3.0

    Args:
        a (float): The first number of the operation.
        b (float): The second number of the operation.

    Returns:
        float: The sum of the two given numbers.
    """
    return a + b


def divide(a: float, b: float) -> float:
    """Divide two numbers with each other.

    Args:
        a (float): The numerator of the operation.
        b (float): The denominator of the operation.

    Raises:
        ValueError: If `b` equals zero.

    Returns:
        float: The result of the division.
    """
    if b == 0:
        raise ValueError("Cannot divide by zero!")
    return a / b
