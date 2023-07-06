# academy/views.py 

from rest_framework import status
from rest_framework.exceptions import NotFound
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response
from rest_framework.views import APIView
from authentication.permissions import IsAdministratorOrStaff

from .models import (
    Designation,
)
from .serializers import (
    DesignationSerializer,
)



class DesignationAPIView(APIView):
    permission_classes = [IsAdministratorOrStaff]

    def get(self, request):
        try:
            designations = Designation.objects.all()
            serializer = DesignationSerializer(designations, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        try:
            serializer = DesignationSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def patch(self, request, pk):
        try:
            designation = get_object_or_404(Designation, pk=pk)
            serializer = DesignationSerializer(designation, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except NotFound:
            return Response({'message': 'Designation not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, request, pk):
        try:
            designation = get_object_or_404(Designation, pk=pk)
            designation.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except NotFound:
            return Response({'message': 'Designation not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)





