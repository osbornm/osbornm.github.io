---
layout: post
title: Lightweight Test Automation Framework April Release
date: 2009-04-09 19:10
author: Matthew Osborn
comments: true
header-img: "img/headers/code.jpg"
---

The April release of the Lightweight Test Automation Framework for ASP.NET has just been posted and you can download it <a title="April Update" href="http://aspnet.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=25887">here</a>. For this release, the team has worked hard to include the following bug fixes and new features. Please continue to give us your feedback as many of the fixes and features are based what we have heard from the community.

###Improvements to the user interface

<ul>
    <li>
    <div align="left">A new look has been given to the test name when it passes or fails.  There is both color and visual queues that indicate weather a test has passed or failed.  Failed test names also appear slightly larger to help them stand out. </div>
    </li>
    <li>
    <div align="left">There is now a “Run Failed Tests” button. This button will open a new browser window that will select and run only the failed tests, for easy verification of fixes. </div>
    </li>
</ul>


###The ability to automate popup windows

In previous versions of the framework there was no way to verify the contents of a popup window.  With this release we have far better support for opening and verifying the contents of popup windows.

<pre class="code"><span style="COLOR: #2b91af">HtmlPage </span>page = <span style="COLOR: blue">new </span><span style="COLOR: #2b91af">HtmlPage</span>(<span style="COLOR: #a31515">"MyPage.aspx"</span>);
page.Elements.Find(<span style="COLOR: #a31515">"OpenPopup"</span>).Click();
<span style="COLOR: green">// get popup window
</span><span style="COLOR: #2b91af">HtmlPage </span>popup = page.GetPopupWindow(1);
<span style="COLOR: green">// verify title of popup
</span><span style="COLOR: #2b91af">Assert</span>.AreEqual(<span style="COLOR: #a31515">"This is the Popup Page"</span>, popup.Elements.Find(<span style="COLOR: #a31515">"h1"</span>, 0).GetInnerText());</pre>

The GetPopupWindow method returns a HtmlPage object that is representative of the window at that index.  This is pulled from the collection that is maintained by the framework with index zero being the main, or starting, window. In this example index zero is MyPage.aspx, while index one is the popup window.

###The ability to find elements by partial attribute values

In previous versions of the framework when finding elements on a page you could only use the ID attribute to match against.  So if you wanted to match all the elements that had a CSS class applied to them, as is common in jQuery, you had to supply that whole value for the class attribute.  So, in previous versions of the framework if you wanted to find elements that had a CSS class applied to them you had to specify the whole value for the class attribute.  Meaning that if the element has more than only class and you search based on only one class that element would not be returned.  Now you have the ability to match based on any part of the value for the attribute. Below is an example of how to find elements that have the CSS Class “blue” applied to them.

<pre class="code"><span style="COLOR: #2b91af">HtmlElementFindParams </span>find = <span style="COLOR: blue">new </span><span style="COLOR: #2b91af">HtmlElementFindParams</span>();
find.Attributes.Add(<span style="COLOR: #a31515">"class"</span>, <span style="COLOR: #a31515">"blue"</span>, <span style="COLOR: #2b91af">MatchMethod</span>.Contains);
<span style="COLOR: #2b91af">ReadOnlyCollection</span>&lt;<span style="COLOR: #2b91af">HtmlElement</span>&gt; elements = page.Elements.FindAll(find);</pre>

###Assembly name change

<ul>
    <li>The assembly name has been changed from “<em>Microsoft.Web.Testing.Light</em>” to “<em>Microsoft.Web.Testing.Lightweight.</em>” The namespaces have not changed. </li>
</ul>
