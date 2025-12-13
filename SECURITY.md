# Sicherheitsrichtlinie

## Unterstuetzte Versionen

Aktuell werden folgende Versionen mit Sicherheitsupdates versorgt:

| Version | Unterstuetzt       |
| ------- | ------------------ |
| 1.x.x   | Ja                 |
| 0.x.x   | Nur kritische Bugs |

## Sicherheitsluecken melden

Wir nehmen die Sicherheit von Zeitstrahl ernst. Wenn du eine Sicherheitsluecke gefunden hast, bitten wir dich, diese verantwortungsvoll zu melden.

### Meldeprozess

1. **Erstelle KEIN oeffentliches GitHub Issue** fuer Sicherheitsluecken.

2. **Sende eine E-Mail** an: `zeitstrahl-security@example.com`

3. **Beschreibe das Problem** so detailliert wie moeglich:
   - Art der Sicherheitsluecke
   - Betroffene Komponenten
   - Schritte zur Reproduktion
   - Moegliche Auswirkungen
   - Falls vorhanden: Vorschlaege zur Behebung

4. **Warte auf unsere Antwort**. Wir bemuehen uns, innerhalb von 48 Stunden zu antworten.

### Was passiert nach der Meldung?

1. **Bestaetigung**: Du erhaeltst eine Bestaetigung deiner Meldung.

2. **Analyse**: Wir analysieren das Problem und bewerten die Schwere.

3. **Loesung**: Wir entwickeln einen Fix und testen ihn gruendlich.

4. **Release**: Der Fix wird veroeffentlicht, idealerweise mit einem Sicherheitshinweis.

5. **Anerkennung**: Wenn du moechtest, nennen wir dich in der Danksagung (es sei denn, du bevorzugst Anonymitaet).

### Verantwortungsvolle Offenlegung

Wir bitten um:

- **Keine Veroeffentlichung** der Sicherheitsluecke, bevor wir sie beheben konnten
- **Keine Ausnutzung** der Luecke ueber das zur Demonstration Notwendige hinaus
- **Keine Zugriffe** auf Daten anderer Benutzer

Im Gegenzug verpflichten wir uns:

- **Zeitnahe Bearbeitung** deiner Meldung
- **Transparente Kommunikation** ueber den Fortschritt
- **Keine rechtlichen Schritte** gegen dich, wenn du dich an diese Richtlinien haeltst
- **Anerkennung** deines Beitrags (wenn gewuenscht)

## Sicherheitsmassnahmen

### Implementierte Sicherheitsmassnahmen

- **Content Security Policy (CSP)**: Schutz vor XSS-Angriffen
- **Input-Validierung**: Alle Benutzereingaben werden validiert
- **Sanitization**: HTML-Eingaben werden bereinigt
- **HTTPS**: Verschluesselte Uebertragung (in Produktion)
- **Keine Cookies**: Anwendung funktioniert ohne Cookies
- **Lokale Speicherung**: Daten bleiben auf dem Geraet des Benutzers

### Best Practices fuer Benutzer

1. **Browser aktuell halten**: Nutze immer die neueste Browser-Version
2. **HTTPS verwenden**: Greife nur ueber https://zeitstrahl.vercel.app zu
3. **Sensible Daten**: Speichere keine hochsensiblen Informationen in Zeitstrahlen
4. **Geteilte Links**: Teile Links nur mit vertrauenswuerdigen Personen

## Bekannte Einschraenkungen

Da Zeitstrahl primaer client-seitig arbeitet:

- **Lokale Daten**: Daten im LocalStorage sind fuer andere Skripte auf der gleichen Domain zugaenglich
- **Export-Dateien**: Exportierte JSON-Dateien enthalten alle Zeitstrahl-Daten unverschluesselt
- **Geteilte Links**: Oeffentlich geteilte Zeitstrahlen sind fuer jeden mit dem Link sichtbar

## Kontakt

- **Sicherheitsfragen**: zeitstrahl-security@example.com
- **Allgemeine Fragen**: GitHub Discussions

---

Vielen Dank, dass du zur Sicherheit von Zeitstrahl beitraegst!
