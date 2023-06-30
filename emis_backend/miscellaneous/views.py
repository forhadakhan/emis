# miscellaneous/views.py 


from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView, RetrieveUpdateAPIView
from .serializers import ContactSerializer
from .models import ContactMessage


class ContactView(APIView):
    def post(self, request, format=None):
        serializer = ContactSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': "Your message was sent, thank you!"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class ContactMessagePartialUpdateView(RetrieveUpdateAPIView):
    queryset = ContactMessage.objects.all()
    serializer_class = ContactSerializer
    lookup_field = 'id'  # Use the appropriate lookup field based on your model

    def patch(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # # Update any additional fields during the partial update 
    # def perform_update(self, serializer):
    #     serializer.save(is_answered=True)  



class ContactMessageListView(ListAPIView):
    queryset = ContactMessage.objects.all()
    serializer_class = ContactSerializer


