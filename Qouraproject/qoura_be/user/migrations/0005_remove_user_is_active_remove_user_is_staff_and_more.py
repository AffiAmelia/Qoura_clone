# Generated by Django 4.2.3 on 2023-08-02 15:04

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("user", "0004_user_is_active_user_is_staff_user_is_superuser"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="user",
            name="is_active",
        ),
        migrations.RemoveField(
            model_name="user",
            name="is_staff",
        ),
        migrations.RemoveField(
            model_name="user",
            name="is_superuser",
        ),
    ]
