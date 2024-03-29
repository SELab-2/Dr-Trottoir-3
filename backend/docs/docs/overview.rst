========
Overview
========

Dr. Trottoir is a service company that manages trash cleanup schedules for apartments and similar
housing buildings. To do so, Dr. Trottoir hires students to enter these buildings on assigned dates who
take out the necessary trash. Because multiple buildings can share the same trash cleanup schedule, these
buildings will be grouped in a route. A student who is out to perform his work will visit all buildings in
a route and take out the trash for each of these buildings. To achieve a higher efficiency, the order of
visits in these routes are determined beforehand.

While a student is out on a route, a supervisor, called a super student, will be able to track which
buildings have been visited. Super students will also have administrator rights to add, remove or
manage routes, student schedules, and student permissions. A building owner (syndicus) will be
given an account, which can also be added or removed by super students.

In order for super students to verify the students are actually doing their work, students will have to take
pictures with their phones and upload them to the database. At least one photo must be taken for arriving
at a building, for taking out the trash, and for leaving the building, per building. If a student encounters
any troubles at a building they can create an issue to report this to the super students, which will notify the
building's syndicus.

User
****

A user represents a user account from the django framework. Asides from the user model, there are
also user roles. These roles are: student, super student, admin and syndicus. Theoretically a user can
have multiple roles, although in practice it is expected for a user to only have one. The user role
determines the permissions of the actions the user can take, according to the endpoint specifications.

Location Group
**************

A location group is a grouping of objects, such as users or buildings, by a location. Concretely, these
will be cities, such as Ghent or Antwerp. Location groups are useful for separating permissions in
different locations: a super student from Ghent does not need to know the schedule assignments of a
student in Leuven for example.

Building
********

A building represents a physical building that students can visit. Buildings are limited to a location
group and contain an address and pdf guide. This guide can be used by students to navigate around the
building, if needed.

Garbage Type
************

A garbage type is a type of garbage that can be cleaned up, such as plastic or cardboard.

Garbage Collection Schedule
***************************

A garbage collection schedule is a description of a type of garbage needs to be taken
out in a building on what day. For example, a garbage collection schedule entry can say that
on March 1st 2024 in building X the plastic will need to be taken out. Because buildings
will commonly only have a specific set of garbage types, a combination of building and garbage
type can be templated, to speed up the creation of future garbage collection schedules.

Schedule Definition
*******************

A schedule definition describes a route containing the buildings a user must visit in one night. A
schedule definition is limited to a location group and contains the name of the route. The list of
buildings is stored in the ScheduleDefinitionBuilding model, which also contains the order in which
the building must be visited in a route.

Schedule Assignment
*******************

A schedule assignment is the assignment of a route (schedule definition) on a specific day to a specific
student. This model is the main component for handling student schedules.

Schedule Work Entry
*******************

A schedule work entry contains an image a student has taken to prove they have done a certain task in their
route, such as leaving a building they have finished. It also contains which user has taken the picture,
at what time they have taken the picture, and where (at what building) they have taken the picture.

Issue
*****

An issue is any sort of comment a student can make on a building during their route. Super students can
verify if this is an actual issue and notify the syndicus if needed. If a syndicus has received an issue
and have solved it, they can mark the issue as resolved. Students are able to add one or more images to
their issues.

Additional info
***************
A full overview of the endpoint descriptions can be found on the drive storage.

Below is a graphical overview of the used tables.

.. image:: ../images/domainmodel.png
