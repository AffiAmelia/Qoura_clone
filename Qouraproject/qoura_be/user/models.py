from django.db import models
from django.core.validators import validate_email
from django.core.validators import FileExtensionValidator
from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError
from cloudinary.models import CloudinaryField
from .manager import UserManager
import datetime
import uuid


def validate_username_no_number(value):
    if any(char.isdigit() for char in value):
        raise ValidationError("Username cannot contain numbers.")


def email_validator(value):
    allowed_domains = ["gmail.com", "yahoo.com", "devsinc.com"]
    try:
        validate_email(value)
        domain = value.split("@")[1]
        if domain not in allowed_domains:
            raise ValidationError(
                "Only Gmail and Yahoo email addresses are allowed. Models"
            )
    except ValidationError as exc:
        raise ValidationError("Invalid email address.") from exc


def validate_age_not_negative(value):
    if value > datetime.date.today():
        raise ValidationError("Date of birth cannot be in future")


class User(AbstractUser):
    GENDER_CHOICES = [
        (1, "Male"),
        (-1, "Female"),
        (0, "Other"),
    ]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    username = models.CharField(
        max_length=150, unique=True, validators=[validate_username_no_number]
    )
    age = models.DateField(validators=[validate_age_not_negative], default="2001-04-22")
    gender = models.IntegerField(choices=GENDER_CHOICES, default="1")
    email = models.EmailField(
        validators=[email_validator],
        unique=True,
        blank=False,
        null=False,
    )
    profile_picture = CloudinaryField(
        default="",
        verbose_name="Profile Picture",
        validators=[FileExtensionValidator(allowed_extensions=["jpeg", "jpg", "png"])],
    )
    REQUIRED_FIELDS = ["email"]
    USERNAME_FIELD = "username"
    EMAIL_FIELD = "email"
    objects = UserManager()

    def __str__(self):
        return self.username
