from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.parsers import MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import PlaylistTrack, Track
from .models import Playlist
from .TrackSerializer import TrackSerializer
from .PlaylistSerializer import PlaylistSerializer
from django.views.decorators.csrf import csrf_exempt
from mutagen.id3 import ID3, APIC, TIT2, TPE1
from mutagen.mp3 import MP3
from django.core.files.base import ContentFile
from django.db import models


@api_view(['POST'])
@parser_classes([MultiPartParser])
@permission_classes([IsAuthenticated])
def upload_track(request):
    title = request.data.get('title')
    audio_file = request.FILES.get('audio_file')

    if not audio_file:
        return Response({'error': 'Missing fields'}, status=400)
    
    if not title:
        title = ""
    
    temp_path = f"/tmp/{audio_file.name}"
    with open(temp_path, 'wb+') as f:
        for chunk in audio_file.chunks():
            f.write(chunk)

    try:
        audio = MP3(temp_path, ID3=ID3)

        id3_tags = audio.tags
        meta_title = id3_tags.get("TIT2")
        meta_artist = id3_tags.get("TPE1")
        duration = audio.info.length

        cover_image_data = None
        for tag in id3_tags.values():
            if isinstance(tag, APIC):
                cover_image_data = tag.data
                break

        cover_file = ContentFile(cover_image_data) if cover_image_data else None

    except Exception as e:
        print("Error reading metadata:", e)
        meta_title = None
        meta_artist = None
        cover_file = None
        duration = None

    # Use metadata title if original title is empty
    final_title = (meta_title.text[0] if meta_title else 'Untitled')

    track = Track.objects.create(
        user=request.user,
        title = title,
        meta_title=final_title,
        audio_file=audio_file,
        duration = duration,
        meta_artist=meta_artist.text[0] if meta_artist else 'Unknown',
    )

    if cover_file:
        track.cover_image.save(f"{track.id}_cover.jpg", cover_file)

    return Response({'message': 'Track uploaded', 'track_id': track.id})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def delete_track(request):
    track_id=request.data.get('id')
    if not track_id:
        return Response({"error": "Track ID is required."}, status=400)

    track = get_object_or_404(Track, id=track_id, user=request.user)
    track.delete()
    return Response({"message": "Deleted successfully"})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_tracks(request):
    tracks = Track.objects.filter(user=request.user).order_by('-uploaded_at')
    serializer = TrackSerializer(tracks, many=True)
    return Response(serializer.data)

#########################################################################################

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_playlist(request):
    name = request.data.get('name')

    playlist = Playlist.objects.create(
        user = request.user,
        name = name,
    )

    return Response({"message" : "Playlist created"})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_track_to_playlist(request):
    playlist_id = request.data.get('playlist_id')
    track_id = request.data.get('track_id')

    try:
        playlist = Playlist.objects.get(id=playlist_id, user=request.user)
    except Playlist.DoesNotExist:
        return Response({"error": "Invalid playlist ID"}, status=400)

    try:
        track = Track.objects.get(id=track_id, user=request.user)
    except Track.DoesNotExist:
        return Response({"error": "Invalid track ID"}, status=400)

    if PlaylistTrack.objects.filter(playlist=playlist, track=track).exists():
        return Response({"error": "Track already in playlist"}, status=400)

    # Determine next order index
    last_order = PlaylistTrack.objects.filter(playlist=playlist).aggregate(
        max_order=models.Max('order')
    )['max_order'] or 0
    print("Last order for playlist", playlist.id, "is", last_order)
    PlaylistTrack.objects.create(
        playlist=playlist,
        track=track,
        order=last_order + 1  # So first track gets order 0
    )
    return Response({"message" : "Track is added to playlist"})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_playlists(request):
    playlists = Playlist.objects.filter(user=request.user).order_by('-created_at')
    serializer = PlaylistSerializer(playlists, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_tracks_of_playlist(request):
    playlist_id = request.query_params.get('playlist_id')
    try:
        playlist = Playlist.objects.get(id=playlist_id, user=request.user)
    except Playlist.DoesNotExist:
        return Response({"error": "Invalid playlist ID"}, status=400)
    
    playlist_tracks = PlaylistTrack.objects.filter(playlist=playlist).order_by('-order')
    tracks = [pt.track for pt in playlist_tracks]
    serializer = TrackSerializer(tracks, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def remove_track_from_playlist(request):
    playlist_id = request.data.get("playlist_id")
    track_id = request.data.get("track_id")

    try:
        playlist = Playlist.objects.get(id=playlist_id, user=request.user)
    except Playlist.DoesNotExist:
        return Response({"error": "Invalid playlist ID"}, status=400)

    try:
        track = Track.objects.get(id=track_id, user=request.user)
    except Track.DoesNotExist:
        return Response({"error": "Invalid track ID"}, status=400)

    try:
        playlist_track = PlaylistTrack.objects.get(playlist=playlist, track=track)
    except PlaylistTrack.DoesNotExist:
        return Response({"error": "Track is not in this playlist"}, status=400)
    
    playlist_track.delete()
    return Response({"message" : "Track is deleted from playlist"})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def delete_playlist(request):
    playlist_id = request.data.get("playlist_id")
    try:
        playlist = Playlist.objects.get(id=playlist_id, user=request.user)
    except Playlist.DoesNotExist:
        return Response({"error": "Invalid playlist ID"}, status=400)
    
    playlist.delete()
    return Response({"message" : "Playlist is deleted"})

