from atb.user import views
from django.urls import include, path
from rest_framework import routers

router = routers.SimpleRouter()

router.register(r"register", views.RegistrationViewSet, basename="register")
router.register(r"login", views.LoginViewSet, basename="login")
router.register(r"logout", views.LogoutViewSet, basename="logout")
router.register(r"profile", views.ProfileViewSet, basename="profile")

urlpatterns = [
    path("", include(router.urls)),
]
