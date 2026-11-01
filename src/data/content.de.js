// The German version of content.js. Only the wording lives here: links, images, marks and so on come from
// content.js. Anything left out here just shows in English, so a new project still works before it's translated.
// Projects are found by their `slug`, and screenshot captions by the screenshot's file name.

export const projectsDe = {
  'hackathon-hosting-platform': {
    title: 'Hackathon-Hosting-Plattform',
    module: 'Webentwicklung & Datenbanken',
    description:
      'Eine Website zum Veranstalten von Studierenden-Hackathons, gebaut in einer Vierergruppe. Admins erstellen Gruppen, fügen Aufgaben mit versteckten Testfällen hinzu und starten den Hackathon. Teams schreiben gemeinsam Code in einem geteilten Editor, der sich live aktualisiert, und ihre Python-Abgaben werden automatisch bewertet und erscheinen auf einer Live-Rangliste. Wir haben sie HALT genannt, nach uns vieren (Hannah, Anja, Leo und Tiana), und weil HALT auch ein Assembler-Befehl ist. Externe Bibliotheken waren nicht erlaubt, also ist das gesamte Frontend mit reinem React gebaut.',
    theme:
      'Wir haben uns für einen Retro-Synthwave-Look entschieden: ein Raster in Neonpink und Cyan, ein Sternenhimmel, Glitch-Schriften und glänzende Chromhände und -figuren. Auf der Start-, Anmelde- und Registrierungsseite bewegen sie sich mit einem Parallax-Effekt.',
    captions: {
      'parallax_effect.webm': 'Die Chromhände und -figuren bewegen sich mit einem Parallax-Effekt, wodurch die Start-, Anmelde- und Registrierungsseite ein wenig 3D wirken.',
      'landing.png': 'Die Startseite, auf der zwei Chromhände nach dem „Ready to build?“-Feld greifen.',
      'sign_up.png': 'Registrieren, um an einem Hackathon teilzunehmen.',
      'log_in.png': 'Anmelden. Der Chrom-Typ zeigt dir den Weg zum Formular.',
      'home.png': 'Deine Startseite zeigt deine Gruppeneinladungen, einen Button, um deinen eigenen Hackathon zu starten, und alle deine Gruppen.',
      'pending_invitations.png': 'Alle Gruppeneinladungen in einem Pop-up, in dem du sie annehmen oder ablehnen kannst.',
      'create_group.png': 'Eine eigene Gruppe erstellen: Du wählst einen Namen und ein Icon, richtest den Hackathon ein und lädst Leute ein. Wer die Gruppe erstellt, ist ihr Admin.',
      'your_groups.png': 'Deine Gruppen, aufgeteilt in die, denen du beigetreten bist, und die, die du leitest. Du kannst sie durchsuchen und nach Teamfindung, laufend oder beendet filtern.',
      'group_overview.png': 'Die Übersicht jeder Gruppe zeigt die wichtigsten Zahlen und eine kurze Erklärung, wie die Punktevergabe funktioniert.',
      'group_members.png': 'Alle in der Gruppe und ihre Teams. Teamleiter sind markiert, dein Team ist hervorgehoben, und Leute ohne Team stehen unten.',
      'team_tab.webm': 'Der Teams-Tab, in dem du Einladungen anderer Teams annehmen, dein eigenes Team sehen und alle Teams der Gruppe durchstöbern kannst. Sobald der Hackathon startet, werden die Teams gesperrt.',
      'problems.png': 'Die Aufgabenseite: jede Aufgabe mit Ein- und Ausgabeformat, Beispielen und der Anzahl versteckter Testfälle.',
      'full_screen_editor.png': 'Der geteilte Editor im Vollbild. Das ganze Team kann gleichzeitig programmieren, mit den Dateien links und der Aufgabe rechts. Nur die Teamleitung kann abgeben.',
      'submissions.png': 'Jede Abgabe deines Teams, mit der Anzahl bestandener Tests, der Laufzeit und dem Abgabezeitpunkt.',
      'submission_details.png': 'Ein Klick auf eine Abgabe zeigt das Ergebnis jedes Testfalls, zum Beispiel eine falsche Antwort, ein Zeitlimit oder einen Laufzeitfehler.',
      'leaderboard.png': 'Die Live-Rangliste. Es zählen die besten drei Aufgaben jedes Teams, und die niedrigste Punktzahl gewinnt.',
      'admin_overview.png': 'Dieselbe Gruppe aus Admin-Sicht. Sie wird pink und bekommt einen zusätzlichen Admin-Tab.',
      'admin_panel.png': 'Der Admin-Tab, um Mitglieder einzuladen, offene Einladungen zu prüfen und vor dem Start die Hackathon-Einstellungen zu ändern.',
      'manage_problems.png': 'Admins fügen vor dem Start die Aufgaben hinzu, können sie bearbeiten oder löschen und starten den Hackathon, wenn alle bereit sind.',
      'edit_problems.png': 'Eine Aufgabe bearbeiten: Titel, Beschreibung, Ein- und Ausgabeformat und die Testfälle, die vor den Teams versteckt werden können.',
      'admin_group_members.png': 'Admins sehen alle in der Gruppe und ihr jeweiliges Team, auch wer noch eines braucht.',
      'admin_teams.png': 'Die Teamseite aus Admin-Sicht, mit jedem Team und seiner Leitung.',
    },
  },
  'community-event-volunteer-platform': {
    title: 'Plattform für Community-Events & Ehrenamt',
    note: 'Sechserteam!',
    description:
      'Unser Industrieprojekt mit Entelect, gebaut in einem Sechserteam. Es ist eine Website, auf der gemeinnützige Organisationen Events erstellen, Freiwillige finden und Anwesenheit und Einsatzstunden festhalten können. Ich habe sowohl am Code als auch an der Usability der Seite gearbeitet.',
    captions: {
      'walkthrough.mp4': 'Ein kurzer Rundgang als Freiwillige: die Startseite, Events durchstöbern, My Attendance, My Statistics, die Erfolgsstraße und die Profilseite.',
      'landing_page.png': 'Die Startseite von Neighbourly, mit einer handgezeichneten Nachbarschaft und der Überschrift „The future of volunteering is here“.',
      'animated_logo_intro.png': 'Beim ersten Besuch gibt es ein animiertes Logo-Intro mit Ton, das du überspringen kannst.',
      'landing_page_info.png': 'Die Startseite erklärt, was Neighbourly ist, wie es funktioniert und warum es wichtig ist, jeweils in einer eigenen Farbe.',
      'browse_events.png': 'Events durchstöbern: Du kannst nach Event oder Organisation suchen, nach Anliegen filtern und sehen, wie viele Plätze noch frei sind.',
      'event_signup.png': 'Die Anmeldung für ein Event dauert nur einen Klick. Du bekommst eine Bestätigungs-E-Mail und 24 Stunden vorher eine Erinnerung.',
      'successful_event_signup.png': 'Nach der Anmeldung gibt es Konfetti und einen QR-Code, den du beim Event vorzeigst, außerdem einen Button zum Eintragen in den Google Kalender.',
      'volunteer_attendance.png': 'My Attendance zeigt die Events, bei denen du warst, und deine Einsatzstunden. Du kannst nach teilgenommen, Bestätigung ausstehend, anstehend oder abwesend filtern.',
      'notifications.png': 'Benachrichtigungen zu Anmeldebestätigungen, Erinnerungen und Event-Änderungen, alle an einem Ort.',
      'volunteer_stats.png': 'My Statistics zeigt deine Gesamtstunden, Events, Abzeichen und unterstützten Organisationen sowie deine Stunden pro Monat und pro Anliegen.',
      'volunteer_achievements.png': 'My Achievements: Durch dein Engagement wächst deine eigene kleine Nachbarschaft, mit 30 Gebäuden zum Freischalten.',
      'volunteer_achievement_road.png': 'Jedes Anliegen lässt sein eigenes Gebäude entlang der Straße wachsen, zum Beispiel ein Zelt, das zur Hütte wird, eine Parkbank oder einen Braai-Stand.',
      'volunteer_profile.png': 'Das Profil mit deinen Stunden, Events und Abzeichen sowie Abkürzungen zu deinen Statistiken und QR-Check-ins.',
      'faq.png': 'Ein FAQ für Freiwillige und Organisationen.',
      'organisation_dashboard.png': 'Das Dashboard der Organisation: veranstaltete Events, Freiwillige, Anwesenheitsquote, anstehende Events und eine Tabelle aller Events.',
      'organisation_create_event.png': 'Beim Erstellen eines Events siehst du eine Live-Vorschau der Karte, die Freiwillige zu sehen bekommen.',
      'organisation_qr_code_scanner.png': 'Beim Event scannen die Organisatoren die QR-Codes der Freiwilligen (mit der Kamera, einem hochgeladenen Bild oder durch Eintippen des Codes), und die Anwesenheit wird sofort aktualisiert.',
    },
  },
  'honours-lab-management-app': {
    title: 'App zur Verwaltung des Honours-Labors',
    module: 'Webentwicklung & Datenbanken',
    description:
      'Eine Single-Page-App zur Verwaltung des Computerraums der Honours-Studierenden. Das Herzstück ist ein Sitzplan mit 7 × 10 Plätzen, der zeigt, wer wo sitzt. Dazu kommen Anmeldung, bearbeitbare Profile, ein Q&A-Bereich, nach Tags filterbare Ankündigungen und ein eigenes Farbschema, alles im Browser gespeichert. Externe Bibliotheken waren nicht erlaubt, also ist alles reines React.',
    theme:
      'Ich habe der App ein mittelalterliches Fantasy-Thema gegeben. Studierende heißen „Scholars“ und melden sich auf einer Pergamentrolle an, Sitzplätze sind Throne, Ankündigungen sind Dekrete und Profilbilder sind „Sigils“. Jede Seite hat einen eigenen illustrierten Hintergrund, und alle Texte sind im selben mittelalterlichen Stil geschrieben.',
    captions: {
      'login_screen.png': 'Anmeldung auf einer Pergamentrolle. Studierende heißen „Scholars“.',
      'login_screen_funny_error_msgs.png': 'Ich habe die Fehlermeldungen lustig gemacht. Existiert der Benutzername nicht, heißt es „Guards, seize them! No account exists with that username.“',
      'my_seat.png': 'Einen Platz auf dem 7 × 10 großen Plan wählen. Dein Platz ist hervorgehoben, und mit „Relinquish Throne“ kannst du ihn wieder aufgeben.',
      'other_students_seats.png': 'Ein Klick auf einen belegten Platz zeigt, wer dort sitzt, mit Profilbild und Namen.',
      'announcements_page.png': 'Ankündigungen können als Decree, Warning, Gossip, Feast oder Study Session markiert und nach Tag gefiltert werden.',
      'profile_page_w_customisable_colours.png': 'Auf der Profilseite kannst du die Haupt- und Akzentfarben der App ändern. Jede Seite hat ihren eigenen Hintergrund.',
      'profile_photo_change.png': 'Dein Profilbild wählst du aus mittelalterlichen „Sigils“, zum Beispiel einem Drachen, einem Zauberer, einem Ritter oder einem Narren.',
      'qa_section.png': 'Der Q&A-Bereich „Spill Your Secrets, Scholar“, in dem du Fragen über dich beantwortest und deine Antworten auch wieder löschen kannst.',
    },
  },
  'peer-to-peer-file-sharing': {
    title: 'Peer-to-Peer-Dateifreigabe',
    module: 'Rechnernetze',
    description:
      'Eine anonyme Filesharing-App, bei der Leute Dateien direkt voneinander herunterladen. Ein kleiner Server bearbeitet die Suchen und liefert exakte und ähnliche Treffer. Er bringt zwei Personen über verschlüsselte Schlüssel zusammen, und die Datei geht dann über Tailscale direkt von einer zur anderen, mit Pause, Fortsetzen und einem animierten Fortschrittsbalken. Das gesamte Frontend habe ich ausschließlich mit JavaFX gebaut.',
    theme:
      'Wir haben der App ein Piratenthema gegeben: alte Schatzkarten, Holzschilder, Schädel und Schiffe, und alle Texte sind in Piratensprache. Dateien sind Schätze, und sie zu teilen heißt „distributing plunder among yer crew“. Tippen klingt nach Münzen, Klicken nach Wassertropfen, und der Anmeldebildschirm schwankt wie ein Schiff, während der Soundtrack von Fluch der Karibik läuft.',
    captions: {
      'swaying_login.webm': 'Der Anmeldebildschirm schwankt wie ein Schiff, während im Hintergrund der Soundtrack von Fluch der Karibik läuft.',
      'log_in.png': '„Name yerself or the plank awaits“. Jede getippte Taste macht ein Münzgeräusch und jeder Klick ein Wassertropfen-Geräusch.',
      'client_gui.png': 'Der Client, in dem du Dateien suchst, die Ergebnisse sortierst und filterst, Downloads pausierst oder abbrichst und eigene Dateien teilst. Das Banner oben wechselt zwischen Piraten- und Dateiübertragungs-Zitaten wie „The code is more what you’d call guidelines than actual rules.“',
      'server_gui.png': 'Das Server-Log, umgeben von Oktopussen. Verbindungen, Trennungen, Suchen und Downloads haben jeweils eine eigene Farbe.',
    },
  },
  'parallel-othello-ai': {
    title: 'Parallele Othello-KI',
    module: 'Nebenläufigkeit',
    description:
      'Ein Othello-Spieler, der seine Züge mit Monte-Carlo-Baumsuche auswählt. Mit MPI habe ich die Suche auf mehrere Kerne verteilt, sodass er in derselben Zeit mehr Züge prüfen und besser spielen kann.',
    highlights: [
      'Monte-Carlo-Baumsuche zur Zugauswahl',
      'Mit MPI über mehrere Kerne parallelisiert',
      'Spielt innerhalb eines festen Zeitlimits stärker',
    ],
  },
  'voip-chat': {
    title: 'VoIP-Chat',
    module: 'Rechnernetze',
    description:
      'Eine Voice-over-IP-App. Der Server behält den Überblick, wer online ist, und die Anrufe laufen über UDP direkt zwischen den Gesprächspartnern. Du kannst Einzel- und Gruppenanrufe führen, in Gruppenkanälen chatten, während eines Anrufs schreiben und Sprachnachrichten schicken. Das gesamte Frontend habe ich ausschließlich mit JavaFX gebaut.',
    theme:
      'Wir haben die App wie ein Hackerprogramm aus dem Darknet aussehen lassen: alles in Rot und Schwarz, mit fallenden Nullen und Einsen im Hintergrund und gruseliger Musik beim Laden. Der Anmeldebildschirm begrüßt dich mit „Welcome stranger. Your IP has been noted.“, private Chats sagen dir „Behave...“, und der Server hat sogar einen falschen PANIC-Button.',
    captions: {
      'log_in.png': 'Der Anmeldebildschirm hat einen Darknet-Hacker-Look, mit fallenden Nullen und Einsen und gruseliger Lademusik. Die Schallwellen neben dem HALT-Logo bewegen sich wie eine echte Sprachnachricht.',
      'server_gui.png': 'Das Serverfenster zeigt, wer verbunden ist, und protokolliert alles, was passiert. Außerdem hat es einen PANIC-Button…',
      'flashing_server_panic_button.png': '…der den Bildschirm rot aufblitzen lässt und den ganzen Server herunterfährt. Das ist nur ein Witz.',
      'main_client_gui.png': 'Der Haupt-Client hat einen globalen Chat, Sprachnachrichten und einen Gruppenanruf mit allen auf dem Server. Der Bildschirm blitzt rot, wenn jemand Neues dazukommt, und wenn dich jemand anruft, läuft die Titelmelodie von Ben 10.',
      'whisper_chats.png': 'Whisper-Anrufe und -Nachrichten sind privat und öffnen sich in einem eigenen Fenster.',
      'plagiarism_easter_egg.png': 'Wir haben Easter Eggs versteckt, die auf dem Bildschirm der anderen Person losgehen, wenn du bestimmte Wörter schickst. „Plagiarism“ zeigt ein falsches Turnitin-Pop-up mit 97 % Ähnlichkeit.',
      'cs244_easter_egg.png': '„Trauma“ zeigt die Aufgabenstellung des CS244-Compilerprojekts, von dem alle in der Informatik wissen, dass es richtig schwer ist.',
      'stemlearn_easter_egg.png': '„STEMLearn“ öffnet eine falsche STEMLearn-Anmeldeseite (die Plattform, die Studierende in Stellenbosch für ihre Aufgaben nutzen), und man muss auf den Anmelde-Button drücken, um zurückzukommen.',
      'marks_easter_egg.png': '„Marks“ spielt ein Dun-dun-dunnn ab und blendet die Meldung „marks are out“ ein. „Stellenbosch“ oder „Maties“ spielt „Dis Altyd Lente“, das Studierendenlied von Stellenbosch, und „annoying“ spielt Baby Shark in voller Lautstärke in Dauerschleife.',
    },
  },
  'multicore-process-scheduler': {
    title: 'Multicore-Prozess-Scheduler',
    module: 'Nebenläufigkeit',
    description:
      'Ein Programm in C, das simuliert, wie ein Betriebssystem Prozesse auf einem und auf mehreren Kernen plant. Es begleitet einen Prozess von Anfang bis Ende: Prozesskontrollblock und Speicher einrichten, ihn planen und ausführen und ihn beenden. Außerdem erkennt und behandelt es Deadlocks.',
    highlights: [
      'Scheduling auf einem und auf mehreren Kernen',
      'Prozesskontrollblöcke und Speicherverwaltung',
      'Vollständiger Lebenszyklus von der Initialisierung bis zur Beendigung',
      'Erkennung und Behandlung von Deadlocks',
    ],
  },
  'rbudp-tcp-file-transfer': {
    title: 'RBUDP- & TCP-Dateiübertragung',
    module: 'Rechnernetze',
    description:
      'Unsere Version des Reliable-Blast-UDP-Protokolls zum Versenden von Dateien. Die Datei wird in nummerierten UDP-Paketen verschickt, und über TCP werden verlorene Pakete neu angefordert. Es gibt Sender- und Empfänger-GUIs mit Fortschrittsbalken, und wir haben in Experimenten die Geschwindigkeit mit TCP bei verschiedenen Paketgrößen, Senderaten und Verlustraten verglichen. Das gesamte Frontend habe ich ausschließlich mit JavaFX gebaut.',
    theme:
      'Das Design ist ein Rennen zwischen einer Schnecke und einer Rakete. TCP ist die Schnecke, weil es zuverlässig, aber langsam ist: Es wartet auf die Bestätigung jedes Pakets. RBUDP ist die Rakete, weil es die ganze Datei über UDP schickt und nur für verlorene Pakete noch einmal zurückgeht, was es viel schneller macht. Deshalb winkt auf dem Startbildschirm eine Schnecke, und der Empfänger spielt im Weltall. Im Footer wechseln sich außerdem Witze darüber ab, die unsere Korrektoren zum Lachen bringen sollten.',
    captions: {
      'home_screen.png': 'Der Startbildschirm, auf dem du wählst, ob du Dateien sendest oder empfängst, mit einer winkenden Schnecke. Im Footer bitten wir unseren Dozenten, unsere Note aufzurunden.',
      'send_files.png': 'Der Sender: Du wählst Empfänger, Datei, TCP oder RBUDP und die Paketgröße und siehst dann den Fortschrittsbalken und Live-Werte wie Geschwindigkeit und erneute Übertragungen.',
      'receive_files.png': 'Der Empfänger im Weltall: Du wählst den Speicherort, startest das Lauschen und siehst zu, wie die Datei ankommt.',
    },
  },
  'wistl-compiler': {
    title: 'WISTL-Compiler',
    module: 'Rechnerarchitektur',
    description:
      'Ein in C geschriebener Compiler für WISTL, eine einfache Lehrsprache. Er erledigt jeden Schritt: Scannen, Parsen, Prüfen von Typen und Bedeutung und das Erzeugen von JVM-Bytecode mit Jasmin.',
    highlights: [
      'Lexikalische Analyse (Scanner)',
      'Syntaktische Analyse (Parser)',
      'Semantische Analyse und Typprüfung',
      'Codeerzeugung zu JVM-Bytecode über Jasmin',
    ],
  },
  'quasi-palindromes-in-dna': {
    title: 'Quasi-Palindrome in der DNA',
    module: 'Datenstrukturen & Algorithmen',
    description:
      'Ein Projekt, das das ganze Semester lief und nach Geschwindigkeit bewertet wurde. Es findet Quasi-Palindrome in der DNA (Sequenzen, die fast Palindrome sind und mit genetischer Instabilität zusammenhängen), wenn Buchstaben nebeneinander oder weit voneinander entfernt vertauscht werden können, und es kann Zeichenketten mit einer vorgegebenen Anzahl davon erzeugen.',
    highlights: [
      'Erkennt Quasi-Palindrome bei Vertauschung benachbarter Buchstaben',
      'Verarbeitet mehrere Vertauschungen über beliebige Entfernungen',
      'Erzeugt Zeichenketten mit einer festgelegten Anzahl von Quasi-Palindromen',
      'Bewertet nach Geschwindigkeit und Korrektheit',
    ],
  },
  'eva-website': {
    title: 'Website für eine Make-up-Artistin',
    note: 'mit eigenem Dashboard!',
    linkLabel: 'Website besuchen',
    description:
      'Eine Website für Eva Kritzas, eine Make-up- und Hair-Artistin aus Stellenbosch. Sie hat Seiten für ihre Brautstylings, ihr Portfolio, ihre Leistungen und ein FAQ sowie ein Anfrageformular. Außerdem habe ich ein Dashboard gebaut, das alle Statistiken der Website erfasst: wie viele Leute sie besucht haben, welche Seiten sie angesehen haben, wie sie Eva gefunden haben, wo sie sind, ob sie am Handy oder Computer sitzen und wie schnell die Seite lädt.',
    technical: [
      'Eine statische Astro-Seite ohne Datenbank oder CMS. Die Geschäftsdaten und Texte liegen in einer einzigen Datendatei, sodass die meisten Änderungen keinen Seitencode brauchen.',
      'Das Dashboard ist ein eigenes Vercel-Projekt, geschrieben in reinem TypeScript mit Vite.',
      'Serverless Functions rufen die APIs auf und verwahren die geheimen Schlüssel, sodass nichts Privates den Browser erreicht.',
      'Die Statistiken kommen von der Vercel Web Analytics API und der Geschwindigkeitswert von Google PageSpeed Insights, jeweils 30 Minuten lang wiederverwendet.',
    ],
    captions: {
      'load_in.mp4': 'Der Ladebildschirm: Das Logo zeichnet sich in Gold, Evas Unterschrift schreibt sich, und die schwarze Fläche hebt sich wie ein Vorhang und gibt die Startseite frei.',
      'home.png': 'Die Startseite, mit Eva vor ihrem geprägten Logo.',
      'home_scroll.mp4': 'Beim Scrollen über die Startseite blenden sich Abschnitte ein, die Kanten aus gerissenem Papier ziehen vorbei, und ihre Reels laufen in Handyrahmen.',
      'bridal.png': 'Die Seite für Brautstylings, mit schwarzen Kanten aus gerissenem Papier und goldenen Details, die sich durch die ganze Website ziehen.',
      'bridal_scroll.mp4': 'Beim Scrollen über die Brautseite, von den Schritten einer Buchung bis zu den Polaroids hinter den Kulissen.',
      'how_it_works.png': 'How It Works führt Bräute durch die Schritte, von der ersten Anfrage bis zum Hochzeitsmorgen.',
      'behind_the_scenes.png': 'Hinter den Kulissen, mit Fotos von echten Hochzeitsmorgen, angeordnet wie Polaroids, und Evas Unterschrift.',
      'whats_included.png': 'Was eine Brautbuchung umfasst, neben einer Karte für eine Preisanfrage.',
      'portfolio.png': 'Das Portfolio, ein Fotoraster, das sich nach Kategorien wie Bridal, Editorial oder Brows & Lashes filtern lässt.',
      'portfolio_more.png': 'Weiter unten im Portfolio, wo größere Fotos das Raster auflockern.',
      'portfolio_filter.mp4': 'Die Filter tauschen die Fotos mit einer sanften Überblendung, und ein Klick öffnet ein Foto in voller Größe.',
      'faq.png': 'Das FAQ, mit den Fragen nach Themen gruppiert.',
      'contact.png': 'Das Anfrageformular, mit einer Notiz in der Ecke für alle, die buchen möchten.',
      'dashboard.png': 'Das Dashboard, hier mit Beispielzahlen. Es fasst die Woche in einem Satz zusammen und zeigt darunter die Statistiken.',
    },
  },
  'study-tracker': {
    title: 'Lern-Tracker',
    description:
      'Ein Dashboard, das erfasst, was ich am Computer mache, und daraus etwas Nützliches macht. Mit ActivityWatch sieht es, welche Apps und Websites ich nutze, ermittelt, was davon als Lernen zählt, und zeigt meinen Fortschritt bei meinen Tageszielen. Außerdem hilft es bei meiner Jobsuche, indem es Stellen findet, bewertet, wie gut sie zu mir passen, und meine Bewerbungen festhält, und es enthält meine To-do-Liste, Gewohnheiten, meinen Kalender und Pausenerinnerungen. Es ist komplett auf mich zugeschnitten, jede Funktion ist also da, weil ich sie wirklich wollte.',
    technical: [
      'Eine einzige Python-Datei, die nur die Standardbibliothek nutzt, es gibt also nichts zu installieren. Sie startet ihren eigenen lokalen Webserver.',
      'Die Aktivitäten kommen von der lokalen ActivityWatch-API, und Regex-Regeln, die ich bearbeiten kann, entscheiden, was als Lernen zählt.',
      'Die Stellen kommen von den APIs der Arbeitsagentur, von Arbeitnow und Remotive, und jede wird anhand meines Profils bewertet.',
      'Bewerbungen werden über Google Apps Script in einem Google Sheet gespeichert.',
    ],
    theme:
      'Es passt zur Ästhetik dieses Portfolios, mit denselben Farben Pink und Butter, cremefarbenen Karten, kräftigen Umrissen und harten Schatten.',
    captions: {
      'today.png': 'Die Today-Seite, mit meiner heutigen Lernzeit, meinem Tagesziel und den letzten zwei Wochen nach App. Alle Screenshots zeigen Demodaten.',
      'study.png': 'Die Study-Seite: ein Kalender, wie nah ich meinem Ziel jeden Tag gekommen bin, wann ich meistens lerne und wo meine Woche geblieben ist.',
      'job_ideas.png': 'Job-Ideen: Stellen aus Jobbörsen, jede anhand meiner Skills bewertet und markiert, wenn sie Deutsch verlangt.',
      'todo_habits.png': 'Mein Kalender, meine To-do-Liste und Gewohnheiten, alles auf derselben Seite wie meine Lernzeit.',
    },
  },
}

// Words in the "Tech stack" lists; names of tools and languages stay as they are.
export const stackDe = {
  Encryption: 'Verschlüsselung',
  'Audio streaming': 'Audio-Streaming',
  'Operating systems': 'Betriebssysteme',
  'Monte Carlo Tree Search': 'Monte-Carlo-Baumsuche',
  'String algorithms': 'String-Algorithmen',
  'JVM bytecode': 'JVM-Bytecode',
}

export const skillGroupsDe = {
  Programming: 'Programmierung',
  'Data & Optimisation': 'Daten & Optimierung',
  'Tools & Collaboration': 'Tools & Zusammenarbeit',
}

export const skillsDe = {
  'UI/UX design': 'UI/UX-Design',
  'Product design': 'Produktdesign',
  'User-centred design': 'Nutzerzentriertes Design',
  'Responsive design': 'Responsive Design',
  'x86 Assembly': 'x86-Assembler',
  Agile: 'Agil',
}

// In the same order as `journey` in content.js.
export const journeyDe = [
  {
    place: 'Mossel Bay, Südafrika',
    text: 'Aufgewachsen bin ich in Mossel Bay, einer kleinen Stadt an der Garden Route direkt am Meer. 2021 habe ich an der Point High School mein Matric (das südafrikanische Abitur) mit einem Schnitt von 88 % abgeschlossen.',
    stats: [
      { value: '88 %', label: 'Matric-Schnitt' },
      { value: '≈ 1,6', label: 'deutsche Note' },
    ],
    footnote: 'Deutsche Note, berechnet mit der modifizierten bayerischen Formel, die deutsche Hochschulen verwenden.',
  },
  {
    place: 'Stellenbosch, Südafrika',
    title: 'Universität Stellenbosch',
    text: 'Fürs Studium bin ich nach Stellenbosch gezogen, wo ich Informatik & Operations Research studiere. Dabei habe ich entdeckt, wie sehr ich UI/UX und Frontend-Entwicklung liebe.',
    stats: [
      { value: '77,5 %', label: 'aktueller Schnitt' },
      { value: '≈ 2,3', label: 'deutsche Note' },
    ],
    footnote: 'Deutsche Note, berechnet mit der modifizierten bayerischen Formel, die deutsche Hochschulen verwenden.',
    linkLabel: 'Sieh dir an, was ich dort gebaut habe',
  },
  {
    place: 'Deutschland',
    title: 'Nächster Halt: Deutschland',
    text: 'Als Nächstes geht es nach Deutschland! Ich habe die niederländische Staatsbürgerschaft, kann also ohne Visum in der EU arbeiten, und ich lerne Deutsch, damit ich 2027 dort loslegen kann.',
    stats: [
      { value: '2027', label: 'bereit zum Start' },
      { value: 'EU', label: 'kein Visum nötig' },
    ],
  },
]
