import django_filters
from .models import Course, Presentation, Video

class CourseFilter(django_filters.FilterSet):
    owner = django_filters.CharFilter(
        field_name='owner__user__username',
        lookup_expr='exact'
    )

    enrolled = django_filters.CharFilter(
        field_name='enrolled_profiles__user__username',
        lookup_expr='exact',
        label='Filter by enrolled student username'
    )

    class Meta:
        model = Course
        fields = ['owner', 'title', 'enrolled']


class PresentationFilter(django_filters.FilterSet):
    owner = django_filters.CharFilter(
        field_name='owner__user__username',
        lookup_expr='exact'
    )
    course = django_filters.UUIDFilter(  # maps ?course=<uuid>
        field_name='course__id', lookup_expr='exact'
    )

    class Meta:
        model = Presentation
        fields = ['owner', 'course']

class VideoFilter(django_filters.FilterSet):
    owner = django_filters.CharFilter(
        field_name='owner__user__username',
        lookup_expr='exact'
    )
    course = django_filters.UUIDFilter(  # maps ?course=<uuid>
        field_name='course__id', lookup_expr='exact'
    )

    class Meta:
        model = Video
        fields = ['owner', 'course']

