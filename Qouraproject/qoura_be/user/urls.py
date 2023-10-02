from django.urls import path
from .views import (
    AboutPageAPIView,
    AnswerQuestionAPIView,
    HomeAPIView,
    LogoutAPIView,
    QuestionFollowedTopicsAPIView,
    SearchQuestionsByTopicAPIView,
    UserLoginView,
    UserProfileAPIView,
    UserRegistrationAPIView,
    ChangePasswordView,
)
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from rest_framework_simplejwt.views import TokenVerifyView
from . import views

urlpatterns = [
    # Other URL patterns for your project
    path("login/", UserLoginView.as_view(), name="user-login"),
    path("", HomeAPIView.as_view(), name="home"),
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/token/verify/", TokenVerifyView.as_view(), name="token_verify"),
    path("register/", UserRegistrationAPIView.as_view(), name="api_register"),
    path("logout/", LogoutAPIView.as_view(), name="logout"),
    path("like-question/", views.like_question, name="like-question"),
    path("like-answer/", views.like_answer, name="like-sanswer"),
    path(
        "questions/followed_topics/",
        QuestionFollowedTopicsAPIView.as_view(),
        name="followed_topics",
    ),
    path(
        "questions/search/",
        SearchQuestionsByTopicAPIView.as_view(),
        name="search_questions_by_topic",
    ),
    path(
        "questions/answer/",
        AnswerQuestionAPIView.as_view(),
        name="answer_question",
    ),
    path("about/", AboutPageAPIView.as_view(), name="about-page"),
    path("profile/<uuid:user_id>/", UserProfileAPIView.as_view(), name="user-profile"),
    path("get-csrf-token/", views.get_csrf_token, name="get-csrf-token"),
    path("change-password/", ChangePasswordView.as_view(), name="change-password"),
]
