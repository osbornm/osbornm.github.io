---
layout: post
title: ASP.NET MVC 2 Preview 2 Released
date: 2009-10-01 07:28
author: Matthew Osborn
comments: true
header-img: "img/post-bg-code.png"
---

I am proud to announce that ASP.NET MVC 2 Preview 2 has been released! So what are you waiting for? Go <a target="_blank" href="http://go.microsoft.com/fwlink/?LinkID=154414">download it</a>, its okay I’ll wait here… If you are running MVC 1.0 the good news is that just like Preview 1, Preview 2 can live side by side with it. However, as with previous preview releases, it is recommended that you uninstall Preview 1 prior to installing Preview 2. Currently there is no glamorous way of converting a MVC 1.0 project to a MVC 2 project but it is a pretty simple process and instructions can be found in the <a target="_blank" href="http://go.microsoft.com/fwlink/?LinkID=157066">released notes</a>.


Okay now for some more interesting stuff, the new features that are in Preview 2. If you missed Preview 1 you can read <a target="_blank" href="http://haacked.com/archive/2009/07/30/asp.net-mvc-released.aspx">Phil’s post</a> to see what was in that release.

<ul>
    <li><strong>Single-Project Areas</strong>: For those of you familiar with Multi-Project Areas from Preview one this should be a span. If not, an area is simply a way of segregating logical units of  your application. For instance, think of segmenting the blog and store in a company website. The difference now is that this can all be done inside of a single project file.</li>
    <li><strong>Client Side Validation</strong>: Client side validation was something that the ASP.NET MVC framework was missing, well not anymore. Basically out of the box we support the ability to have nice client side validation when you annotate your model objects use Data Annotations. However, this is completely extensible and you can create your providers both for client side and server side validation.</li>
    <li><strong><em>ModelMetaData</em></strong>: As MVC 2 started to grow in its feature set it became apparent that the ability to easily access metadata about the model was very important. So after a few rubs on the oil lamp and a chat with a genie, poof we now have and object call <em>ModelMetaData</em> that hangs off of the <em>ViewDataDictionary</em>. Just like client validation this is completely extensible and you have the ability to create your own provider. Out of the box we have built in functionality for Data Annotations. </li>
    <li><strong>HTTP Verb Overrides</strong>: Anyone that has worked with ASP.NET MVC for any amount of time is familiar with HTTP Verbs. Basically a HTTP Verb is a value passed to the server such as GET or POST that tell the server what the client is trying to do. However, there are several lesser known verbs like PUT and DELETE, because quite simply most browser can only use three verbs, HEAD, GET, and POST. This is not true anymore! Well at least for ASP.NET MVC 2 that is. We know allow you to override the POST verb with any of the others. Along with that we have also create some nice shortcut attributes to use when marking actions in your controller just like the <em>HttpPost</em> one in Preview 1.</li>
    <li><strong>Tons of Other Stuff</strong>: To try to keep this post some what short I decide to wrap some of the smaller items into one bullet point as it would take a long time to explain them all. The short of it is that there is lots of cool features, bug fixes, and some API changes in Preview 2. Some of the notable ones are new code snippets, additional default templated helpers, and a new attribute to mark an action as needing HTTPS.</li>
</ul>

So please go <a target="_blank" href="http://go.microsoft.com/fwlink/?LinkID=154414">download it</a>, try it out, and give us your feedback! After all that is the whole idea of releasing these previews. Also I would like to give a big thanks to everyone on the team that helped to make this a successful release!
