from rest_framework import serializers
from .models import Track

class TrackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Track
        fields = ['id', 'title', 'audio_file', 'duration', 'meta_title', 'meta_artist', 'cover_image', 'uploaded_at']