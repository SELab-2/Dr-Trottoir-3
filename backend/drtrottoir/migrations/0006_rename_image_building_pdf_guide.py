# Generated by Django 4.1.7 on 2023-03-06 13:20

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("drtrottoir", "0005_remove_building_guide_pdf_path_building_image"),
    ]

    operations = [
        migrations.RenameField(
            model_name="building",
            old_name="image",
            new_name="pdf_guide",
        ),
    ]
