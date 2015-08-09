---
layout: post
title: Updated MVC Script Helpers
date: 2009-12-18 23:15
author: Matthew Osborn
comments: true
header-img: "img/headers/code.jpg"
---
Okay so if you read this title and said “wait… MVC has Script helpers?!” you should first go read my original post on MVC Script &amp; Css Helpers. Okay now for those of you who know what they are or just finished reading about them, I was able to add a small feature from Beta to RC to the script helper that I just didn’t have time to code the first time. If you download the new <a href="http://aspnet.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=37423" target="_blank">RC futures assembly</a> and add it to your project or update the existing one you will notice that the script helper now has an overload.

If you have not been able to figure out what this overload does, it allows you to specify a path to a second file to use when you are debugging. For instance it is pretty common to <a href="http://aspnet.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=35893" target="_blank">minify JavaScript</a> which basically makes it impossible to read or understand. Most developer maintain to versions on the JavaScript one minified and one not for debugging purposes. In fact if you are using the <em>ScriptManager</em> control in ASP.NET this has the same basic functionality.

<div class="wlWriterEditableSmartContent" id="scid:9ce6104f-a9aa-4a17-a79f-3a39532ebf7c:cee43a60-ddfa-462d-84bf-8178ade6b9f1" style="margin: 0px; display: inline; float: none; padding: 0px;">
<div style="border: #000080 1px solid; color: #000; font-family: 'Courier New', Courier, Monospace; font-size: 10pt;">
<div style="background: #ddd; max-height: 300px; overflow: auto;">
<ol style="background: #ffffff; margin: 0 0 0 2em; padding: 0 0 0 5px;">
    <li><span style="color: #0000ff;">&lt;</span><span style="color: #a31515;">head</span><span style="color: #0000ff;">&gt;</span></li>
    <li style="background: #f3f3f3;">    <span style="color: #0000ff;">&lt;</span><span style="color: #a31515;">title</span><span style="color: #0000ff;">&gt;&lt;</span><span style="color: #a31515;">asp</span><span style="color: #0000ff;">:</span><span style="color: #a31515;">ContentPlaceHolder</span> <span style="color: #ff0000;">ID</span><span style="color: #0000ff;">="TitleContent"</span> <span style="color: #ff0000;">runat</span><span style="color: #0000ff;">="server"</span> <span style="color: #0000ff;">/&gt;&lt;/</span><span style="color: #a31515;">title</span><span style="color: #0000ff;">&gt;</span></li>
    <li>    <span style="background: #ffee62;">&lt;%</span><span style="color: #0000ff;">=</span> Html.Css(<span style="color: #a31515;">"Site.css"</span>) <span style="background: #ffee62;">%&gt;</span></li>
    <li style="background: #f3f3f3;">    <span style="background: #ffee62;">&lt;%</span><span style="color: #0000ff;">=</span> Html.Script(<span style="color: #a31515;">"MicrosoftAjax.js"</span>, <span style="color: #a31515;">"MicrosoftAjax.debug.js"</span>) <span style="background: #ffee62;">%&gt;</span></li>
    <li><span style="color: #0000ff;">&lt;/</span><span style="color: #a31515;">head</span><span style="color: #0000ff;">&gt;</span></li>
</ol>
</div>
</div>
</div>

So you might be asking how we know when to render the debug script or the release script. This is based off the same logic that the <em>ScriptManager</em> control uses. If the <em>HttpContext.IsDebuggingEnabled </em>is set to true then we will render the debug script. There are a couple ways in which the <em>IsDebuggingEnabled </em>is set to false all of which can be found on <a href="http://msdn.microsoft.com/en-us/library/system.web.ui.scriptmanager.isdebuggingenabled.aspx" target="_blank">MSDN</a>.

Hopefully this makes the script helper a little more useful. I would love to continue to improve these and maybe even bring them into the main framework some day so please let me know what you think! In fact, this improvement was a request on my original post. You can download MVC Futures <a href="http://aspnet.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=33836">here</a>.
