from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from drtrottoir.serializers import ScheduleAssignmentSerializer

from drtrottoir.serializers import IssueSerializer
from drtrottoir.models import Issue, Building, ScheduleAssignment

# TODO permissions


class ScheduleAssignmentListApiView(APIView):
    permission_classes: list = []

    def post(self, request, *args, **kwargs):
        """
        """
        # TODO permissions
        request_user = request.user
        if request_user is None:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        assigned_date = request.data.get('assigned_data')
        schedule_definition = request.data.get('schedule_definition')
        user = request.data.get('user')

        data = {
            'assigned_data':  assigned_date,
            'schedule_definition': schedule_definition,
            'user': user
        }
        serializer = ScheduleAssignmentSerializer(data=data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ScheduleAssignmentApiView(APIView):
    permission_classes: list = []

    def get(self, request, schedule_assignment_id, *args, **kwargs):
        """
        """
        # TODO permissions
        schedule_assignment = ScheduleAssignment.objects.get(id=schedule_assignment_id)
        if schedule_assignment is None:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = ScheduleAssignmentSerializer(
            data=schedule_assignment, partial=True)
        if serializer.is_valid():
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, schedule_assignment_id, *args, **kwargs):
        """
        """
        # TODO permissions
        schedule_assignments = ScheduleAssignment.objects.filter(
            id=schedule_assignment_id)
        schedule_assignments.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def patch(self, request, schedule_assignment_id, *args, **kwargs):
        schedule_assignment = ScheduleAssignment.objects.get(id=schedule_assignment_id)
        serializer = ScheduleAssignmentSerializer(
            data=schedule_assignment, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ScheduleAssignmentDateUserApiView(APIView):
    permission_classes: list = []

    def get(self, request, schedule_assignment_id, schedule_assignment_date, *args, **kwargs):
        """
        """
        schedule_assignment = ScheduleAssignment.objects.filter(id=schedule_assignment_id,
                                                                assigned_date=schedule_assignment_date)
        serializer = ScheduleAssignmentSerializer(
            data=schedule_assignment, partial=True)
        if serializer.is_valid():
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ScheduleAssignmentsByScheduleDefinition(APIView):
    permission_classes: list = []

    def get(self, request, schedule_definition_id, *args, **kwargs):
        """
        """
        schedule_assignments = ScheduleAssignment.objects.filter(
            schedule_definition=schedule_definition_id)
        serializer = ScheduleAssignmentSerializer(
            data=schedule_assignments, partial=True
        )
        if serializer.is_valid():
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# class IssuesListApiView(APIView):
#     permission_classes: list = []

#     def get(self, request, *args, **kwargs):
#         """
#         """
#         issues = Issue.objects
#         serializer = IssueSerializer(issues, many=True)
#         return Response(serializer.data, status=status.HTTP_200_OK)

#     def post(self, request, *args, **kwargs):
#         """
#         """
#         request_user = request.user

#         if request_user is None:
#             return Response(status=status.HTTP_401_UNAUTHORIZED)

#         # TODO - check user permissions

#         building_id = request.data.get('building_id')
#         # building_instance = Building.objects.get(id=building_id)

#         data = {
#             'building': building_id,
#             'message': request.data.get('message'),
#             'from_user': request_user.id
#         }

#         serializer = IssueSerializer(data=data, partial=True)

#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
