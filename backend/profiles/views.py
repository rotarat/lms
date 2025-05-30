from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated

from .models import Profile
from .serializers import ProfileSerializer, ProfileCreateSerializer, ChangePasswordSerializer
from .permissions import IsOwnerOrAdmin

from authentication.services import get_tokens_for_user

from rest_framework.decorators import action

from rest_framework.filters import SearchFilter, OrderingFilter

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
