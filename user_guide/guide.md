# Gebruikers Handleiding

- [Gebruikers Handleiding](#gebruikers-handleiding)
  - [Gebruikers](#gebruikers)
    - [Aanmelden](#aanmelden)
    - [Toevoegen](#toevoegen)
  - [Gebouwen](#gebouwen)
    - [Toevoegen](#toevoegen-1)
    - [Aanpassen](#aanpassen)
    - [Templates](#templates)
    - [Ophalingen plannen](#ophalingen-plannen)
    - [Publieke link](#publieke-link)
  - [Routes](#routes)
    - [Toevoegen](#toevoegen-2)
    - [Aanpassen](#aanpassen-1)
  - [Planner](#planner)
    - [Ronde plannen](#ronde-plannen)
    - [Ronde herhalen](#ronde-herhalen)
    - [Ronde verwijderen](#ronde-verwijderen)
  - [Live Routes](#live-routes)

## Gebruikers

[Terug](#gebruikers-handleiding)

### Aanmelden

Wanneer een gebruiker voor het eerst de webapp bezoekt, komt hij op de aanmeldpagina.
Mocht een gebruiker zijn wachtwoord vergeten zijn, is er een optie om het wachtwoord te resetten. Hiervoor wordt een 
mail gestuurd naar het mailadres.
![Aanmeldpagina](screenshots/gebruikers/0_login.jpg)
Als we in de zijbalk naar de gebruikerspagina navigeren, kunnen we voor elke gebruiker een planning en een geschiedenis 
zien, en ook een grafiek met het aantal gewerkte uren.
![Gebruikerspagina](screenshots/gebruikers/3_detail.jpg)

### Toevoegen

Om een gebruiker toe te voegen drukken we op de knop in de rechterbovenhoek.
![Gebruiker toevoegen](screenshots/gebruikers/1_toevoegen.jpg)
Er komt een popup om de nodige gegevens in te vullen. Kies als gebruikersnaam het mailadres van de gebruiker. 
Hier kunnen we ook het type van het account kiezen.
![Gebruiker toevoegen popup](screenshots/gebruikers/2_toevoegen2.jpg)

#### Syndicus
Als we een syndicus toevoegen kunnen we een lijst aan gebouwen selecteren dat deze syndicus heeft.
![Gebruiker toevoegen syndicus](screenshots/gebruikers/4_toevoegen_syndicus.jpg)

#### Student
Als we een student toevoegen kunnen we selecteren of het over een superstudent gaat of niet. 
We moeten dan ook een regio selecteren.
![Gebruiker toevoegen syndicus](screenshots/gebruikers/5_toevoegen_student.jpg)

## Gebouwen

[Terug](#gebruikers-handleiding)

Als we in de zijbalk naar de gebouwenpagina navigeren krijgen we de lijst van gebouwen te zien.
We kunnen in de top bar zoeken op gebouwen, kiezen op welk veld we willen sorteren en filteren 
op regio
![Gebouwenpagina](screenshots/gebouwen/01_page.jpg)
Als we een gebouw selecteren, krijgen we de details te zien, zoals het adres, de handleiding, 
de publieke link, de foto. Eronder zien we de templates, de planning, en de problemen die de 
studenten hebben aangegeven.
![Gebouw detail](screenshots/gebouwen/08_detail_manual.jpg)

### Toevoegen

Om een gebouw toe te voegen selecteren we de knop in de rechterbovenhoek.
![Gebouw toevoegen](screenshots/gebouwen/02_toevoegen.jpg)
Er komt een popup tevoorschijn om de gegevens in te vullen. Elke gebouw moet een coördinaat  
hebben zodat studenten het altijd vinden. Door op de knop naast het adres te drukken, zal de 
applicatie zelf proberen het coördinaat te vinden. De blauwe marker op de kaart kan ook versleept 
worden om het coördinaat aan te passen.
![Gebouw toevoegen coördinaat](screenshots/gebouwen/03_toevoegen_locate.jpg)
Het is mogelijk om één of meerdere syndici te koppelen aan een gebouw.
![Gebouw toevoegen syndicus](screenshots/gebouwen/04_toevoegen_syndicus.jpg)
Door op de handleiding knop te klikken kunnen we een pdf-bestand uploaden voor dit gebouw.
![Gebouw toevoegen handleiding](screenshots/gebouwen/05_toevoegen_handleiding.jpg)
We kunnen ook een afbeelding van de gevel uploaden zodat studenten het gebouw makkelijk herkennen.
![Gebouw toevoegen afbeelding](screenshots/gebouwen/06_toevoegen_afbeelding.jpg)
Druk op *toevoegen* om het gebouw toe te voegen.
![Gebouw toevoegen](screenshots/gebouwen/07_toevoegen_complete.jpg)

### Aanpassen

Druk op het potlood icoontje naast de naam van een gebouw om het gebouw te wijzigen.
![Gebouw aanpassen](screenshots/gebouwen/09_bewerk.jpg)
De popup om een gebouw aan te passen werkt op dezelfde manier als die om een gebouw toe te voegen.
![Gebouw aanpassen popup](screenshots/gebouwen/10_bewerk_form.jpg)

### Templates

Templates zijn herbruikbare planningen. Zo kan er voor een gebouw bijvoorbeeld een zomerplanning 
en een winterplanning zijn. Templates hebben geen vaste lengte.
Om een nieuwe template te maken, druk op het plusje onderaan de lijst van templates.
![Template toevoegen](screenshots/gebouwen/11_template_add.jpg)
In de popup kan een bestaande template geselecteerd worden om te bewerken, of kan een nieuwe naam 
getypt worden om de nieuwe template te maken.
![Template maken](screenshots/gebouwen/12_template_create.jpg)
Klik op een bepaalde weekdag om aan te duiden wat er op die dag moet gebeuren.
![Template dag](screenshots/gebouwen/13_template_day.jpg)
Duid aan welk afval moet buitengezet worden.
![Template afval types](screenshots/gebouwen/14_template_garbage_types.jpg)
Deze template zegt dus dat op de derde dag REST en PMD buiten gezet moet worden.
![Template opslaan](screenshots/gebouwen/15_template_save.jpg)
Een template kan ook aangepast worden door op het potlood icoontje te drukken.
![Template aanpassen](screenshots/gebouwen/16_template_edit.jpg)

### Ophalingen plannen

Om ophalingen te plannen kunnen we een template plannen door bij een bepaalde week op het eerste 
icoontje te klikken.
![Template plannen](screenshots/gebouwen/17_plan_template.jpg)
Kies een template om te plannen.
![Template kiezen](screenshots/gebouwen/18_plan_template_select.jpg)
De ophalingen die gepland zouden worden, worden overzichtelijk weergegeven.
![Template plannen preview](screenshots/gebouwen/19_plan_template_selected.jpg)
Het is ook nog mogelijk om de datum waarop de template gepland wordt aan te passen. In de meeste 
gevallen zal dit wel een maandag zijn.
![Template plannen datum](screenshots/gebouwen/20_plan_template_date.jpg)
Druk op *opslaan* om de ophalingen toe te voegen.
![Template plannen opslaan](screenshots/gebouwen/21_plan_template_save.jpg)
De ophalingen zijn nu zichtbaar in de planning.
![Template gepland](screenshots/gebouwen/22_plan_template_planned.jpg)
Het is ook mogelijk om individuele ophalingen toe te voegen door op het tweede icoontje te 
drukken.
![Ophaling plannen](screenshots/gebouwen/23_plan_sched.jpg)
Kies de datum en het afval type. Druk op opslaan om de ophaling toe te voegen.
![Ophaling plannen opslaan](screenshots/gebouwen/24_plan_sched_save.jpg)

### Publieke link

Om een publieke link voor een gebouw te (her)genereren, druk op het herlaadicoontje.
![Link genereren](screenshots/gebouwen/25_link_generate.jpg)
De link kan makkelijk gekopieerd worden door op het ander icoontje te drukken.
![Link kopiëren](screenshots/gebouwen/26_link_copy.jpg)
De publieke pagina is nu beschikbaar.
![Link pagina](screenshots/gebouwen/27_link_page.jpg)

## Routes

[Terug](#gebruikers-handleiding)

De routes pagina is waar definities van routes kunnen aangemaakt en aangepast worden.
In de top bar kunnen we zoeken op routes, sorteren op verschillende velden en filteren op regio. 
![](screenshots/routes/0_page.jpg)
Door op een route te klikken zien we alle details van deze route. Men ziet de gebouwen, hun
volgorde en de planningen.
![](screenshots/routes/3_detail.jpg)
### Toevoegen
Een route toevoegen kan door op de "route toevoegen" knop rechts boven te klikken. Dan moet een
naam en regio ingegeven worden.
![](screenshots/routes/1_toevoegen.jpg)
![](screenshots/routes/2_toevoegen_save.jpg)
### Aanpassen
De route kunnen we dan aanpassen. Een gebouw toevoegen doen we door op het plusje onderaan te 
klikken. Daar kunnen we zoeken door gebouwen en er eentje selecteren om toe te voegen.
![](screenshots/routes/4_building_add.jpg)
![](screenshots/routes/5_building_add_dialog.jpg)

De volgorde van gebouwen kan aangepast worden door ze te verslepen tot in de gewenste volgorde.
![](screenshots/routes/6_building_drag.jpg)
![](screenshots/routes/7_building_remove.jpg)

## Planner
[Terug](#gebruikers-handleiding)

De planner page is waar de planning week per week opgesteld kan worden.

![](screenshots/planner/0_page.jpg)

In de top-bar hier kunnen we selecteren van welke regio we de planning willen aanpassen.

![](screenshots/planner/1_regio_select.jpg)
### Ronde plannen

Om een student te plannen op een bepaalde route op een bepaalde dag klikken we op het hokje dat overeenkomt
met de dag en route dat we willen plannen. Dit opent een venster waar we de student kunnen
kiezen die deze route zal moeten doen.

![](screenshots/planner/2_task_add.jpg)
![](screenshots/planner/3_task_add_save.jpg)

Geplande studenten kunnen ook verschoven worden naar een andere dag en/of route.

![](screenshots/planner/6_task_drag.jpg)
### Ronde herhalen

Indien een bepaalde student een route voor meerdere dagen na elkaar zou moeten doen kunnen 
we ook gewoon op het plusje rechts boven zijn blokje klikken om hem of haar voor een 
extra dag te plannen.

![](screenshots/planner/4_task_extend.jpg)
### Ronde verwijderen

Een planning van een student verwijderen kan door op het kruisje rechts boven het blokje te klikken.

![](screenshots/planner/5_task_remove.jpg)

## Live Routes
[Terug](#gebruikers-handleiding)

De Live routes pagina toont alle routes die op een bepaalde dag gedaan worden. Standaard wordt de 
huidige dag getoond, maar door op het kalendericoontje rechts boven te klikken kan men een andere 
dag kiezen. Zo kan men toekomstige en voorbije dagen ook zien wat er moet gebeuren en gebeurd is.

### Filters
Net zoals op andere pagina's kan men sorteren op verschillende velden. Dit kan op de naam van de route,
de regio, de naam van de student en hoeveel procent van de route afgewerkt is.

Men kan ook filteren op regio, en op routes die nog bezig zijn of al compleet zijn.
![](screenshots/live_routes/0_page.jpg)

### Details view
Door op een route te klikken open je de details van deze route. Hier kan je zien wat er al gedaan is en de foto's die de
student geüpload heeft.

![](screenshots/live_routes/detail.jpg)
