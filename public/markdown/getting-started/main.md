# What is sharc?

**sharc**, short for **Sh**apes and **A**nimations **R**endered on a **C**anvas, is a library for drawing raster graphics and animations to an HTML canvas. The library is written completely in Typescript, and is designed to be both easy to use and very powerful. Here are some of the features of sharc:

* Declarative, object-oriented API, so you create [c:Sprite]() objects and push them to the canvas.
* A [c:Stage]() class that manages the animation loop and pointer events for you.
* Shape nesting, which lets you move and scale shapes relative to their parent.
* Graphics primitives likes lines, rounded rectangles, bezier curves, text, and more.
* A robust, declarative [animation]() system.
* Zero dependencies.
* Typescript support!

[]
# Installation

### NPM

This is the simplest way to install sharc. Just run this command in your terminal:

~~~txt
$ npm install sharc-js@stable
~~~
This works for both Javascript and Typescript projects. (For Typescript, you need Typescript version ^5.1.3)

[]
### Github
You can also download the source code from Github. Just clone the repository into the project. *(Typescript only)*
~~~txt
$ git clone https://github.com/gitpushjoe/sharc.git
$ cd sharc
$ git sparse-checkout set --no-cone sharc
$ git checkout
~~~

[]
### Manual Download
Alternatively, you can download the dist and src files using the Download link in the nav bar.
