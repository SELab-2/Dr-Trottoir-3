# Generated by Django 4.1.7 on 2023-03-09 15:11

from django.db import migrations, models
import drtrottoir.models


class Migration(migrations.Migration):
    dependencies = [
        ("drtrottoir", "0006_rename_image_building_pdf_guide"),
    ]

    operations = [
        migrations.AlterField(
            model_name="building",
            name="pdf_guide",
            field=models.FileField(
                null=True, upload_to=drtrottoir.models.get_file_path_building_pdf_guide
            ),
        ),
    ]
