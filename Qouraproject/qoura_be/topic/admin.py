from django.contrib import admin
from .models import (
    Topic,
    Question,
    Question_Topic_Table,
    Question_Reaction_Table,
    Answer,
    Answer_Reaction_Table,
)

admin.site.register(Topic)
admin.site.register(Question)
admin.site.register(Question_Topic_Table)
admin.site.register(Question_Reaction_Table)
admin.site.register(Answer)
admin.site.register(Answer_Reaction_Table)
