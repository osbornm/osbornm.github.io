---
layout: post
title: Introducing Browsers Providers in ASP.NET 4
date: 2010-03-11 22:16
author: Matthew Osborn
comments: true
header-img: "img/post-bg-code.png"
---
In ASP.NET there is a concept of <em>Browser Capabilities,</em> they define what the device that issued the request to the site is capable of doing. For instance things like “<em>Supports JavaScript</em>” and “<em>Supports Frames</em>”, they also provide other meta information about the device such as the Name and version number. I’ll be the first to say that most of the values that are in there are no longer really useful. For example that is a property called “Is AOL”, yes I’m not kidding but at some point in time you wanted to know these things. I’m not going to spend any more time talking about what <em>Browser Capabilities</em> But if you don’t know you might consider watching <a href="http://www.asp.net/learn/videos/video-368.aspx" target="_blank">this</a> before continuing. Also, you might want to check out the <a href="http://mdbf.codeplex.com/" target="_blank">Mobile Device Browser File</a> on codeplex.

Okay so what is the big deal with the Browser Providers? In previous versions you had two options if you wanted to modify or extend how ASP.NET determined the devices capabilities. The first is to modify the Machine level browser file in the framework directory. The second is to add a .browser file to the App_Browsers folder in the website, which gave you website level control. If you look at the <a href="http://msdn.microsoft.com/en-us/library/ms228122.aspx" target="_blank">File Scheme</a> for the .browser files you will quickly see how this could be a problem if you wanted to do any dynamicish stuff because it was just a flat file.

Okay so now you understand the problem you can understand how Browser Providers fix the problem. They are a special type that is registered in application wide that has methods that are executed on each request and allow you to add, remove, or modify capabilities in the browser capabilities collection. The easiest way to do this is to inherit from our default provider and override the methods.


<div class="wlWriterSmartContent" id="scid:9ce6104f-a9aa-4a17-a79f-3a39532ebf7c:ccbed909-1836-4504-8ede-47743a1e5dac" style="margin: 0px; display: inline; float: none; padding: 0px;">
<div style="font-family: 'Courier New', courier, monospace; color: #000; font-size: 10pt; border: #000080 1px solid;">
<div style="background: #ddd; overflow: auto;">
<ol style="padding-bottom: 0px; margin: 0px 0px 0px 2em; padding-left: 5px; padding-right: 0px; background: #ffffff; padding-top: 0px;">
    <li>public class CustomProvider: HttpCapabilitiesDefaultProvider</li>
    <li style="background: #f3f3f3;">{</li>
    <li>    public override HttpBrowserCapabilities GetBrowserCapabilities(HttpRequest request)</li>
    <li style="background: #f3f3f3;">    {</li>
    <li>        HttpBrowserCapabilities caps = base.GetBrowserCapabilities(request);</li>
    <li style="background: #f3f3f3;">        caps.Capabilities["Used www"] = request.RawUrl.Contains("www.");</li>
    <li>        return caps;</li>
    <li style="background: #f3f3f3;">    }</li>
    <li>}</li>
</ol>
</div>
</div>
</div>


In this example I am just looking at the url that was used to make the request and seeing if the device/user put “www.” in front of the request. Not really useful but it is a demo. Also, remember that this is executed for each request so the code that goes in here should be <strong><em>Very</em></strong> speedy. You do not want to hold up the request while the provider goes and talked to a database. Now that you have your provider you need to register it with the application. You can do this is the <em>browserCaps </em>in the web.config or you can register in the Global.asax, like so.

<div class="wlWriterSmartContent" id="scid:9ce6104f-a9aa-4a17-a79f-3a39532ebf7c:b493ce14-7ee8-44f5-9ab3-dd823fb77f05" style="margin: 0px; display: inline; float: none; padding: 0px;">
<div style="font-family: 'Courier New', courier, monospace; color: #000; font-size: 10pt; border: #000080 1px solid;">
<div style="background: #ddd; overflow: auto;">
<ol style="padding-bottom: 0px; margin: 0px 0px 0px 2em; padding-left: 5px; padding-right: 0px; background: #ffffff; padding-top: 0px;">
    <li>void Application_Start(object sender, EventArgs e)</li>
    <li style="background: #f3f3f3;">{</li>
    <li>    HttpCapabilitiesBase.BrowserCapabilitiesProvider = new CustomProvider();</li>
    <li style="background: #f3f3f3;">}</li>
</ol>
</div>
</div>
</div>


Now your provider will run on each request, it’s pretty simple I know. The main thing to remember is that because it run on each request it should be lightweight code that executes and honestly this should be one of those time where creating a browser provider is the last resort, in my opinion at least.
