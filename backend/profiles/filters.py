import django_filters
from .models import Project

class ProjectFilter(django_filters.FilterSet):
    owner = django_filters.CharFilter(
        field_name='student__user__username',
        lookup_expr='exact',
        label='Filter by submitting student username'
    )
    course = django_filters.UUIDFilter(
        field_name='course__id',
        lookup_expr='exact',
        label='Filter by course UUID'
    )

    class Meta:
        model = Project
        fields = ['owner', 'course', 'grade']