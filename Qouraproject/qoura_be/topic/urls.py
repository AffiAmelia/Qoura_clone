from django.urls import path
from .views import (
    AddTopicAPIView,
    AddQuestionToTopicAPIView,
    UnfollowTopicAPIView,
    QuestionsByTopicAPIView,
    AnswersByQuestionAPIView,
    TopicListAPIView,
    TopicPageAPIView,
)

urlpatterns = [
    # Add other URL patterns for your app views here
    path("add_topic/", AddTopicAPIView.as_view(), name="add_topic"),
    path(
        "add_question_to_topic/",
        AddQuestionToTopicAPIView.as_view(),
        name="add_question_to_topic",
    ),
    path(
        "topics/unfollow/<uuid:topic_id>/",
        UnfollowTopicAPIView.as_view(),
        name="unfollow-topic",
    ),
    path(
        "api/topics/<uuid:topic_id>/questions/",
        QuestionsByTopicAPIView.as_view(),
        name="questions_by_topic",
    ),
    path(
        "questions/<uuid:question_id>/answers/",
        AnswersByQuestionAPIView.as_view(),
        name="answers_by_question",
    ),
    path("topics/", TopicListAPIView.as_view(), name="topic-list"),
    path("topic/<uuid:topic_id>/", TopicPageAPIView.as_view(), name="topic-page"),
]
