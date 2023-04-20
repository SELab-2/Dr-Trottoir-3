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
        read_only_fields = ["id"]

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

    @staticmethod
    def update_one_on_one_field(instance, validated_data, field_name, field_model):
        """
        Utility function for the `update` method that updates a one-on-one
        field's reverse relationship. It handles the following cases:
        * New data is provided for a relationship that doesn't exist yet
        * New data is provided for an existing relationship
        * An existing relationship is set to null, meaning it should be removed
        """
        if field_name in validated_data:
            field_data = validated_data.pop(field_name)
            old_relation_exists = hasattr(instance, field_name)
            new_relation_is_null = field_data is None

            # Relation exists, but the new data is None -> remove relation
            if old_relation_exists and new_relation_is_null:
                getattr(instance, field_name).delete()
                setattr(instance, field_name, None)

            # Relation already exists, and data is provided -> update fields
            elif old_relation_exists and not new_relation_is_null:
                relation_instance = getattr(instance, field_name)

                for field, value in field_data.items():
                    setattr(relation_instance, field, value)

                relation_instance.save(update_fields=field_data.keys())

            # Relationship doesn't exist, but data is provided -> create
            # relation
            elif not new_relation_is_null:
                field_model.objects.create(user=instance, **field_data)

            # Final option is where both are null, meaning nothing has to be
            # done

    def update(self, instance, validated_data):
        UserSerializer.update_one_on_one_field(
            instance, validated_data, "student", Student
        )
        UserSerializer.update_one_on_one_field(instance, validated_data, "admin", Admin)
        UserSerializer.update_one_on_one_field(
            instance, validated_data, "syndicus", Syndicus
        )

        # Remaining data is what should be updated on the User instance itself
        for field, value in validated_data.items():
            setattr(instance, field, value)

        instance.save(update_fields=validated_data.keys())

        return instance
