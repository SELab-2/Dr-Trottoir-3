import django
import django.utils.dateparse
from django.db.models import QuerySet
from rest_framework import status
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from drtrottoir.models import ScheduleAssignment
from drtrottoir.serializers import ScheduleAssignmentSerializer


# TODO permissions


class ScheduleAssignmentListApiView(APIView):
    # TODO permission_classes: list = []

    def get(self, request: Request) -> Response:
        """
        Note: According to the specs, this shouldn't be added. It's currently here
        for testing purposes, and should be removed later on.
        """
        schedule_assignments = ScheduleAssignment.objects.all()
        serializer = ScheduleAssignmentSerializer(schedule_assignments, many=True)
        return Response(data=serializer.data, status=status.HTTP_200_OK)

    def post(self, request: Request) -> Response:
        """ """
        # TODO permissions

        if request.user is None:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        assigned_date = request.data.get("assigned_date")
        schedule_definition = request.data.get("schedule_definition")
        user = request.data.get("user")

        data = {
            "assigned_date": assigned_date,
            "schedule_definition": schedule_definition,
            "user": user,
        }
        serializer = ScheduleAssignmentSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ScheduleAssignmentApiView(APIView):
    # TODO permission_classes: list = []

    def get(self, request: Request, schedule_assignment_id: int) -> Response:
        """ """
        try:
            schedule_assignment = ScheduleAssignment.objects.get(
                id=schedule_assignment_id
            )
        except ScheduleAssignment.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = ScheduleAssignmentSerializer(schedule_assignment)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request: Request, schedule_assignment_id: int) -> Response:
        """ """
        # TODO permissions
        try:
            schedule_assignment = ScheduleAssignment.objects.get(
                id=schedule_assignment_id
            )
        except ScheduleAssignment.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        schedule_assignment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def patch(self, request: Request, schedule_assignment_id: int) -> Response:
        try:
            schedule_assignment = ScheduleAssignment.objects.get(
                id=schedule_assignment_id
            )
        except ScheduleAssignment.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = ScheduleAssignmentSerializer(
            schedule_assignment, data=request.data, partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ScheduleAssignmentDateUserApiView(APIView):
    # TODO permission_classes: list = []

    def get(self, request: Request,
            schedule_assignment_date: str,
            schedule_assignment_user: int,
            ) -> Response:
        """ """
        # Handle invalid date error
        try:
            parsed_date = django.utils.dateparse.parse_date(schedule_assignment_date)
        except ValueError:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        if parsed_date is None:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        try:
            schedule_assignments: QuerySet[
                ScheduleAssignment] = ScheduleAssignment.objects.filter(
                user=schedule_assignment_user, assigned_date=parsed_date
            )
        except ScheduleAssignment.DoesNotExist:
            return Response(status.HTTP_404_NOT_FOUND)

        serializer = ScheduleAssignmentSerializer(schedule_assignments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ScheduleAssignmentsByScheduleDefinition(APIView):
    # TODO permission_classes: list = []

    def get(self, request: Request, schedule_definition_id: int) -> Response:
        """ """
        try:
            schedule_assignments = ScheduleAssignment.objects.filter(
                schedule_definition=schedule_definition_id
            )
        except ScheduleAssignment.DoesNotExist:
            return Response(status.HTTP_404_NOT_FOUND)
        serializer = ScheduleAssignmentSerializer(schedule_assignments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
