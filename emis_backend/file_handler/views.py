# file_handler/views.py

import os
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import File
from django.conf import settings
from googleapiclient.errors import HttpError


class GoogleDriveHelper:
    @staticmethod
    def get_service():
        credentials = service_account.Credentials.from_service_account_info(
            settings.GOOGLE_DRIVE_API_CREDENTIALS,
            scopes=['https://www.googleapis.com/auth/drive']
        )
        service = build('drive', 'v3', credentials=credentials)
        return service

    @staticmethod
    def upload_file(file_path, file_name):
        service = GoogleDriveHelper.get_service()
        file_metadata = {'name': file_name}
        media = MediaFileUpload(file_path, resumable=True)
        file = service.files().create(body=file_metadata, media_body=media,
                                      fields='id,webViewLink').execute()

        # Set permissions for the file to make it accessible to anyone with the link
        permission = {
            'type': 'anyone',
            'role': 'reader',
        }
        try:
            service.permissions().create(
                fileId=file['id'], body=permission).execute()
        except HttpError as e:
            # Handle any errors that occur during permission creation
            print('Error creating permission:', e)

        return file.get('webViewLink'), file.get('id')

    @staticmethod
    def delete_file(file_id):
        service = GoogleDriveHelper.get_service()
        try:
            service.files().delete(fileId=file_id).execute()
            print('File deleted successfully.')
        except HttpError as e:
            # Handle any errors that occur during file deletion
            print('Error deleting file:', e)


class FileUploadView(APIView):
    def post(self, request):
        files = request.FILES.getlist('files')
        file_links = []
        file_ids = []

        for file in files:
            file_path = os.path.join(settings.MEDIA_ROOT, file.name)
            with open(file_path, 'wb+') as destination:
                for chunk in file.chunks():
                    destination.write(chunk)

            file_link, file_id = GoogleDriveHelper.upload_file(
                file_path, file.name)
            file_links.append(file_link)
            file_ids.append(file_id)

            # Create a File object and save it to the database
            file_object = File(google_drive_id=file_id)
            file_object.save()

            os.remove(file_path)  # Delete the file from the local filesystem

        return Response({'file_links': file_links, 'file_ids': file_ids})


class FileDeleteView(APIView):
    def delete(self, request):
        file_id = request.data.get('file_id')  # get file_id is passed in the request data
        if not file_id:
            return Response(status=400, data={'message': 'Missing file_id'})
        
        try:
            GoogleDriveHelper.delete_file(file_id)
            return Response(status=204)
        except Exception as e: 
            return Response(status=500, data={'message': str(e)})

