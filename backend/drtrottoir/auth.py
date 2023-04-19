from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from drtrottoir.permissions import (
    user_is_admin,
    user_is_student,
    user_is_superstudent,
    user_is_syndicus,
)


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        possible_roles = [
            ("student", user_is_student),
            ("superstudent", user_is_superstudent),
            ("admin", user_is_admin),
            ("syndicus", user_is_syndicus),
        ]

        roles = []

        for role, func in possible_roles:
            if func(user):
                roles.append(role)

        token["roles"] = roles

        return token
