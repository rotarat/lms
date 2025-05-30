"""
URL configuration for core project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from profiles.views import ProfileViewSet
from ai_assistant.views import QuizServiceViewSet, ChatbotServiceViewSet
from authentication.views import AuthViewSet
from courses.views import (
    CourseViewSet,
    VideoViewSet,
    PresentationViewSet,
    ExamViewSet,
    StudentExamViewSet
)
from rest_framework.routers import DefaultRouter

from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
    SpectacularRedocView,
)
from django.conf    import settings
from django.conf.urls.static import static

router = DefaultRouter()

router.register('auth', AuthViewSet, basename='auth')
router.register('profiles', ProfileViewSet, basename='profile')
router.register('courses', CourseViewSet, basename='course')
router.register('videos', VideoViewSet, basename='course-videos')
router.register('presentations', PresentationViewSet, basename='course-presentations')
router.register('ai/quiz', QuizServiceViewSet, basename='quiz')
router.register('ai/chatbot', ChatbotServiceViewSet, basename='chatbot')
router.register('exams', ExamViewSet, basename='exam')
router.register('student/exams', StudentExamViewSet, basename='studentexam')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path(
      'api/schema/swagger-ui/',
      SpectacularSwaggerView.as_view(url_name='schema'),
      name='swagger-ui'
    ),
    path(
      'api/schema/redoc/',
      SpectacularRedocView.as_view(url_name='schema'),
      name='redoc'
    ),
    path('api/', include(router.urls)),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)