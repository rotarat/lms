from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.serializers import (
    TokenObtainPairSerializer,
    TokenRefreshSerializer
)
from drf_spectacular.utils import extend_schema, extend_schema_view

#todo
@extend_schema_view(
  token=extend_schema(
    request=TokenObtainPairSerializer,
    responses=TokenObtainPairSerializer
  ),
  refresh=extend_schema(
    request=TokenRefreshSerializer,
    responses=TokenRefreshSerializer
  ),
)

class AuthViewSet(viewsets.GenericViewSet):
    """
    /api/auth/token/   → obtain access+refresh
    /api/auth/refresh/ → refresh access
    """

    @action(
        detail=False,
        methods=['post'],
        authentication_classes=[],    # skip any auth checks
        permission_classes=[AllowAny] # allow anonymous
    )
    def token(self, request):
        serializer = TokenObtainPairSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.validated_data, status=status.HTTP_200_OK)

    @action(
        detail=False,
        methods=['post'],
        authentication_classes=[],
        permission_classes=[AllowAny]
    )
    def refresh(self, request):
        serializer = TokenRefreshSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.validated_data, status=status.HTTP_200_OK)
