from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated

from .models import Profile, Project
from .serializers import ProfileSerializer, ProfileCreateSerializer, ChangePasswordSerializer, ProjectCreateSerializer, ProjectSerializer
from .permissions import IsOwnerOrAdmin, IsTeacherOrProjectOwner

from authentication.services import get_tokens_for_user

from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .filters import ProjectFilter

class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.select_related('user').all()
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrAdmin]
    lookup_field     = 'user__username'
    lookup_url_kwarg = 'username'
    filter_backends = [ SearchFilter, OrderingFilter ]
    search_fields   = ['user__username','user__first_name','user__last_name','bio']
    ordering_fields = ['user__username','date_created']

    def get_serializer_class(self):
        if self.action == 'create':
            return ProfileCreateSerializer
        return ProfileSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        return super().get_permissions()

    def create(self, request):
        '''
        Creates a Profile and associates a user to it
        '''
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        profile = serializer.save()

        tokens = get_tokens_for_user(
            username=request.data['username'],
            password=request.data['password1']
        )
        
        return Response({
            'profile': ProfileSerializer(profile, context=self.get_serializer_context()).data,
            'tokens':  tokens
        }, status=status.HTTP_201_CREATED)

    @action(
        detail=False,
        methods=['post'],
        permission_classes=[IsAuthenticated],
        url_path='password'
    )
    def change_password(self, request):
        """
        POST /api/profiles/password/
        {
          "old_password": "...",
          "new_password1": "...",
          "new_password2": "..."
        }
        """

        password_change_ser = ChangePasswordSerializer(
            data=request.data,
            context={'request': request}
        )
        password_change_ser.is_valid(raise_exception=True)
        password_change_ser.save()

        return Response({'detail': 'Password updated.'}, status=status.HTTP_200_OK)
    
class ProjectViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Projects:
    - Students can create (upload) their own projects.
    - Teachers can list all projects for a course, download the file, and assign grades.
    - Permissions enforced by IsTeacherOrProjectOwner.
    """
    queryset = Project.objects.select_related('student__user','course').all()
    permission_classes = [IsAuthenticated, IsTeacherOrProjectOwner]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = ProjectFilter
    search_fields    = ['title', 'description', 'student__user__username', 'course__title']
    ordering_fields  = ['created_at', 'student__user__username', 'grade']

    def get_serializer_class(self):
        if self.action == 'create':
            return ProjectCreateSerializer
        return ProjectSerializer

    def get_queryset(self):
        """
        - If user is a teacher: allow filtering by ?course=<course_id> to see all student projects for that course.
        - If user is a student: return only their own projects.
        """
        user_profile = self.request.user.profile
        qs = super().get_queryset()

        if user_profile.role == Profile.Role.TEACHER:
            course_id = self.request.query_params.get('course')
            username  = self.request.query_params.get('username')
            if course_id:
                qs = qs.filter(course_id=course_id)
            if username:
                qs = qs.filter(student__user__username=username)
            return qs
        # Student: ignore query params, return only self
        return qs.filter(student=user_profile)

    def perform_destroy(self, instance):
        """
        Only teachers can delete a project (enforced by permission).
        """
        instance.delete()
