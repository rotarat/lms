from django.contrib import admin
from .models import Profile, PersonalData, Project

admin.site.register(PersonalData)
admin.site.register(Project)

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'role']  # or however you identify a profile
    search_fields = ['user__username', 'user__email']
    list_filter = ['role']
    
    filter_horizontal = ['enrolled_courses']