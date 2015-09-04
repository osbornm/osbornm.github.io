---
layout: post
title: Announcing Uppercut.js
date: 2015-09-04 08:00
author: Matthew
header-img: "img/headers/code.jpg"
comments: true
---

[uppercut.js](http://uppercutjs.com) is a collection of classes, bindings, and helpers that extend [knockout.js](http://knokcoutjs.com). Over the course of the last few years I have spent a large amount of time working on or with Knockout.js. There are features and helpers that I personally wish it had that do not make sense as part of the library as a whole. This is either because it would increase dependency scope, requiring Jquery, or because they are to opinionated about how to preform a certain action.

uppercut.js is just starting out and I'm slowly gathering up all the bits and pieces I have scattered across all my different projects and making some of them more modular. I'll be posting a road map up to [github](https://github.com/osbornm/uppercut) soon but it's mainly getting all the common bindings and helper classes I used moved over, then moving to support AMD.


You can install uppercut.js using either bower `bower install uppercut` or with NuGet `nuget install uppercutjs`. For more information and example of everything avalible head over to the [uppercut.js github page](https://github.com/osbornm/uppercut), but here are a few quick examples of some of my favorite stuff


{% gist osbornm/0b2bae8aacb6e3e497ac %}
