---
layout: pages/guide.njk
pageTitle: Media Pool Webhook Push API 
description: Connect your application with MediaPool events
teaserText: "Described in this document are the so-called Webhooks, which can inform third-party applications about modifications to assets in the Media Pool. The basic idea is the following: Third-party applications is notified of changes to assets in near real time, rather than having to perform cyclical scans of the entire inventory to identify such changes."
tags: ['guide']
eleventyNavigation:
    parent: "Guides"
    key: "auth"
    title: "Media Pool Webhook Push API"
    excerpt: "Connect your application with MediaPool events"
    order: -1
permalink: "guides/webhook-push-api/"
bodyClass: "guide"
title: "Media Pool Webhook Push API"
---

##  Introduction and Objectives

The BrandMaker Media Pool is increasingly used by its users as a central repository for all types of assets that are also to be used outside the company. The Media Pool is intended to assume the role of a central application that controls the distribution of assets. It is therefore necessary for the Media Pool to provide powerful APIs that enable users to synchronize and keep stored content and third-party applications up to date.

####   Task Definition

In order to deliver assets in the Media Pool to third-party applications, third-party applications must be able to be notified of changes to relevant assets.

In order to load these assets from the Media Pool, the Media Pool must have APIs for searching and loading metadata and for transferring binary data. This allows users to deploy and keep assets from the Media Pool in their own applications (e.g., CMS, PIM, CRM). In order to achieve the set goals, the Media Pool already provides extensive REST APIs and SOAP APIs. These APIs aren&#39;t described in more detail below. Please refer to the existing documentation.

New and described in this document are the so-called Webhooks, which can inform third-party applications about modifications to assets in the Media Pool. The basic idea is the following: Third-party applications is notified of changes to assets in near real time, rather than having to perform cyclical scans of the entire inventory to identify such changes.

A very comprehensive description of how Webhooks work can be found at [https://requestbin.com/blog/working-with-webhooks/](https://requestbin.com/blog/working-with-webhooks/) and [https://en.wikipedia.org/wiki/Webhook](https://en.wikipedia.org/wiki/Webhook).

For this purpose, the third-party applications should register at the Media Pool. This registration consists of storing a URL (Webhook) that is called by the BrandMaker system as soon as relevant changes have been made to the asset.

All actions performed on an asset by users generate an event. When registering the webhook, the administrator can select one or more of these events. Please note the flow chart Figure 1 - Functional overall structure in chapter 2.

####   Boundary Conditions

It is assumed that the reader or developer on the customer side is familiar with technologies such as http, REST and the programming of web services.

Listed example listings are exemplary created in JAVA, but there is no constraint and no preference for any programming language.

Furthermore, knowledge of the application and configuration of the BrandMaker Media Pool is required. The developer needs administrator access to the Media Pool to be able to make the necessary settings.

In order to retrieve and save data from the Media Pool automatically using a third-party system (e.g. CMS), knowledge of the corresponding development environments and APIs of the third-party system is required. This knowledge is also not covered in this documentation. The third-party system is always represented as a black box in this context.

####   Defining the Context

The offered interfaces are used for near real-time synchronization of the data in the Media Pool with third-party applications. Other purposes are not supported.

**Technical context**

From the point of view of the Media Pool, delivery to a third-party system is referred to as publishing. When the user specifies that an asset is to be published, the asset becomes available for transfer to a third-party system.

Assets can be published to different systems in parallel. Such an external system is referred to as a channel. A channel can be your own CMS, a social media platform, a blog, or even an external system for print preparation.

In order for the third-party application to be able to download the asset in the correct format, one of the available output formats must be specified per channel. For this purpose, a corresponding rendering scheme must be defined in the Media Pool and stored with the channel.

The publishing process therefore includes the following points:

- the selection of the asset
- the definition of one or more channels
- the definition of the rendering scheme
- the determination of the publication period

The following requirements must be met for third-party applications to be notified via webhook of changes to an asset:

- The asset has been published.

- A channel is defined.
- A publication period is defined for the asset and the change to the asset takes place within the publication period.
- A rendering scheme is specified that contains an output format for the asset&#39;s file format.

- A third party application is defined for the channel.

- A valid URL of the third-party application has been filled in.
- The events for which the third-party application is to be notified are defined.

With these settings, the webhook sends notifications to the third-party application as soon as one of the changes registered as an event is made to the asset.

The third-party application that receives the notification can then respond by, for example, loading the new version of the asset or resetting the asset&#39;s title.

##  Structure

A complete system consisting of Media Pool, third-party application and its coupling as well as the necessary interfaces can look like the following example:

![](/assets/guides/webhooks-mediapool/RackMultipart20201017-4-qdsq0p_html_44f838540e6847ef.png)

_Figure 1 - Functional overall structure_

| Name | Description |
| --- | --- |
| Media Pool | BrandMaker Media Pool Instance |
| Third party application | The third-party application that is to receive the released, published assets from the Media Pool |
| Media Pool REST API | API to retrieve data from the Media Pool |
| Webhook-Consumer | The REST endpoint to create within the third-party application that receives the notifications |

##  Description of the Components and Their Function

###   Media Pool

The Media Pool is the active component, which as the leading system can supply third-party applications with data and content. To do this, the Media Pool informs the third-party application via webhook about events that have occurred in the system. The following events can be assigned to a webhook.

####    List of Asset Related Events

The following events report a direct change to an asset:

| \# | Event | Data submitted | Description |
| --- | --- | --- | --- |
| 4 | PUBLISHED | ID, channel ID, rendering scheme, startDate, endDate | An asset has been published to one of the channels. The event fires separateley for each affected channel. |
| 5 | PUBLISHING\_START | ID, channel ID, rendering scheme, startDate, endDate | A publishing time has been reached. The event fires as soon as the asset is due to be published on a particular channel. |
| 6 | PUBLISHING\_END | ID, channel ID, startDate, endDate | A publishing end date has been reached. The event fires as soon as the asset gets depublished on a particular channel. |
| 7 | DEPUBLISHED | ID, channel ID, startDate, endDate | The asset is manually depublished by the user. This is not the same as &quot;PUBLISHING\_END&quot; as in this case the asset is still in a published state but the end of the &quot;To&quot; date has been reached |
| 8 | METADATA\_CHANGED | ID | Event fires if ANY metadata has been changed. This includes all custom attributes (aka &quot;free text fields&quot;). Except: Versions, Variants and related assets. This also does NOT INCLUDE changes to the category tree associations. These are treated separately |
| 9 | VERSION\_ADDED | ID, Version #, channel ID, rendering scheme | Fires if a new version is added |
| 10 | VERSION\_DELETED | ID, Version ##  | Fires, if any version is deleted |
| 11 | VERSION\_OFFICIAL | ID, Version #, channel ID, rendering scheme | Fires, once a version is set to official |
| 12 | VERSION\_UNOFFICIAL | ID, Version ##  | Fires, once a version is set to unofficial |
| 23 | SYNCHRONIZE |   | Send for full sync on manual triggering the web hook. Cannot be selected as automatic triggering event |
| 24 | TEST |   | Test event which only checks whether the endpoint is listening. Cannot be selected as automatic triggering event |

The numbering of the events is not consecutive. Further events will be added in later versions.

The most importants events are PUBLISHED, DEPUBLISHED, PUBLISHING\_START, PUBLISHING\_END, ASSET\_REMOVED. These events monitor the publication of assets.

Please note that the data of an asset is not transmitted to the Webhook (content), only the information about what has changed on an asset. The recipient of the webhook, the consumer, must then decide how this information is processed and how necessary data and content is loaded via the REST API provided by the Media Pool.

The data transmitted in the webhook is sent to the REST endpoint of the consumer in JSON notation using the POST method.

The Media pool assumes that no authentication takes place in the webhook. To ensure that the request was sent by the correct instance, the data is signed with the private key of the BrandMaker system and can be verified using the public key of the BrandMaker system. The public key can be requested via an API of the BrandMaker system, please refer to the administration manual of the BrandMaker system. Since the source URL is also contained in the signed data, a positive validation of the signature verifies the source system.

####   List of Events Showing Changes in the Categories

General category changes also affect the metadata of an asset. However, since no changes have been made to the assets themselves in the event of a change in the categories, events are not sent for the affected assets, but for the corresponding categories.

| \# | Event | Data submitted | Description |
| --- | --- | --- | --- |
| 25 | CATEGORY\_MOVE | ID, Source, Target Category ID | **Attention:** This is actually not a change in the asset, but in the category tree: a sub-category is moved from one parent to another parent. This affects all assets assigned to this sub-category! For sync purposes, where the client is as well synchronizing the category tree, it&#39;s important to know about such _implicit moves_ of assets. |
| 26 | TREE\_CHANGED | no data | If the above &quot;CATEGORY\_...&quot; events cannot be fired due to certain implementation restrictions, the &quot;TREE\_CHANGED&quot; event should be used instead whenever a change to the category tree is saved. This will signal the client that it has to sync the entire categroy tree. The current associations may as well need to be resynchronized, as for instance a category has been removed and the according assets have changed. |

####   Webhook Consumer

To process the data sent by the Media Pool via webhook, the third-party application must provide a REST endpoint whose URL the user must register and activate in the BrandMaker system.

Depending on the event that has occurred, different data objects are sent that contain the necessary information for further processing of the event.

> **Note**
>
> Meta data or content of assets are **not** sent!

The URL of the REST endpoint is called by the Media Pool immediately after the corresponding transaction within the Media Pool is completed. Depending on the system load and the number of events that arrive and are to be transferred, this can take a few seconds.

If an error occurs at the REST end point of the consumer, the Media Pool attempts to resend the event. The repetition rate can be adjusted by the BrandMaker support, please contact the BrandMaker support if necessary. You specify the time interval between two attempts when you register the webhook in Administration.

If all retries fail, the Webhook is locked and no further notifications are sent. In this case, manual intervention is necessary. This is indicated via the status display of the webhook in the BrandMaker system under _\&gt; Administration \> Media Pool \> Webhooks_.

> **Note**
>
> All HTTP response codes outside the range 20x are considered to be faulty. By default, the webhook expects an HTTP response status 202 - Accepted in case of success. Please refer to the implementation recommendations in chapter 3.2.2. Please note that a series of successive errors of the consumer may cause the webhook to be automatically deactivated and must be manually reactivated.

####   Structure of Transmitted Data

In principle, the data sent to the webhook has the following structure:

``` xquery
{
    "data": "{\"customerId\": \"una-nho-eie\",\"systemId\": \"821-574-160\",\"baseUrl\": \"https://is-dev2.brandmaker.com/\",\"events\": [ { \"assetId\": \"3467\", \"eventData\": [{ \"channelId\": \"PUBLIC_LINKS\", \"startDate\": null, \"endDate\": null, \"renderingScheme\": 856}], \"eventType\": \"PUBLISHED\", \"eventTime\": 1552667068052 }]}",
    "signature": "sdlk.................fhsfgjhg"
}
```

- data – contains the actual event data JSON object as a string
- signature – contains the signature of the data element

In the further course of the document only the decoded part of the data element is considered:

``` xquery
1	{
2		"customerId": "id",
3		"systemId": "id",
4		"baseUrl": "url",
5		"events": [{
6			"assetId": "id",
7			"eventData": [{
8				"channelId": "PUBLIC_LINKS",
9				"startDate": null,
10				"endDate": null,
11				"renderingScheme": "id"
12			}],
13			"eventType": "PUBLISHED",
14			"eventTime": "UTC"
15		}]
16	}
```

To optimize throughput, several events occurring in succession are combined in the Media Pool in one call. Therefore, the events element contains an array of the events that have occurred.

The eventData element contains different data depending on the type of event, see the table of events.

Since the user can publish an asset on several different channels, this element also contains an array with one data object per addressed channel.

**Content of JSON object**

| Element | Description |
| --- | --- |
| customerId | Unique customer number in format 111-111-111 (alphanumeric) |
| systemID | Unique System ID in format abc-def-ghi (alphanumeric) |
| baseUrl | Web address of system for API calls by 3rd party application |
| assetId | Asset ID of the affected asset(s) (without prefixed M-) |
| channelId | ID pf publication channel. By default Media Pool has two fixed channels: SHARING and PUBLIC\_LINKS. See the Media Pool Administration Manual. |
| renderingScheme | ID of the desired output format of the asset. This is either preset in the channel or specified for each channel when publishing. |
| eventType | Event, see chapter 3.1 |
| eventTime | Effective time of the event as UTC time stamp |

####   Implementation Recommendations

In principle, the consumer to be created must have good performance and respond relatively quickly, since the Media Pool only waits a limited time for the response and otherwise classifies the call as faulty (timeout).

Since several requests can arrive at the same time and these can also arrive for several events, we strongly recommend asynchronous processing in the following schematic steps:

1. Acceptance of the request
2. Formal validation of the data

- Verification of the signature
- Formatting the Event Object
- Entry in internal queue

3. Reply to Media Pool

Tests have shown that in this way a response is in principle possible within 50-100 milliseconds (JAVA, JMS, Active-MQ).

An internal queue consumer can then record the actual processing of the events.

![](/assets/guides/webhooks-mediapool/RackMultipart20201017-4-qdsq0p_html_5d868841ed9c8d3e.png)

_Figure 2 - Principle sketch webhook consumer_

##  Relevant REST APIs for synchronization

To retrieve the effective data of an asset from the Media Pool, the Media Pool provides a comprehensive REST API.

All API endpoints require authentication. This is currently done as Basic Authentication. BrandMaker recommends setting up access to the APIs of a non-personal, technical user whose password is always valid.

Please note that in one of the next versions of BrandMaker, the authentication of the APIs will be changed centrally to the oAuth2 standard in connection with the BrandMaker Fusion feature set.

The following REST APIs are of interest in connection with this document:

| REST Resource | Description |
| --- | --- |
| AssetSearchRestService | Search for assets. This is also recommended for pulling required metadata for a specific Asset ID, since the scope of the returned data can be configured via the call. |
| FileGenerationTaskRestService
 DownloadRestService | These two resources create the appropriate rendering for the contents of an asset. Note that rendering an asset can be time-consuming. For this reason, a task is first created (_FileGenerationTask_) and this can be queried with the _DownloadRestService_ to see if the asset is rendered in the desired format. The ID of the requested rendering scheme serves as a basis. |
| FileResourceRestService | Provides detailed information about an asset&#39;s stored file format. |
| AssetResourceVersionRestService | Detailed information about the versioning of an asset. The resource _FileGenerationTaskRestService_ expects information about the version of the asset to be delivered, which can be determined here. |

Detailed information on the individual resources of the REST API as well as further endpoints can be found within the BrandMaker system under _\&gt; Administration \> System Information \> API Descriptions_.

##  Test of Consumer

During creation you can test your new webhook consumer via the Media Pool. To do this, create a webhook with the valid address of the consumer. Note that this address must be resolved and must be accessible from outside via the internet. This is usually not the case for your local computer.

Go to the _Test_ tab in the administration of the webhook and click on the _Send Test_ button:

![](/assets/guides/webhooks-mediapool/RackMultipart20201017-4-qdsq0p_html_2957cca6c7de0c06.png)

A corresponding event TEST (see chapter 3.1) without user data is sent to your consumer and the return status is stored in the log.

Please note that in the Media Pool, the events are also generated asynchronously. It is therefore possible that manually triggered events (test, manual trigger) only actually arrive at the consumer after a few seconds, depending on the system load.

##  Loading an Existing Data Pool

When your webhook is complete, it receives events for modifications to the assets according to the registration.

However, this does not apply to assets published before the Webhook was created. To avoid having to republish them all, use the SYNCHRONIZE event, which is sent to all assets that meet the conditions.

Please note that this sends the corresponding events to your webhook for all assets ever published and currently valid in the system. The events are sent in clusters of multiple assets at once (200 per request). Nevertheless, a high system load is to be expected.

To do this, go to the _Manual Trigger_ tab in the Webhook&#39;s administration dialog:

![](/assets/guides/webhooks-mediapool/RackMultipart20201017-4-qdsq0p_html_f6bd7f368a92361e.png)

##  Possible Error Sources

Im Folgenden werden einige mögliche Symptome und deren mögliche Ursachen als Hilfe bei der Implementierung aufgelistet:

**The request is not received on the target system.**

- The Webhook contains an invalid or incorrect URL. ***Solution***: If necessary, correct the URL entered in the BrandMaker system under _\&gt; Administration \> Media Pool \> Webhooks_ for this webhook.
- The BrandMaker system cannot reach the third-party application with the webhook. ***Solution***: Make sure that the third-party application with the webhook is accessible via the Internet. If necessary, check the DNS resolution and the routing.

**The request is received, but returns an http status unequal 20x.**
- The format of the data does not correspond to the format expected by the Webhook or there is a fundamental implementation error. ***Solution***: Check and correct your implementation if necessary.

**An event is not sent to the webhook.** 

- The webhook has not subscribed to the corresponding event. ***Solution***: Check and correct the webhook settings under \> _Administration \> Media Pool \> Webhooks_.
- The corresponding asset is not published. Please note that only published assets are processed via this API. ***Solution***: Search for the asset in the Media Pool. Check and correct the publication of the asset if necessary.

**The webhook is automatically deactivated.** 
- Your consumer delivers too many errors in succession. ***Solution***: Check the stability of your implementation, especially in the processing of the various events enabled in the registry.

**Media Pool reports that timeouts occur.**
- Processing within the Webhook consumer takes too long. ***Solution***: Check the Webhook consumer and follow the instructions in chapter 3.2.2.

**Modifications to the assets are not sent to the Webhook, even though the corresponding events are set up and the asset is published.**
- The specified rendering scheme has changed and does not contain a valid output format for the file format of the asset. ***Solution***: Change the rendering scheme specified for the publication under _\&gt; Administration \> Media Pool \> Download \> Rendering Scheme_. Alternatively, select a different rendering scheme for the asset&#39;s publication that includes a suitable output format.
- The specified rendering scheme was deleted. ***Solution***: Select a different rendering scheme for the asset&#39;s publication that includes a suitable output format.
**An asset is automatically reported as DEPUBLISHED before its expiration date and without user interaction.**
- The asset has been moved to the VDB recycle bin. In this case the publication of the asset will be automatically stopped from version 6.6 on.
**The webhook consumer cannot access the Media Pool API.**
- No physical connection can be established. ***Solution***: Check the network connections of your server and the BrandMaker system.
**The Media Pool API returns an HTTP status 40x.**
- The technical user with which the API authenticates itself to the BrandMaker system is invalid or does not have sufficient rights. ***Solution***: Check the user account of the technical user under \> Administration \> Users &amp; Groups \> Users.
- Information about the requested resource (asset, rendering scheme, file information, ...) is not available. ***Solution***: Please refer to the corresponding API documentation.


For further possible causes of errors in connection with the Media Pool API, please refer to the corresponding documentation of the individual REST endpoints used.

##  Examples

####   Webhook Rest Endpoint

Below is an example implementation of a REST endpoint based on Java 8, Apache Sling 11, and JAX-R:

``` java
/**
 *
 * <p>Web Hook which retrieves events generated by Media Pool in order to sync assets between Media Pool and WebCache.
 * <p>This service is not doing anything else than making formal checks on the request and then queue the request to the importer queue!
 * <p>As this API does not require any login, it is crucial to validate the request signature!
 *
 * @author axel.amthor@brandmaker.com
 * @copyright BrandMaker GmbH, Karlsruhe, 2019
 */
@Service(value={MediaPoolWebHook.class}) // service on interface in order to hide class specific implementations!
@Component(
        label = "MediaPool WebHook Service",
        description = "Captures requests with Media Pool Sync Events",
        metatype = true
)
@Properties({
	@Property(
			label="WebHook job creation",
    		description="Whether sync jobs should be created if an event is passed in. Defaults to false (!)",
			name="MediaPoolWebHook.Jobcreation.active",
			boolValue = false
			),
	@Property(
			label="WebHook service active",
    		description="Whether WebHook Service is activated. Defaults to false (!)",
			name="MediaPoolWebHook.Service.active",
			boolValue = false
			)
})
public class MediaPoolWebHookImpl implements MediaPoolWebHook
{

	private final static boolean DEBUG = true;

	/** The Constant LOGGER. */
    private final static Logger LOGGER = LoggerFactory.getLogger(MediaPoolWebHook.class);

    /** Whether this service should be activated or not */
    private boolean serviceActive = false;

    /** false means requests are accepted but not queued */
    private boolean queueActivated = false;

	@Reference
	ReaderService readerService;

	@Reference
	WebCacheTenantProvider tenantProvider;

	@Reference
	ResourceResolverHelper resourceResolverHelper;

	@Reference
   private JobManager jobManager;

	/**
	 * Activate this service component and init global stuff.
	 *
	 * @param bundleContext
	 * @param properties
	 */
	@Activate
	public void activate(final BundleContext bundleContext, final Map<String, Object> properties)
	{
		serviceActive  = PropertiesUtil.toBoolean(properties.get("MediaPoolWebHook.Service.active"), serviceActive);
		queueActivated  = PropertiesUtil.toBoolean(properties.get("MediaPoolWebHook.Jobcreation.active"), queueActivated);

		LOGGER.info(WebCacheUtils.MARK, "MediaPool WebHook Service started");
	}

	/* (non-Javadoc)
	 * @see com.brandmaker.webcache.core.asset.jaxrs.mediapool.MediaPoolWebHook#mpWebHook(javax.servlet.http.HttpServletRequest, javax.servlet.http.HttpServletResponse, java.lang.String)
	 */
	@Override
	public Response mpWebHook(HttpServletRequest request, HttpServletResponse response, String requestBody)
	{
		long start = System.currentTimeMillis();
		
		if ( !serviceActive ) {
			LOGGER.info(WebCacheUtils.MARK, "Service inactive" );
			return Response.status(Response.Status.NOT_IMPLEMENTED)
	                .entity( "{\"error\": \"This service is inactive. Please check WebCache Configuration.\" } " )
	                .type(MediaType.APPLICATION_JSON).encoding("UTF-8")
	                .build();
		}

		LOGGER.info(WebCacheUtils.MARK, "Start processing webhook request from " + request.getHeader(WebCacheConstants.EFFECTIVE_CLIENTIP_ADDRESS_HEADER) );
		
		JSONObject eventObject = new JSONObject();
		JSONArray responseArray = new JSONArray();
		String[] copyProps = { MediaPoolEvent.PROP_CUSTOMERID, MediaPoolEvent.PROP_SYSTEMID, MediaPoolEvent.PROP_BASEURL };
		
		try
		{
			JSONObject requestObject = new JSONObject(requestBody);
			
			String data = requestObject.getString("data");
			String signature = requestObject.getString("signature");
			
			/*
			 * validate signature
			 */
			// implementation specific!

			/*
			 * parse data property and parse the inner structure as JSON
			 */
			JSONObject dataObject = new JSONObject(data);
			JSONArray eventArray = dataObject.getJSONArray("events");
			
			if ( DEBUG ) LOGGER.info(WebCacheUtils.MARK, "decoded data: " + dataObject.toString(4));
			/*
			 * process event array
			 */
			for ( int n = 0; n < eventArray.length(); n++ )
			{
				eventObject = eventArray.getJSONObject(n);
				
				/*
				 * these props need to go into each event, as within the subsequent queue, there is no "batch" but single events
				 */
				for ( String prop : copyProps ) {
					if ( dataObject.has(prop) )
						eventObject.put(prop, dataObject.getString(prop));
				}
				
				/*
				 * validate event data
				 */
				MediaPoolEvent event = requestValidation(eventObject);
				
				if ( event != null )
				{
					/*
					 * Test event, we just respond with a 202 and event data as content,
					 * no futher processing!
					 */
					if ( event.getEvent() == MediaPoolWebHookEvents.Event.TEST ) {
						responseArray.put(event.toJson());
					}
					else {
					
						/*
						 * if the event is not dedicated to one of the two WebCache Channels, it must not be queued
						 * if not, we just guzzle up the event, send an "accepted" back but actually are doing nothing
						 */
						if ( !event.mustHaveChannel() || event.isWebCacheChannel() ) 
						{
							/*
							 * Check whether we know the tenant by system and customer ID
							 */
							WebCacheTenant tenant = tenantProvider.getTenantBySystemAndCustomerId(event.getSystemId(), event.getCustomerId() );
			
							if ( tenant == null ) {
								eventObject.put("error",  "System ID and/or Customer ID unknown.");
								throw new MediaPoolSyncJobException("No tenant found.");
							}
							event.setTenantId(tenant.getAccountId());
			
							if ( DEBUG ) LOGGER.info(WebCacheUtils.MARK, "MP Sync Request: " + event.toJson().toString(4));
			
							// this user is running the import later
							Principal userPrincipal = request.getUserPrincipal();
							if ( userPrincipal != null )
								event.setUser(userPrincipal.getName());
							else
								event.setUser("anonymous");
			
							if ( queueActivated || eventObject.optBoolean("BenGurion") )
								addMediaPoolSyncJob(event);
							else
								LOGGER.info(WebCacheUtils.MARK, "MP Sync Request but queueing deactivated");
			
							responseArray.put(event.toJson());
						}
						else {
							
							eventObject.put("error",  "not a webcache channel: " + event.getChannelsFromPayload() );
							responseArray.put(eventObject);
							
							LOGGER.info(WebCacheUtils.MARK, "not a webcache channel: " + event.getChannelsFromPayload() );
						}
					}
				}
				else {
					return Response.status(Response.Status.BAD_REQUEST)
			                .entity( "{\"error\": \"Problems parsing event data.\" } " )
			                .type(MediaType.APPLICATION_JSON).encoding("UTF-8")
			                .build();
				}
			}
			
			return Response.status(Response.Status.ACCEPTED)
	                .entity( responseArray.toString(4) )
	                .type(MediaType.APPLICATION_JSON).encoding("UTF-8")
	                .build();

		}
		catch (JSONException e)
		{
			LOGGER.error("A JSON error occured", e);
			LOGGER.info(WebCacheUtils.MARK, "(1) Invalid MP Sync Request: " + requestBody );
			return Response.status(Response.Status.BAD_REQUEST)
	                .entity( "{\"error\": \"invalid JSON in request.\" } " )
	                .type(MediaType.APPLICATION_JSON).encoding("UTF-8")
	                .build();
		}
		catch (MediaPoolSyncJobException e)
		{
			LOGGER.error("An error occured", e);
			LOGGER.info(WebCacheUtils.MARK, "(2) Invalid MP Sync Request: " + requestBody );
			try
			{
				return Response.status(Response.Status.BAD_REQUEST)
				        .entity( eventObject.toString(4) )
				        .type(MediaType.APPLICATION_JSON).encoding("UTF-8")
				        .build();
			}
			catch (JSONException e1)
			{
				LOGGER.error("A JSON error occured", e1);
			};
		}
		catch (Exception e)
		{
			LOGGER.error("A general error occured", e);
			LOGGER.info(WebCacheUtils.MARK, "(4) Invalid MP Sync Request: " + requestBody );
			return Response.status(Response.Status.BAD_REQUEST)
	                .entity( "{\"error\": \"Request not processed.\" } " )
	                .type(MediaType.APPLICATION_JSON).encoding("UTF-8")
	                .build();
		}
		finally
		{
			LOGGER.info(WebCacheUtils.MARK, "Finished processing webhook request from " + request.getHeader(WebCacheConstants.EFFECTIVE_CLIENTIP_ADDRESS_HEADER) +
					" in " + (System.currentTimeMillis() - start) + " msec");
		}

		LOGGER.info(WebCacheUtils.MARK, "(3) Invalid MP Sync Request: " + requestBody );
		return Response.status(Response.Status.BAD_REQUEST)
                .entity( "{\"error\": \"Request not processed.\" } " )
                .type(MediaType.APPLICATION_JSON).encoding("UTF-8")
                .build();


	}


	/**
	 * Validates the request data and returns an event Object if valid, otherwise null.
	 * Error messages are put back into therequest object as "error": "message..."
	 *
	 * @param requestObject
	 * @return true if data is valid, false otherwise
	 * @throws JSONException
	 *
	 */
	private MediaPoolEvent requestValidation(JSONObject requestObject) throws JSONException, MediaPoolSyncJobException, Exception
	{
		MediaPoolEvent event = null;
		try
		{
			event = new MediaPoolEvent(requestObject);
		}
		catch (Exception e)
		{
			LOGGER.error(WebCacheUtils.MARK, requestObject.toString(4) );
			LOGGER.error(WebCacheUtils.MARK, e.getMessage(), e);
			requestObject.put("error", e.getMessage());
			throw e;
		}

		return event;
	}


	/**
	 * Create an importer Job to sync the assigned information
	 * @param asset
	 * @param request
	 * @throws MediaPoolSyncJobException
	 * @throws Exception
	 */
	private void addMediaPoolSyncJob(MediaPoolEvent event) throws MediaPoolSyncJobException
   {
        // add necessary objects for conversion:
        final Map<String, Object> eventMap = event.toMap();
        final HashMap<String, Object> props = new HashMap<String, Object>();
        props.put(PROP_MEDIAPOOLEVENT,  eventMap);

        Job job = jobManager.createJob(IMPORTER_JOB_TOPIC).properties(props).add();

        if ( job == null ) {
        	LOGGER.error("No Job created ");
        	throw new MediaPoolSyncJobException("No job created");
        }
        else
        	LOGGER.info("Job " + job.getId() + " created in: " + job.getQueueName() );
   }
```
