from rest_framework import serializers

from drtrottoir.models import Admin, Student, Syndicus, User


class AdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Admin
        fields = "__all__"


class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = "__all__"


class SyndicusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Syndicus
        fields = "__all__"


class UserSerializer(serializers.ModelSerializer):
    student = StudentSerializer()
    admin = AdminSerializer()
    syndicus = SyndicusSerializer()

    class Meta:
        model = User
        fields = ["id", "first_name", "last_name", "student", "admin", "syndicus"]
