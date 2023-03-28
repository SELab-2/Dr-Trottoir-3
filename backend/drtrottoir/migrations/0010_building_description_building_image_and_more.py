# Generated by Django 4.1.7 on 2023-03-25 15:41

from django.db import migrations, models
import drtrottoir.models


class Migration(migrations.Migration):
    dependencies = [
        ("drtrottoir", "0009_remove_scheduleworkentry_schedule_definition_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="building",
            name="description",
            field=models.TextField(null=True),
        ),
        migrations.AddField(
            model_name="building",
            name="image",
            field=models.ImageField(
                null=True, upload_to=drtrottoir.models.get_file_path_building_image
            ),
        ),
        migrations.AddField(
            model_name="garbagecollectionschedule",
            name="note",
            field=models.TextField(null=True),
        ),
    ]
