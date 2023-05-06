import uuid
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


class UserInviteSerializer(serializers.Serializer):
    password = serializers.CharField(max_length=255)


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
            "invite_link",
            "student",
            "admin",
            "syndicus",
        ]
        read_only_fields = ["id", "invite_link"]

    def create(self, validated_data):
        student_data = validated_data.pop("student")
        admin_data = validated_data.pop("admin")
        syndicus_data = validated_data.pop("syndicus")

        user = User.objects.create(invite_link=uuid.uuid4(), **validated_data)

        if student_data is not None:
            Student.objects.create(user=user, **student_data)

        if admin_data is not None:
            Admin.objects.create(user=user, **admin_data)

        if syndicus_data is not None:
            buildings = syndicus_data.pop("buildings")
            syndicus = Syndicus.objects.create(user=user, **syndicus_data)
            syndicus.buildings.set(buildings)

        return user

    @staticmethod
    def update_one_on_one_field(
        instance, validated_data, field_name, field_model, many_to_many_fields=None
    ):
        """
        Utility function for the `update` method that updates a one-on-one
        field's reverse relationship. It handles the following cases:
        * New data is provided for a relationship that doesn't exist yet
        * New data is provided for an existing relationship
        * An existing relationship is set to null, meaning it should be removed
        """
        if many_to_many_fields is None:
            many_to_many_fields = set()

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
                    # many-to-many fields need to be changed using the set
                    # command
                    if field in many_to_many_fields:
                        getattr(relation_instance, field).set(value)

                    else:
                        setattr(relation_instance, field, value)

                # update_fields may not include m2m field names
                relation_instance.save(
                    update_fields=set(field_data.keys()) - many_to_many_fields
                )

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
            instance, validated_data, "syndicus", Syndicus, {"buildings"}
        )

        # Remaining data is what should be updated on the User instance itself
        for field, value in validated_data.items():
            setattr(instance, field, value)

        instance.save(update_fields=validated_data.keys())

        return instance
