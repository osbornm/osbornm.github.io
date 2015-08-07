---
layout: post
title: Knockout.js Widget Binding
date: 2013-02-27 04:38
header-img: "img/post-bg-code.png"
author: matthew osborn
comments: true
---
Over the past few months I have been working a lot of JavaScript and with that comes it's fair share of "new hotness" frameworks. One that I always use though is [knockout.js](http://knockoutjs.com). For those that don't know knockout is basically a MVVM framework for JavaScript and well it'r pure magic made from unicorns! Anyway one of the most common things that I have been doing is using knockout templates and creating jQuery UI widgets. For instance I want to add another item to a grid and wire up a bootstrap tooltip widget. I can do this after binding takes place and every time binding is updated, or I can create a custom knockout binding. So here it is, one of a growing number of helpers that I will be sharing over the next few weeks.

{% gist osbornm/5045086 %}
