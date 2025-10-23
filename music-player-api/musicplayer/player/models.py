import os
from django.db import models
from django.contrib.auth.models import User

class Track(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tracks')
    title = models.CharField(max_length=100)
    audio_file = models.FileField(upload_to='tracks/')
    duration = models.FloatField(blank=True, null=True)
    meta_title = models.CharField(max_length=255, blank=True, null=True)
    meta_artist = models.CharField(max_length=255, blank=True, null=True)
    cover_image = models.ImageField(upload_to='covers/', blank=True, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} by {self.user.username}"
    
    def delete(self, *args, **kwargs):
        if self.audio_file and os.path.isfile(self.audio_file.path):
            os.remove(self.audio_file.path)
        if self.cover_image and os.path.isfile(self.cover_image.path):
            os.remove(self.cover_image.path)

        super().delete(*args, **kwargs)
    
class Playlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='playlists')
    name = models.CharField(max_length=100)
    tracks = models.ManyToManyField(Track, through='PlaylistTrack', related_name='playlists')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} by {self.user.username}"

class PlaylistTrack(models.Model):
    playlist = models.ForeignKey(Playlist, on_delete=models.CASCADE)
    track = models.ForeignKey(Track, on_delete=models.CASCADE)
    order = models.PositiveIntegerField(null=True, blank=True)

    class Meta:
        unique_together = ('playlist', 'track')  # avoid duplicates
        ordering = ['order']