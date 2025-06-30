from django.contrib import admin

from .models import Course, Video, Presentation, Exam, StudentExam, WrongExamAnswer

admin.site.register(Course)
admin.site.register(Video)
admin.site.register(Presentation)
admin.site.register(Exam)
admin.site.register(StudentExam)
admin.site.register(WrongExamAnswer)