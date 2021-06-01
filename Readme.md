===========
puppy-csslib
===========

.. image:: https://img.shields.io/travis/scrapehero/selectorlib.svg
:target: https://travis-ci.org/scrapehero/selectorlib

A CSS Selector library to read YAML files to parse static or SPA Pupeteer page and give json output with css selectors.

- Free software: MIT license

## Example

Example code is provided in `test.js`

> > > node test.js
> > > yaml_string = """

    title:
        css: "h1"
        type: Text
    link:
        css: "h2 a"
        type: Link
    """

> > > extractor = Extractor.from_yaml_string(yaml_string)
> > > html = """

    <h1>Title</h1>
    <h2>Usage
        <a class="headerlink" href="http://test">¶</a>
    </h2>
    """

> > > extractor.extract(html)
> > > {'title': 'Title', 'link': 'http://test'}
