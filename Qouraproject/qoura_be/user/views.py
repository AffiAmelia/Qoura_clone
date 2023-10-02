from django.shortcuts import render, redirect, get_object_or_404
from datetime import datetime, timedelta
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from django.conf import settings
import jwt
from django.http import HttpResponse
from django.urls.base import reverse_lazy
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.decorators import user_passes_test
from django.utils.decorators import method_decorator
from topic.models import (
    Topic,
    Question,
    Question_Reaction_Table,
    Answer,
    Answer_Reaction_Table,
)
from django.views.generic import ListView
from .serializers import (
    UserSerializer,
    UserLoginSerializer,
    UserRegistrationSerializer,
    UserAboutSerializer,
    ChangePasswordSerializer,
)
from django.db import transaction
from .models import User
from django.core.signals import request_started
from .forms import UserRegistrationForm, UserLoginForm
from django.contrib import messages
from django.views.generic.base import View
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from topic.serializer import (
    QuestionSerializer,
    AnswerSerializer,
    QuestionByTopicSerializer,
    GetQuestionSerializer,
    TopicSerializer,
)
from django.views.decorators.csrf import csrf_exempt
import json
from cloudinary.uploader import upload


def not_logged_in(user):
    return not user.is_authenticated


def logged_in(user):
    return user.is_authenticated


def get_csrf_token(request):
    csrf_token = request.COOKIES.get("csrftoken")
    return JsonResponse({"csrfToken": csrf_token})


class UserRegistrationAPIView(APIView):
    def post(self, request):
        print(request.data)
        serializer = UserRegistrationSerializer(data=request.data)
        print(serializer)
        if serializer.is_valid():
            user = serializer.save()
            return Response(
                {"message": "User registered successfully."},
                status=status.HTTP_201_CREATED,
            )
        else:
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserLoginView(APIView):
    def post(self, request):
        try:
            data = request.data
            print("data", data)
            serializer = UserLoginSerializer(data=data)
            if serializer.is_valid():
                username = serializer.validated_data.get("username")
                password = serializer.validated_data.get("password")

                user = authenticate(username=username, password=password)
                if user is None:
                    print("User not exist ")
                    return Response(
                        {
                            "status": 400,
                            "message": "Invalid username or password",
                            "data": {},
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                refresh_token = RefreshToken.for_user(user)
                jwtToken = {
                    "refresh": str(refresh_token),
                    "access": str(refresh_token.access_token),
                }

                return Response(
                    {"status": 200, "message": "Login successful", "jwtToken": jwtToken}
                )

            return Response(
                {
                    "status": 400,
                    "message": "Invalid data",
                    "jwtToken": serializer.errors,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception as exce:
            print("Exception occurred:", exce)
            return Response(
                {
                    "status": 500,
                    "message": "Internal Server Error",
                    "jwtToken": str(exce),
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class HomeAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_id = request.query_params.get("user_id")
        user = User.objects.get(id=user_id)
        user_followed_topics = user.followed_topics.all()
        queryset = Question.objects.filter(topics__in=user_followed_topics).distinct()

        queryset = queryset.prefetch_related("answers")
        serializer = QuestionByTopicSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class LogoutAPIView(APIView):
    def get(self, request):
        logout(request)
        return Response({"message": "You are logged out."}, status=status.HTTP_200_OK)


@csrf_exempt
def like_question(request):
    if request.method == "POST":
        data = json.loads(request.body)
        user_id = data.get("user")
        question_id = data.get("question_id")
        reaction_type = int(data.get("type", 0))

        if reaction_type not in [-1, 1]:
            return JsonResponse(
                {"error": "Invalid reaction_type. Use -1 for dislike or 1 for like."},
                status=400,
            )

        user = User.objects.get(id=user_id)
        question = get_object_or_404(Question, pk=question_id)

        with transaction.atomic():
            user_reaction = Question_Reaction_Table.objects.filter(
                user=user, question=question
            ).first()

            if user_reaction is not None:
                if user_reaction.reaction_type != reaction_type:
                    if reaction_type == 1:
                        question.like_count += 1
                        question.dislike_count -= 1
                    else:
                        question.like_count -= 1
                        question.dislike_count += 1

                    user_reaction.reaction_type = reaction_type
                    user_reaction.save()
                elif reaction_type == -1:
                    question.like_count -= 1
                    question.dislike_count += 1

            else:
                if reaction_type == 1:
                    question.like_count += 1
                else:
                    question.dislike_count += 1

                Question_Reaction_Table.objects.create(
                    user=user, question=question, reaction_type=reaction_type
                )

            question.save()

            return JsonResponse(
                {
                    "like_count": question.like_count,
                    "dislike_count": question.dislike_count,
                }
            )

    return JsonResponse({}, status=400)


@csrf_exempt
def like_answer(request):
    if request.method == "POST":
        data = json.loads(request.body)
        user_id = data.get("user")
        answer_id = data.get("answer_id")
        reaction_type = int(data.get("type", 0))

        if reaction_type not in [-1, 1]:
            return JsonResponse(
                {"error": "Invalid reaction_type. Use -1 for dislike or 1 for like."},
                status=400,
            )

        user = User.objects.get(id=user_id)
        answer = get_object_or_404(Answer, pk=answer_id)

        with transaction.atomic():
            user_reaction = Answer_Reaction_Table.objects.filter(
                user=user, answer=answer
            ).first()

            if user_reaction is not None:
                if user_reaction.reaction_type != reaction_type:
                    if reaction_type == 1:
                        answer.like_count += 1
                        answer.dislike_count -= 1
                    else:
                        answer.like_count -= 1
                        answer.dislike_count += 1

                    user_reaction.reaction_type = reaction_type
                    user_reaction.save()
                elif reaction_type == -1:
                    answer.like_count -= 1
                    answer.dislike_count += 1

            else:
                if reaction_type == 1:
                    answer.like_count += 1
                else:
                    answer.dislike_count += 1

                Answer_Reaction_Table.objects.create(
                    user=user, answer=answer, reaction_type=reaction_type
                )

            answer.save()

            return JsonResponse(
                {
                    "like_count": answer.like_count,
                    "dislike_count": answer.dislike_count,
                }
            )

    return JsonResponse({}, status=400)


class QuestionFollowedTopicsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_followed_topics = request.user.followed_topics.all()

        queryset = Question.objects.filter(topics__in=user_followed_topics).distinct()

        serializer = GetQuestionSerializer(queryset, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)


class SearchQuestionsByTopicAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        request_body = request.body.decode("utf-8")
        data = json.loads(request_body)
        topic = data.get("topic")

        questions = Question.objects.filter(topics__topic_name=topic)

        serializer = QuestionByTopicSerializer(questions, many=True)
        print(serializer.data)
        return Response(serializer.data, status=status.HTTP_200_OK)


class AnswerQuestionAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        return Response({"message": "Get is working"}, status=status.HTTP_200_OK)

    @csrf_exempt
    def post(self, request, *args, **kwargs):
        answer_data = {
            "question": request.data.get("questionId"),
            "user": request.data.get("userId"),
            "answer_statement": request.data.get("answer"),
        }
        serializer = AnswerSerializer(data=answer_data)

        if serializer.is_valid():
            answer = serializer.save()
            response_data = {
                "message": "Answer submitted successfully.",
                "answer": AnswerSerializer(answer).data,
            }
            return Response(response_data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AboutPageAPIView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserAboutSerializer

    def get_object(self):
        return self.request.user


class UserProfileAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user_id = kwargs.get("user_id")
        user = get_object_or_404(User, id=user_id)

        user_serializer = UserSerializer(user)
        followed_topics = user.followed_topics.all()
        asked_questions = Question.objects.filter(user=user)
        given_answers = Answer.objects.filter(user=user)
        topic_serializer = TopicSerializer(followed_topics, many=True)
        question_serializer = GetQuestionSerializer(asked_questions, many=True)
        answer_serializer = AnswerSerializer(given_answers, many=True)
        print(user_serializer.data)
        context = {
            "user_info": user_serializer.data,
            "asked_questions": question_serializer.data,
            "given_answers": answer_serializer.data,
            "followed_topics": topic_serializer.data,
        }
        return Response(
            context,
            status=status.HTTP_200_OK,
        )

    def put(self, request, *args, **kwargs):
        user_id = kwargs.get("user_id")
        user = get_object_or_404(User, id=user_id)
        for key, value in request.data.items():
            if key == "gender":
                gender_mapping = {"male": 1, "female": -1}
                if value in gender_mapping:
                    setattr(user, key, gender_mapping[value])
            else:
                setattr(user, key, value)

        user.save()

        response_data = {
            "message": "Profile updated successfully.",
            "data": UserSerializer(user).data,
        }
        return Response(response_data, status=status.HTTP_200_OK)


class ChangePasswordView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        print(request)
        serializer = ChangePasswordSerializer(data=request.data)

        if serializer.is_valid():
            user = request.user
            if user.check_password(serializer.validated_data["old_password"]):
                user.set_password(serializer.validated_data["new_password"])
                user.save()
                return Response(
                    {"message": "Password changed successfully"},
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(
                    {"error": "Incorrect old password"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
