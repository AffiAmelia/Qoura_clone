import uuid
from django.db import models
from user.models import User
from cloudinary.models import CloudinaryField
from django.core.validators import FileExtensionValidator


REACTION_CHOICES = [
    (1, "Like"),
    (0, "Nothing"),
    (-1, "Dislike"),
]


class Topic(models.Model):
    """Topic model declearation"""

    topic_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    topic_name = models.CharField(max_length=50, unique=True)
    description = models.TextField(
        max_length=500,
    )
    picture = CloudinaryField(
        "image",
        blank=True,
        validators=[FileExtensionValidator(allowed_extensions=["png", "jpg", "jpeg"])],
    )

    follow_count = models.PositiveIntegerField(default=0)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    followers = models.ManyToManyField(User, related_name="followed_topics")

    def __str__(self):
        return self.topic_name


class Question(models.Model):
    """Question model declearaion"""

    question_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="asked_questions"
    )
    question_statement = models.TextField()
    like_count = models.PositiveIntegerField(default=0)
    dislike_count = models.PositiveIntegerField(default=0)
    topics = models.ManyToManyField(Topic, through="Question_Topic_Table")
    liked_by_users = models.ManyToManyField(
        User, related_name="liked_questions", through="Question_Reaction_Table"
    )

    def __str__(self):
        return self.question_statement


class Question_Topic_Table(models.Model):
    """Question-Topic middle model declearaion"""

    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    topic = models.ForeignKey(Topic, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.question} - {self.topic}"


class Answer(models.Model):
    """Answer model declearaion"""

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="answers")
    question = models.ForeignKey(
        Question, on_delete=models.CASCADE, related_name="answers"
    )
    answer_statement = models.TextField()
    like_count = models.PositiveIntegerField(default=0)
    dislike_count = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"Answer: {self.answer_statement} to {self.question.question_statement}"


class Answer_Reaction_Table(models.Model):
    """Answer reaction model declearaion"""

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    answer = models.ForeignKey(Answer, on_delete=models.CASCADE)
    reaction_type = models.IntegerField(choices=REACTION_CHOICES)

    def __str__(self):
        return f"Reaction by {self.user.username} on Answer ID: {self.answer.pk} - Reaction Type: {self.get_reaction_type_display()}"


class Question_Reaction_Table(models.Model):
    """Question reaction model declearaion"""

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    reaction_type = models.IntegerField(choices=REACTION_CHOICES)

    def __str__(self):
        return f"Reaction by {self.user.username} on Question ID: {self.question.pk} - Reaction Type: {self.get_reaction_type_display()}"
