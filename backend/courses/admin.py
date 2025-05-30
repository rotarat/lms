from django.contrib import admin

from .models import Course, Video, Presentation

admin.site.register(Course)
admin.site.register(Video)
admin.site.register(Presentation)