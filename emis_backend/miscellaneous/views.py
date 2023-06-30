# miscellaneous/views.py 

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from .serializers import ContactSerializer
from .models import ContactMessage


class ContactView(APIView):
    def post(self, request, format=None):
        serializer = ContactSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': "Your message was sent, thank you!"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class ContactMessageListView(ListAPIView):
    queryset = ContactMessage.objects.all()
    serializer_class = ContactSerializer


