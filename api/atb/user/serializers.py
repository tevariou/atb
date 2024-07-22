from django.contrib.auth import password_validation
from django.contrib.auth.models import User
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["username", "password"]

    def validate_password(self, value):
        password_validation.validate_password(value)
        return value
