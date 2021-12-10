Javascript library with utilities for [Spring](https://spring.io) documentation and websites.

## Usage

```
<link rel="stylesheet" type="text/css" href="https://unpkg.com/@springio/utils/style.css" />
<script async src="https://unpkg.com/@springio/utils/index.js"></script>
```

## Block Switcher

Often used for switching code samples globally between different high level options (Java and Kotlin, Java and XML, YAML and Properties, etc.). If HTML is rendered with Asciidoctor then code snippets like this:

```
[source,xml,indent=0,role="primary"]
.Maven
----
<dependency>
    <groupId>com.example</groupId>
    <artifactId>some-library</artifactId>
    <version>1.2.3</version>
</dependency>
----

[source,indent=0,role="secondary"]
.Gradle
----
compile 'com.example:some-library:1.2.3'
----
```

Then the HTML will be generated with "title" elements, like this:

```
<div class="content primary">
  <div class="title">Maven</div>
  <div class="content">
    <pre>
<dependency>
    <groupId>com.example</groupId>
    <artifactId>some-library</artifactId>
    <version>1.2.3</version>
</dependency>
    </pre>
  </div>
</div>
<div class="content secondary">
  <div class="title">Gradle</div>
  <div class="content">
    <pre>
compile 'com.example:some-library:1.2.3'
    </pre>
  </div>
</div>
```

The script scans for this kind of structure and re-organizes it so that only one snippet is visible and the others are selectable by a click. It works for all blocks with "Maven|Gradle" choices in the whole document, on the assumption that the user only wants to select this once. It's a bit like classic navigation tabs, but applied to the whole content, not just navigation.

## Publishing

This library is published in NPMJS (following instructions [here](https://docs.npmjs.com/creating-and-publishing-scoped-public-packages)). That's how the `unpkg.com` links work above:

```
$ npm login
$ npm publish --access public
```