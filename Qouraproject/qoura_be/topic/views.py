from django.db.models import Count, Q
from django.core.paginator import Paginator
from user.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from .models import Topic, Question, Answer, Question_Topic_Table
from django.urls import reverse
from django.contrib.auth.decorators import user_passes_test
from django.shortcuts import get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.utils.decorators import method_decorator
from .serializer import (
    TopicSerializer,
    QuestionSerializer,
    QuestionByTopicSerializer,
    AnswerSerializer,
    AddTopicSerializer,
)


class AddTopicAPIView(APIView):
    serializer_class = AddTopicSerializer
    permission_classes = [
        AllowAny,
    ]

    def get(self, request, *args, **kwargs):
        print("hello")
        return Response({"Add topic": "Get is working"}, status=status.HTTP_200_OK)

    @csrf_exempt
    def post(self, request, *args, **kwargs):
        topic_name = request.data.get("topic_name")
        description = request.data.get("description")
        image = request.data.get("image")
        user_id = request.data.get("user_id")

        if not topic_name or not description or not image or not user_id:
            return Response(
                {"message": "Please provide all required data."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        data_for_serializer = {
            "topic_name": topic_name,
            "description": description,
            "created_by": user_id,
        }

        print(data_for_serializer)
        serializer = self.serializer_class(data=data_for_serializer)

        if serializer.is_valid():
            print("in serialzizer", serializer.validated_data)
            validated_data = serializer.validated_data
            validated_data["follow_count"] = 0
            validated_data["picture"] = image
            topic = serializer.save()

            topic.save()
            topic.followers.add(user_id)
            print(topic)
            return Response(
                {"message": "Topic added successfully.", "topic_id": topic.topic_id},
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AddQuestionToTopicAPIView(APIView):
    """Add Questions to Topics"""

    @csrf_exempt
    def post(self, request):
        """POST FUNCTION"""
        serializer = QuestionSerializer(data=request.data)

        if serializer.is_valid():
            question_statement = serializer.validated_data["question_statement"]
            topic_ids = serializer.validated_data["topic_ids"]
            user_id = request.data.get("user_id")

            question = Question.objects.create(
                user_id=user_id,
                question_statement=question_statement,
            )

            for topic_id in topic_ids:
                try:
                    topic = Topic.objects.get(topic_id=topic_id)
                    Question_Topic_Table.objects.create(question=question, topic=topic)
                except Topic.DoesNotExist:
                    continue

            return Response(
                {
                    "message": "Question added to topics successfully.",
                    "question_id": question.question_id,
                },
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UnfollowTopicAPIView(APIView):
    def post(self, request, topic_id):
        userId = request.query_params.get("userId")
        user = User.objects.get(id=userId)
        print(user)
        try:
            topic = Topic.objects.get(topic_id=topic_id)
        except Topic.DoesNotExist:
            return Response(
                {"error": "Topic not found."}, status=status.HTTP_404_NOT_FOUND
            )

        if topic in user.followed_topics.all():
            user.followed_topics.remove(topic)
            message = "Unfollowed topic successfully."
        else:
            user.followed_topics.add(topic)
            message = "Followed topic successfully."

        return Response({"message": message}, status=status.HTTP_200_OK)


class QuestionsByTopicAPIView(APIView):
    def get(self, request, topic_id):
        try:
            topic = Topic.objects.get(topic_id=topic_id)
        except Topic.DoesNotExist:
            return Response(
                {"error": "Topic not found."}, status=status.HTTP_404_NOT_FOUND
            )

        questions = Question.objects.filter(topics__in=[topic])

        serializer = QuestionByTopicSerializer(questions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class AnswersByQuestionAPIView(APIView):
    def get(self, request, question_id):
        try:
            question = Question.objects.get(question_id=question_id)
        except Question.DoesNotExist:
            return Response(
                {"error": "Question not found."}, status=status.HTTP_404_NOT_FOUND
            )

        answers = Answer.objects.filter(question=question)

        serializer = AnswerSerializer(answers, many=True)
        print(serializer.data)
        return Response(serializer.data, status=status.HTTP_200_OK)


class TopicListAPIView(APIView):
    def get(self, request):
        topics_with_follow_counts = Topic.objects.annotate(
            follower_count=Count("followers")
        )
        serializer = TopicSerializer(topics_with_follow_counts, many=True)
        return Response(serializer.data)


class TopicPageAPIView(APIView):
    def get(self, request, topic_id):
        print(request)
        try:
            topic = Topic.objects.get(topic_id=topic_id)
        except Topic.DoesNotExist:
            return Response(
                {"error": "Topic not found."}, status=status.HTTP_404_NOT_FOUND
            )

        total_followers = topic.followers.count()

        questions = (
            Question.objects.filter(question_topic_table__topic=topic)
            .annotate(
                total_likes=Count(
                    "question_reaction_table",
                    filter=Q(question_reaction_table__reaction_type=1),
                )
            )
            .order_by("-total_likes")
        )
        paginator = Paginator(questions, 10)
        page_number = request.GET.get("page")

        paginated_questions = paginator.get_page(page_number)

        topic_serializer = TopicSerializer(topic)
        question_serializer = QuestionByTopicSerializer(paginated_questions, many=True)

        response_data = {
            "topic": topic_serializer.data,
            "total_followers": total_followers,
            "questions": question_serializer.data,
            "pagination": {
                "next": paginated_questions.next_page_number()
                if paginated_questions.has_next()
                else None,
                "previous": paginated_questions.previous_page_number()
                if paginated_questions.has_previous()
                else None,
                "count": paginator.count,
            },
        }
        print(response_data)

        return Response(response_data, status=status.HTTP_200_OK)
