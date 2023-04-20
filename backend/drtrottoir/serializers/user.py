from typing import List

from rest_framework import serializers

from drtrottoir.models import Admin, Student, Syndicus, User


class AdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Admin
        fields: List[str] = []
        read_only_fields = ["id", "user"]


class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ["location_group", "is_super_student"]
        read_only_fields = ["id", "user"]


class SyndicusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Syndicus
        fields = ["buildings"]
        read_only_fields = ["id", "user"]


class UserSerializer(serializers.ModelSerializer):
    student = StudentSerializer(allow_null=True)
    admin = AdminSerializer(allow_null=True)
    syndicus = SyndicusSerializer(allow_null=True)

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "first_name",
            "last_name",
            "student",
            "admin",
            "syndicus",
        ]

    def create(self, validated_data):
        student_data = validated_data.pop("student")
        admin_data = validated_data.pop("admin")
        syndicus_data = validated_data.pop("syndicus")

        user = User.objects.create(**validated_data)

        if student_data is not None:
            Student.objects.create(user=user, **student_data)

        if admin_data is not None:
            Admin.objects.create(user=user, **admin_data)

        if syndicus_data is not None:
            Syndicus.objects.create(user=user, **syndicus_data)

        return user
