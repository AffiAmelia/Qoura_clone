from rest_framework import serializers
from .models import Question, Topic, Answer


class TopicSerializer(serializers.ModelSerializer):
    follower_count = serializers.SerializerMethodField()

    class Meta:
        model = Topic
        fields = [
            "topic_id",
            "topic_name",
            "description",
            "picture",
            "follow_count",
            "created_by",
            "followers",
            "follower_count",
        ]

    def get_follower_count(self, obj):
        return obj.followers.count()


class QuestionSerializer(serializers.ModelSerializer):
    topic_ids = serializers.ListField(child=serializers.UUIDField())

    class Meta:
        model = Question
        fields = ["question_statement", "topic_ids"]


class GetQuestionSerializer(serializers.ModelSerializer):
    topics = TopicSerializer(many=True)

    class Meta:
        model = Question
        fields = ["question_statement", "topics"]


class AnswerSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()

    class Meta:
        model = Answer
        fields = [
            "id",
            "user",
            "username",
            "question",
            "answer_statement",
            "like_count",
            "dislike_count",
        ]

    def get_username(self, obj):
        return obj.user.username


class QuestionByTopicSerializer(serializers.ModelSerializer):
    topic_id = serializers.SerializerMethodField()
    topic_name = serializers.SerializerMethodField()
    answers = AnswerSerializer(many=True, read_only=True)
    top_answers = serializers.SerializerMethodField()

    class Meta:
        model = Question
        fields = [
            "question_id",
            "question_statement",
            "like_count",
            "dislike_count",
            "topic_name",
            "topic_id",
            "answers",
            "top_answers",
        ]

    def get_topic_name(self, question):
        topic = question.topics.first()
        if topic:
            return topic.topic_name
        return None

    def get_topic_id(self, question):
        topic = question.topics.first()
        if topic:
            return topic.topic_id
        return None

    def get_top_answers(self, question):
        answers = Answer.objects.filter(question=question)

        sorted_answers = sorted(answers, key=lambda a: a.like_count, reverse=True)
        top_answers = sorted_answers[:2]

        return AnswerSerializer(top_answers, many=True).data


class AddTopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topic
        fields = ["topic_name", "description", "picture", "created_by"]
