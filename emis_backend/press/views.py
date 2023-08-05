# press/views.py

from django.http import Http404
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Media
from .serializers import MediaSerializer



# Custom API view for listing and creating media content
class MediaListCreateView(APIView):
    permission_classes=[IsAuthenticated]
    
    # Handle GET request to retrieve a list of all media content
    def get(self, request):
        media = Media.objects.all()
        serializer = MediaSerializer(media, many=True)
        return Response(serializer.data)

    # Handle POST request to create new media content
    def post(self, request):
        # Add the authenticated user (author) to the request data before serializing
        request.data['author'] = request.user.id
        
        serializer = MediaSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



# Custom API view for retrieving, updating, and deleting media content
class MediaRetrieveUpdateDeleteView(APIView):
    permission_classes=[IsAuthenticated]
    
    # Helper function to get the media object by primary key
    def get_object(self, pk):
        try:
            return Media.objects.get(pk=pk)
        except Media.DoesNotExist:
            raise Http404

    # Handle GET request to retrieve a specific media content by its primary key
    def get(self, request, pk):
        media = self.get_object(pk)
        serializer = MediaSerializer(media)
        return Response(serializer.data)

    # Handle PUT request to update an existing media content
    def put(self, request, pk):
        media = self.get_object(pk)
        serializer = MediaSerializer(media, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Handle DELETE request to delete an existing media content
    def delete(self, request, pk):
        media = self.get_object(pk)
        media.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


