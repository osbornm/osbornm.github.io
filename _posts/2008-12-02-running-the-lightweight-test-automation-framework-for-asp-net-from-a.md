---
layout: post
title: Running the Lightweight Test Automation Framework for ASP.NET from a separate application
date: 2008-12-02 10:04
author: Matthew Osborn
comments: true
header-img: "img/headers/code.jpg"
---
In some instances it might be best if your tests did not run in the same application as the website being tested.  This is where the “IApplicationPathFinder” interface comes into play.  If you implement this interface you will see that it only has one method “GetApplicationpath.”  What this does is allow you to specify a prefix of sorts for the navigate method.  When you call navigate on a HTMLPage it uses a ApplicationPathFinder to get the location it should look for the website at.  For example, the framework will implement this interface and simply return “http://localhost” by default.  Creating your own ApplicationPathFinder class allows you to specify where to look for the website, there is nothing stopping you from telling it to look for “http://foo.com.”  The fallowing code shows a simple implementation of the IApplicationPathFinder interface, that points to a second test application. This code is place in the DrivePage that is located in the “Test” folder.

<pre class="code"><span style="color: blue">&lt;</span><span style="color: #a31515">script </span><span style="color: red">runat</span><span style="color: blue">="server"&gt;
    public class </span><span style="color: #2b91af">TestApplicationPathFinder </span>: Microsoft.Web.Testing.Light.<span style="color: #2b91af">IApplicationPathFinder
    </span>{
        <span style="color: blue">public string </span>GetApplicationPath()
        {
              <span style="color: blue">return </span><span style="color: #a31515">"http://localhost/TestApp2"</span>;
        }
    }

    <span style="color: blue">protected override void </span>OnInit(<span style="color: #2b91af">EventArgs </span>e)
    {
        <span style="color: blue">base</span>.OnInit(e);

        Microsoft.Web.Testing.Light.<span style="color: #2b91af">ServiceLocator</span>.ApplicationPathFinder = <span style="color: blue">new </span><span style="color: #2b91af">TestApplicationPathFinder</span>();
    }
<span style="color: blue">&lt;/</span><span style="color: #a31515">script</span><span style="color: blue">&gt;</span></pre>

Okay, lets take a look at what is really going on here in the code.  First I choose to include the  implementation of the IApplicationPathFinder interface in the DriverPage, however, this could easily be moved to its own file/assembly.  Other than that the code is pretty straight forward, set the ApplicationPathFinder property on the ServiceLocator to an instance of your implementation.

There are numerous reason you might want to run the the test application separately from the site you are testing.  Here is a simple implementation that allows you to store your test application in a central location and pass the location of the site to be test to it.  You could use a URL like “http://localhost/Test?tag=localhost2&amp;filter=true&amp;path=http%3A%2F%2Flocalhost2&amp;run=true” to the navigate and have the test page look for the site at “http://localhost2,” show only the test with the tag name “localhost2,” and run them once navigation is complete.  You could see how you could use this to set up a regression test bed, by storing all your tests in one location and pointing them to the proper servers for the pages.

<pre class="code"><span style="color: blue">&lt;</span><span style="color: #a31515">script </span><span style="color: red">runat</span><span style="color: blue">="server"&gt;
    public class </span><span style="color: #2b91af">TestApplicationPathFinder </span>: Microsoft.Web.Testing.Light.<span style="color: #2b91af">IApplicationPathFinder
    </span>{
        <span style="color: blue">public string </span>Path { <span style="color: blue">get</span>; <span style="color: blue">set</span>; }

        <span style="color: blue">public </span>TestApplicationPathFinder(<span style="color: blue">string </span>path)
        {
            Path = path;
        }

        <span style="color: blue">public string </span>GetApplicationPath()
        {
            <span style="color: blue">return </span>Path;
        }
    }

    <span style="color: blue">protected override void </span>OnInit(<span style="color: #2b91af">EventArgs </span>e)
    {
        <span style="color: blue">base</span>.OnInit(e);
        <span style="color: blue">string </span>path = <span style="color: blue">this</span>.Request.Params[<span style="color: #a31515">"path"</span>];
        <span style="color: blue">if</span>(!<span style="color: blue">string</span>.IsNullOrEmpty(path))
            Microsoft.Web.Testing.Light.<span style="color: #2b91af">ServiceLocator</span>.ApplicationPathFinder = <span style="color: blue">new </span><span style="color: #2b91af">TestApplicationPathFinder</span>(path);
    }
<span style="color: blue">&lt;/</span><span style="color: #a31515">script</span><span style="color: blue">&gt;</span></pre>

Hopefully this gives you some insight into the power that the Lightweight Test Automation Framework for ASP.NET has and how you can leverage that power.  You can download the framework <a href="http://www.codeplex.com/aspnet/Wiki/View.aspx?title=ASP.NET%20QA&amp;referringTitle=Home">here</a>. Please let me know if you have any questions.


