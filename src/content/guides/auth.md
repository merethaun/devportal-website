---
layout: pages/guide.njk
pageTitle: Authentification
description: How to Authenticate 3rd Party Applications to your BrandMaker Instance
teaserText: "In order to authenticate a 3rd party application against your BrandMaker Instance and accessing the APIs of the BrandMaker Modules, you need an oAuth2 access token and a refresh token. BrandMaker provides a centralized authentication system for all customers (Centralized Authentication Service - CAS), which implements the the standardized oAuth2 Web Flow."
tags: ['guide']
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
Prerequisits
=============

In order to authenticate a 3rd party application against your BrandMaker
Instance and accessing the APIs of the BrandMaker Modules, you need an
oAuth2 access token and a refresh token. BrandMaker provides a
centralized authentication system for all customers (Centralized
Authentication Service - CAS), which implements the the standardized
[oAuth2 Web Flow](https://oauth.net/2/).

### Required steps
The following steps need to be done in order to register your app and
authenticate and authorize an application user:

1.  Make sure, your BrandMaker Instance is registered as Resource Server
    on the CAS. On questions regarding this, please contact our [Support
    Team](https://www.brandmaker.com/contact/support-ticket/)
2.  [Register your App](#register-your-app) through
    the administration in your BrandMaker Instance
3.  [Initiate the oAuth2](#initiate-the-oauth2) flow to
    authenticate a user for your application
4.  Store your client ID and Client Secret provided in step 2 in a safe
    place, we are not able to recover the secret at any later time!
5.  Store the access token and refresh token provided in step 3 along
    with your app
6.  [Use the tokens](#authenticate-against-the-brandmaker-apis) in order to
    access any of the BrandMaker APIs
7.  Check the expiration time of your access token and [retrieve a new
    one with the refresh token](#request-a-new-access-token-with-the-refresh-token)
    once it is close to expire

All necessary end-point URLs for the flow will be provided in step 2
above. This information is always available in the administration in
your BrandMaker Instance.

## Register your App

### Client ID and Client Secret

In order to connect your application via oAuth2 you will need a client
ID and a client secret. You get access to these the following way:

1.  Log in to your BrandMaker system.
2.  Navigate to your Administration space
3.  On the left, under System Configuration =\> Registered Apps you can
    register a new app. ![](/assets/guides/auth/clientsecret.png)

4.  After you have successfully registered your app, you will be shown a
    screen with your client ID and client secret

### Client Secret

The client secret is only shown immediately after the registration of a client in step 2 above and cannot be recovered afterwards. If the secret is lost, you need to de-register and re-register the app again and all provided tokens are invalidated!

 ![](/assets/guides/auth/clientsecretid.png)

## Initiate the oAuth2

### Refresh Token and Access Token

Now that you have obtained your client ID and client secret, your
application will have to acquire an access token and a refresh token.

In order to acquire your first access token and refresh token, your need
an OAuth2.0 authorization code. In order to acquire this OAuth2.0
authorization code, your app will need to send the client ID and client
secret to the following CAS-URL via GET:

Your user will also be prompted with a login challenge at this point.

### GET Parameters

|Key|Type|Value|
|--- |--- |--- |
|client_id|string|Your client ID from the client registration|
|redirect_uri|string|Redirect Url that was specified during client registration|
|response_type|string|"code"|
|response_mode|string|"query"|
|state|string|[String of 8 characters](https://auth0.com/docs/protocols/state-parameters)|

### Example Request

``` xquery
curl "https://cas.brandmaker.com/oauth2/auth?
    client_id=6274aa2f-a93f-479c-a3b3-62850f8322bd&
    redirect_uri=https%3A%2F%2Foauthdebugger.com%2Fdebug&
    response_type=code&
    response_mode=query&
    state=12345678"
```

 After your application has successfully acquired an oAuth 2.0 authorization code, you can now acquire your refresh token and access token from this CAS-URL via POST: 

 ### POST Parameters

 ``` xquery
curl -d "code=oauth2_authorization_code&\
    client_id=6274aa2f-a93f-479c-a3b3-62850f8322bd&\
    client_secret=your_client_secret&\
    grant_type=authorization_code&\
    redirect_uri=https%3A%2F%2Foauthdebugger.com%2Fdebug%0D%0A" -X POST "https://cas.brandmaker.com/api/v1.0/api/token"
```

Now that your application has acquired its access token and refresh token, it can now make requests to the BrandMaker APIs. In order to access such a BrandMaker resource you need to include your access token in each request in the header "authorization". The token must be prefixed with the keyword "bearer " (with whitespace). For more information regarding bearer tokens you can visit the following [site](https://tools.ietf.org/html/rfc6750).

### Flow Overview

 ![](/assets/guides/auth/flowoverview.png)

## Authenticate against the BrandMaker APIs

In order to authenticate your application against any BrandMaker API,
use the given authentication token from step 3 above.

The token must be put into an [Authorization
header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization)
in the according request:

**Authorization Header in Request to BrandMaker API**
``` xquery
Authorization: Bearer 98w7n98wvetr98vern9t87vq9tz ... c9n4837590nv8eorfpocrw74n87c
```

If the token has expired, an according error message is sent back, which
may differ depending on which internal system you are trying to access.
The response's http status code is always 403.

## Request a New Access Token with the Refresh Token

In order to request a new access token with the refresh token, issue a
request against the token refresh endpoint given in step 2 above:

### POST parameters

|Key|Type|Value|
|--- |--- |--- |
|code|string|OAuth 2.0 authorization code|
|client_id|string|Your client ID from the client registration|
|client_secret|string|Your client secret from the client registration|
|grant_type|string|"authorization_code"|
|redirect_uri|string|Redirect Url that was specified during client registration|

### Example request CURL

 ``` xquery
curl -d "client_id=6274aa2f-a93f-479c-a3b3-62850f8322bd&\
    client_secret=your_client_secret&\
    grant_type=refresh_token&\
    refresh_token=your_refresh_token" -X POST "https://cas.brandmaker.com/api/v1.0/api/token"
```

If you request a new token with the refresh token, you are automatically issued a completely new pair of tokens. The old refresh token expires.

## OAuth Debugger
You can test the OAuth2.0 flow on [https://oauthdebugger.com/](https://oauthdebugger.com/)

### Example input:

 ![](/assets/guides/auth/oauth2.png)
