# Generated by Django 4.1.7 on 2023-05-17 20:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('drtrottoir', '0015_user_invite_link'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='reset_password_link',
            field=models.UUIDField(null=True, unique=True),
        ),
    ]