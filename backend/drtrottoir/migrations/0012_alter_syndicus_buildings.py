# Generated by Django 4.1.7 on 2023-04-03 10:06

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("drtrottoir", "0011_merge_20230327_1439"),
    ]

    operations = [
        migrations.AlterField(
            model_name="syndicus",
            name="buildings",
            field=models.ManyToManyField(
                related_name="syndici", to="drtrottoir.building"
            ),
        ),
    ]