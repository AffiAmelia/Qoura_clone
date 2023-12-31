# Generated by Django 4.2.3 on 2023-08-01 19:11

import cloudinary.models
from django.conf import settings
import django.core.validators
from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Answer",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("answer_statement", models.TextField()),
                ("like_count", models.PositiveIntegerField(default=0)),
                ("dislike_count", models.PositiveIntegerField(default=0)),
            ],
        ),
        migrations.CreateModel(
            name="Question",
            fields=[
                (
                    "question_id",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        primary_key=True,
                        serialize=False,
                    ),
                ),
                ("question_statement", models.TextField()),
                ("like_count", models.PositiveIntegerField(default=0)),
                ("dislike_count", models.PositiveIntegerField(default=0)),
            ],
        ),
        migrations.CreateModel(
            name="Topic",
            fields=[
                (
                    "topic_id",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        primary_key=True,
                        serialize=False,
                    ),
                ),
                ("topic_name", models.CharField(max_length=50, unique=True)),
                ("description", models.TextField(max_length=500)),
                (
                    "picture",
                    cloudinary.models.CloudinaryField(
                        blank=True,
                        max_length=255,
                        validators=[
                            django.core.validators.FileExtensionValidator(
                                allowed_extensions=["png", "jpg", "jpeg"]
                            )
                        ],
                        verbose_name="image",
                    ),
                ),
                ("follow_count", models.PositiveIntegerField(default=0)),
                (
                    "created_by",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
                (
                    "followers",
                    models.ManyToManyField(
                        related_name="followed_topics", to=settings.AUTH_USER_MODEL
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Question_Topic_Table",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "question",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="topic.question"
                    ),
                ),
                (
                    "topic",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="topic.topic"
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Question_Reaction_Table",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "reaction_type",
                    models.IntegerField(
                        choices=[(1, "Like"), (0, "Nothing"), (-1, "Dislike")]
                    ),
                ),
                (
                    "question",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="topic.question"
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
        migrations.AddField(
            model_name="question",
            name="topics",
            field=models.ManyToManyField(
                through="topic.Question_Topic_Table", to="topic.topic"
            ),
        ),
        migrations.AddField(
            model_name="question",
            name="user",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="asked_questions",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.CreateModel(
            name="Answer_Reaction_Table",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "reaction_type",
                    models.IntegerField(
                        choices=[(1, "Like"), (0, "Nothing"), (-1, "Dislike")]
                    ),
                ),
                (
                    "answer",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="topic.answer"
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
        migrations.AddField(
            model_name="answer",
            name="question",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE, to="topic.question"
            ),
        ),
        migrations.AddField(
            model_name="answer",
            name="user",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="answers",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
    ]
