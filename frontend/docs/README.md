The frontend documentation is built using [TypeDoc](https://typedoc.org/), which is based on [JSDoc](https://jsdoc.app/). For now, every single TypeScript file in the `src` folder will have its comments generated into code, although this can be changed (see below).

### Important Note

Currently the `src/pages/` folder and everything in it is not generated. If this is important, please adjust *exclude* in `typedoc.json`

## Requirements

You can install TypeDoc using:

```
npm install -U typedoc
```

## Building

The documentation can be built using:

```
npx typedoc
```

in this directory. Alternatively, there's a Makefile which does the exact same thing. The resulting documentation is located in `_build`.

## Editing documentation

By default, every TypeScript file will be documented. If you want to exclude specific files, add them to *exclude* in `typedoc.json`. 

TypeDoc provides some ways to categorize your code. If you want your code to be documented in a specific module, add the lines

```
/**
 * @module [name]
 */
```
to the top of your TypeScript file. Note that TypeDoc does **not** combine multiple files that have the same module into one page.