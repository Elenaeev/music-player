from rest_framework import serializers
from .models import Playlist

class PlaylistSerializer(serializers.ModelSerializer):
    track_count = serializers.SerializerMethodField()

    class Meta:
        model = Playlist
        fields = ['id', 'name', 'track_count']

    def get_track_count(self, obj):
        return obj.tracks.count()