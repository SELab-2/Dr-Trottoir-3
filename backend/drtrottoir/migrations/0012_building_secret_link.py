# Generated by Django 4.1.7 on 2023-04-04 09:08

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("drtrottoir", "0011_merge_20230327_1439"),
    ]

    operations = [
        migrations.AddField(
            model_name="building",
            name="secret_link",
            field=models.UUIDField(null=True, unique=True),
        ),
    ]
