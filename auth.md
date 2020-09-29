---
layout: pages/guide.njk
pageTitle: BrandMaker Dev Portal
description: Using OAuth 2.0 to Access BrandMaker APIs
eleventyNavigation:
    parent: "Guides"
    key: "auth"
    title: "Authentication"
    excerpt: "How to authenticate"
    order: -1
permalink: "guides/auth/"
bodyClass: "guide"
title: "Authentication"
---
BrandMaker Login für das Web mit dem JavaScript-SDK
=================================================
***Dies ist nur ein Blindtext für Vorführzwecke, der echte Text folgt asap***

Dieses Dokument führt dich durch die Schritte zur Implementierung von BrandMaker Login mit dem [BrandMaker-SDK für JavaScript](/docs/javascript) auf deiner Webseite.

Wenn du als BrandMaker-Nutzer Probleme mit der Anmeldung an deinem Konto hast, besuche unseren [Hilfebereich](https://www.BrandMaker.com/help/292105707596942/).

Bevor du beginnst
-----------------

Du benötigst Folgendes:

*   Ein [BrandMaker-Entwicklerkonto](https://developers.BrandMaker.com/apps/)
    
*   Eine [registrierte BrandMaker-App](https://developers.BrandMaker.com/docs/apps#register) mit konfigurierten Allgemeinen Einstellungen
    
*   Das [BrandMaker JavaScript-SDK](https://developers.BrandMaker.com/docs/javascript)
    

Wenn du, aus welchen Gründen auch immer, unser JavaScript-SDK nicht verwenden kannst, kannst du zum Implementieren von BrandMaker Login [manuell einen Login-Vorgang erstellen](/docs/BrandMaker-login/manually-build-a-login-flow).

Gib deine Umleitungs-URL im App-Dashboard ein.
--------------------------------------------------

Wähle im [App-Dashboard](https://developers.BrandMaker.com/apps) deine App aus und navigiere zu **Produkt hinzufügen**. Klicke auf der Karte **BrandMaker Login** auf **Einrichten**. Wähle im linken Navigationspanel **Einstellungen** und gib unter **Client-OAuth-Einstellungen** deine Umleitungs-URL in das Feld „**Gültige OAuth Redirect URIs** ein, um dich erfolgreich zu authentifizieren.

Prüfe den Login-Status für eine Person
------------------------------------------

Beim Laden deiner Webseite solltest du als Erstes herausfinden, ob eine Person über BrandMaker Login bereits bei deiner Webseite angemeldet ist. Mit dem Aufruf von [`FB.getLoginStatus`](/docs/reference/javascript/FB.getLoginStatus) wird ein Aufruf von BrandMaker ausgelöst, um den Login-Status zu erfahren. BrandMaker ruft dann deine Rückruffunktion mit den Ergebnissen auf.

### Beispielaufruf

``` js
FB.getLoginStatus(function(response) { statusChangeCallback(response); });
```

### Beispiel einer JSON-Antwort

``` js
{ 
    status: 'connected', 
    authResponse: { 
        accessToken: '{access-token}', 
        expiresIn:'{unix-timestamp}', 
        reauthorize_required_in:'{seconds-until-token-expires}', 
        signedRequest:'{signed-parameter}', 
        userID:'{user-id}' 
    } 
}
```

`status` gibt den Login-Status der Person an, die die Webseite verwendet. Der `status` kann einer der Folgenden sein:

|Status Typ|Beschreibung|
|--- |--- |
|connected|Die Person ist bei BrandMaker angemeldet und hat sich bei deiner Webseite angemeldet.|
|not_authorized|Die Person ist bei BrandMaker angemeldet, hat sich aber nicht bei deiner Webseite angemeldet.|
|unknown|Die Person ist nicht bei BrandMaker angemeldet. Du weißt also nicht, ob sie bei deiner Webseite angemeldet ist. Möglicherweise wurde auch zuvor FB.logout() aufgerufen und die Verbindung zu BrandMaker ist deshalb nicht möglich.|

Anmelden einer Person
-------------------------

Wenn ein Nutzer deine Webseite aufruft, aber nicht bei der Webseite oder bei BrandMaker angemeldet ist, kannst ihn über den [Login-Dialog](/docs/BrandMaker-login/overview/#logindialog) zur Anmeldung auffordern. Wenn die Nutzer nicht bei BrandMaker angemeldet sind, werden sie zuerst zur Anmeldung bei BrandMaker aufgefordert und dann zur Anmeldung bei deiner Webseite.

![alt text](https://developers.google.com/identity/protocols/oauth2/images/flows/authorization-code.png "Example Image Title")

Es gibt zwei Möglichkeiten, eine Person anzumelden:

*   Den [BrandMaker Login](#loginbutton)\-Button
    
*   Der [Login-Dialog](#logindialog) über das JavaScript-SDK
    

### A. Login über den Login-Button

Verwende zur Nutzung des Login-Buttons unseren [Plug-in-Konfigurator](/docs/BrandMaker-login/web/login-button) zur [Anpassung des Login-Buttons](/docs/BrandMaker-login/web/login-button) und rufe den Code ab.


### B. Login über den Login-Dialog des JavaScript-SDK

Rufe zur Verwendung deines eigenen Buttons den Login-Dialog mit einem Aufruf von [`FB.login()`](/docs/reference/javascript/FB.login) auf.

FB.login(function(response){ // handle the response });

### Nach zusätzlichen Berechtigungen fragen

Wenn eine Person auf deinen HTML-Button klickt, wird ein Popup-Fenster mit dem Login-Dialog angezeigt. In diesem Dialog kannst du [nach einer Berechtigung](/docs/BrandMaker-login/web/permissions) für den Zugriff auf die Daten einer Person fragen. Der `scope`\-Parameter kann zusammen mit dem `FB.login()`\-Funktionsaufruf übergeben werden. Dieser optionale Parameter ist eine Liste mit [Berechtigungen](/docs/BrandMaker-login/permissions) (durch Kommata getrennt), die eine Person bestätigen muss, damit deine Webseite auf deren Daten zugreifen kann.

#### Beispielaufruf

Mit diesem Beispiel wird die Person, die sich anmeldet, gefragt, ob deine Webseite Berechtigung für den Zugriff auf ihr öffentliches Profil und ihre E-Mail-Adresse erhalten kann.

FB.login(function(response) { // handle the response }, {scope: 'public\_profile,email'});

### Die Antwort des Login-Dialogs verarbeiten

Mit der Antwort, entweder auf die Verbindung oder den Abbruch, wird ein `authResponse`\-Objekt an den Rückruf gesendet, den du festgelegt hast, als du den `FB.login()`\-Aufruf gestartet hast. Diese Antwort kann innerhalb des `FB.login()` erkannt und verarbeitet werden.

#### Beispielaufruf

FB.login(function(response) { if (response.status \=== 'connected') { // Logged into your webpage and BrandMaker. } else { // The person is not logged into your webpage or we are unable to tell. } });

Abmelden einer Person
-------------------------

Melde Nutzer von deiner Webseite ab, indem du die JavaScript-SDK-Funktion `FB.logout()` einem Button oder einem Link hinzufügst.

#### Beispielaufruf

FB.logout(function(response) { // Person is now logged out });

**Hinweis: Mit dieser Funktion wird der Nutzer möglicherweise auch bei BrandMaker abgemeldet.**

#### Interessante Szenarien

1.  Eine Person meldet sich bei BrandMaker danach bei deiner Webseite. Wenn sie sich von deiner App abmeldet, ist sie weiterhin bei BrandMaker angemeldet.
2.  Eine Person meldet sich im Rahmen des Anmeldevorgangs deiner App bei deiner Webseite und bei BrandMaker an. Wenn sie sich von deiner App abmeldet, wird sie auch von BrandMaker abgemeldet.
3.  Eine Person meldet sich im Rahmen des Anmeldevorgangs einer anderen Webseite bei einer anderen Webseite und bei BrandMaker an. Danach meldet sie sich bei deiner Webseite an. Wenn sie sich von einer der beiden Webseiten abmeldet, wird sie auch von BrandMaker abgemeldet.

Außerdem werden mit der Abmeldung von deiner Webseite keine Berechtigungen widerrufen, die die Person deiner Webseite im Rahmen der Anmeldung gewährt hat. Der [Widerruf von Berechtigungen](/docs/BrandMaker-login/permissions#revokelogin) muss separat erfolgen. Konfiguriere deine Webseite so, dass eine Person, die sich abgemeldet hat, den Login-Dialog nicht sieht, wenn sie sich erneut anmeldet.

Vollständiges Codebeispiel
--------------------------

Dieser Code wird geladen und initialisiert das JavaScript-SDK in deine HTML-Seite. Ersetze `{app-id}` durch deine [App-ID](https://developers.BrandMaker.com/docs/apps) und `{api-version}` durch die zu verwendende Graph API-Version. Sofern es keinen speziellen Grund zur Verwendung einer älteren Version gibt, solltest du die aktuellste Version angeben. `v8.0`.


### Weitere Ressourcen

*   Dokumentation zum [Login-Button](/docs/plugins/login-button).
    
*   [`FB.login()`\-Referenz](/docs/reference/javascript/FB.login)
    
*   [`FB.getLoginStatus()`\-Referenz](/docs/reference/javascript.FB.getLoginStatus)
    
*   [JavaScript-SDK-Referenz](/docs/reference/javascript)