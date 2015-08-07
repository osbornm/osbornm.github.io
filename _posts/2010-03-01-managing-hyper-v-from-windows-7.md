---
layout: post
title: Managing Hyper-V from Windows 7
date: 2010-03-01 18:00
author: Matthew Osborn
comments: true

---
Recently everyone on my team has switched to using Hyper-V as our primary means of virtualization. The combination of Hyper-V and differencing disks works great for our team as we install all kinds of bit that more than likely will explode our computers. We are testers after all. There was one thing that really took me awhile to figure out and quite frankly most people on my team don’t know you can do (hence the blog post), mange my Hyper-V install from another machine in this case a windows 7 machine.

Most people just simply have the Hyper-V machine hooked up to the KVM and switch back and forth when the need to change something or remote into it. This is great but I don’t really like that use case, so I went searching for something else. I found out the you can manage Hyper-V installs as well as pretty much every aspect of a server through the Remote Server Administration Tools. In Vista and Server OSes this is simple, just go to the “Turn Windows feature on or off” section of the control panel and check the right boxes. However, if you’re on a Windows 7 Machine you will notice that they are missing.

Okay so how do you get the option to install the Remote Server Administration Tools? This is the tricky part and what took me awhile to figure out.Why was it tricky you ask, because you have to know you need to install Remote Server Administration Tools to be able to manage Hyper-V installs. For me when I did a search on the internet on how to manage Hyper-V installs from Windows 7 all I got was some posts about installing a version of Hyper-V manager for Windows 7 Beta, all of which were dead links. After some time I figured out that it was Remote Server Administration Tools you needed to install to get Hyper-V manager. So here is how to get everything set up to remotely manage your Hyper-V installs.

<ol>
    <li>Download and install the <a href="http://www.microsoft.com/downloads/details.aspx?FamilyID=7D2F6AD7-656B-4313-A005-4E344E43997D&amp;displaylang=en" target="_blank">Remote Server Administration Tools from Microsoft</a>.</li>
    <li>Go to the “Turn Windows features on or off” and install the Hyper-V tools. (It’s under Remote Server Administration Tools &gt; Role Administration Tools) </li>
    <li>Now you can open the Hyper-V Manager Console. (Just search for Hyper-V in the start menu)</li>
    <li>Right Click on the “Hyper-V Manager” Node in the left panel and select “Connect to a Server”.</li>
    <li>Check the “Another Computer” radio button and enter the name of the computer.</li>
    <li>Rinse and repeat on as many computers as you like. (This is the same interface you already use to manage Hyper-V so it should be just like home)</li>
</ol>

Hope this helps, it been working great for me as I have full control of the Hyper-V install without having to remote into the server anymore.
