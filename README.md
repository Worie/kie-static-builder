# kie-static-builder
> Tool for building the bundle containing final package

# Introduction

## The idea

This submodule will is supposed to create single ready to use chapter of the tutorial basing on template, content and assets.

## Instalation

You probably shouldn't use this module directly *yet*, but you can always clone it with git: 

`$ git clone https://github.com/worie/kie-static-builder`

## Usage

You can pass `--contentPath`, `--templatePath`, `--assetsPath` or `--destinationPath` parameters to `bin/index.js` (or `kie-static-builder` once npm package is ready).

All of those options should be absolute at this point.

* *--contentPath* - Required, a path for directory that the content of the chapter tutorial are in. Note that it musn't contain last trailing slash, for example `foo/bar/` will not be valid at this point, use `foo/bar`. 
* *--templatePath* - Optional, a path for template of the tutorial. For now `pug` based, see[kie-template.pug](kie-template.pug)
* *--destinationPath* - a path where bundled, static files will be placed 
* *--assetsPath* - Optional, path for css/image/js assets for the display environment of the tutorial

# License 

**[kie-static-builder](https://github.com/worie/kie-static-builder)** by [Wojciech Połowniak](https://twitter.com/wopolow) is licensed under [MPL 2.0](LICENSE) [(read more)](https://www.mozilla.org/en-US/MPL/2.0/FAQ/).