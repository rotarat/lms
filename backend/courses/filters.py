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

    not_enrolled = django_filters.BooleanFilter(method='filter_not_enrolled')

    class Meta:
        model = Course
        fields = ['owner', 'title', 'enrolled', 'not_enrolled']

    def filter_not_enrolled(self, queryset, name, value):
        """
        If value is True, exclude any Course where request.user.profile
        is already in course.enrolled_profiles.
        """
        if not value:
            return queryset
        user = getattr(self.request, 'user', None)
        if not user or not hasattr(user, 'profile'):
            return queryset

        profile = user.profile
        # Exclude courses where this profile appears in enrolled_profiles.
        return queryset.exclude(enrolled_profiles=profile)


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


