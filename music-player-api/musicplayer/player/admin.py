from django.contrib import admin
from .models import Track, Playlist, PlaylistTrack

# Register your models here.
admin.site.register(Track)
admin.site.register(Playlist)
admin.site.register(PlaylistTrack);