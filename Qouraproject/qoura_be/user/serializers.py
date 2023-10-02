from rest_framework import serializers
from dateutil.parser import parse
from .models import User
from topic.serializer import (
    TopicSerializer,
    QuestionSerializer,
    AnswerSerializer,
    GetQuestionSerializer,
)
from datetime import datetime
from django.contrib.auth import authenticate


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    confirmpassword = serializers.CharField(write_only=True)
    age = serializers.DateField()

    class Meta:
        model = User
        fields = [
            "username",
            "age",
            "profile_picture",
            "gender",
            "email",
            "password",
            "confirmpassword",
        ]

    def create(self, validated_data):
        password = validated_data.pop("password")
        print("heheh", password)
        confirmpassword = validated_data.pop("confirmpassword")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class UserLoginSerializer(serializers.ModelSerializer):
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(style={"input_type": "password"})

    class Meta:
        model = User
        fields = ["username", "password"]

    def create(self, validated_data):
        username = validated_data.get("username")
        password = validated_data.get("password")

        if username and password:
            user = authenticate(username=username, password=password)
            if user:
                if not user.is_active:
                    raise serializers.ValidationError("User account is not active.")
            else:
                raise serializers.ValidationError("Invalid username or password.")
        else:
            raise serializers.ValidationError("Must include 'username' and 'password'.")

        validated_data["user"] = user
        return validated_data


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    confirmpassword = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            "username",
            "age",
            "gender",
            "email",
            "password",
            "confirmpassword",
        ]

    def create(self, validated_data):
        confirmpassword = validated_data.pop("confirmpassword", None)

        if validated_data["password"] != confirmpassword:
            raise serializers.ValidationError("Passwords do not match.")

        user = User.objects.create(**validated_data)
        user.set_password(validated_data["password"])
        user.save()

        return user


class UserAboutSerializer(serializers.ModelSerializer):
    followed_topics = TopicSerializer(many=True)
    asked_questions = GetQuestionSerializer(many=True)
    answers = AnswerSerializer(many=True)

    class Meta:
        model = User
        fields = [
            "user_id",
            "username",
            "email",
            "followed_topics",
            "asked_questions",
            "answers",
        ]


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField()
    new_password = serializers.CharField()

    def validate(self, data):
        old_password = data.get("old_password")
        new_password = data.get("new_password")

        if old_password == new_password:
            raise serializers.ValidationError(
                "New password cannot be the same as old password."
            )

        return data
