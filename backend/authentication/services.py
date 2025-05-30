from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

def get_tokens_for_user(username, password):
    """
    Obtain tokens for a user
    """
    token_serializer = TokenObtainPairSerializer(data={
        'username': username,
        'password': password,
    })
    token_serializer.is_valid(raise_exception=True)
    return token_serializer.validated_data
