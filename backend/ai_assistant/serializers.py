from rest_framework import serializers
from .models import WrongQuizAnswer, AdaptiveQuizSession

class WrongQuizAnswerSerializer(serializers.ModelSerializer):
    distractors_with_rationale = serializers.ListField(
        child=serializers.DictField(
            child=serializers.CharField()
        ),
        required=False,
        help_text="List of {distractor, rationale} for each wrong option"
    )
    reflection_prompt = serializers.CharField(read_only=True)

    class Meta:
        model = WrongQuizAnswer
        fields = [
          "question", "submitted", "correct",
          "distractors_with_rationale", "reflection_prompt", "course", "id", "session",
        ]
        read_only_fields = ["id"]


class WrongQuizAnswerReflectionSerializer(serializers.ModelSerializer):
    """
    Serializer for returning saved reflections once the quiz is finished.
    Includes question text, the student's submitted answer, the correct answer,
    any distractors with rationale, and the stored reflection_prompt.
    """
    class Meta:
        model = WrongQuizAnswer
        fields = [
            "question",
            "reflection_prompt",
        ]
        read_only_fields = fields

class AdaptiveQuizSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdaptiveQuizSession
        fields = "__all__"
        read_only_fields = ["id"]