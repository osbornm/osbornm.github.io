---
layout: post
title: Knockout.js Trackable Observable
date: 2013-03-10 22:38
author: matthew osborn
header-img: "img/headers/code.jpg"
comments: true
update: Trackable Observable is now part of the <a href="github.com/osbornm/uppercut">uppercut library</a>.
---


Here is another common helper function/type that I use frequently. I often find myself writing edit forms with knockout and it seems that I always want to have a cancel button on those edit forms. TrackableObservable tracks its original value so that you can call the reset and it will revert back to the original value. I have seen a few implementations of this type but they all seemed to wait for a "commit" action before changing the value, this means that if you are taking a dependency on that value for other parts of the from (think a checkbox that turns more UI on or off) you would need to call commit or depended on the "uncommited" value property. I choose to make mine an optimistic "commit" and have the ability to revert. This makes the implementation simpler and also taking dependencies on the TrackableObservable easier.  Let me know what you think.


{% gist osbornm/5045270 %}
