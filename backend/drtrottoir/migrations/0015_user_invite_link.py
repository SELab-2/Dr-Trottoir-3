# Generated by Django 4.1.7 on 2023-05-06 17:38

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("drtrottoir", "0014_building_name"),
    ]

    operations = [
        migrations.AddField(
            model_name="user",
            name="invite_link",
            field=models.UUIDField(null=True, unique=True),
        ),
    ]
