# babel-plugin-webpack-import-ignore

A Babel plugin that automatically adds `/* webpackIgnore: true */` magic comments to dynamic imports matching a specified pattern.

## Installation

```bash
npm install babel-plugin-webpack-import-ignore --save-dev
# or
yarn add babel-plugin-webpack-import-ignore --dev
```

## Usage

Add the plugin to your Babel configuration with the `pattern` option:

```javascript
// babel.config.js
module.exports = {
  presets: [
    "@babel/preset-env",
    "@babel/preset-react",
    "@babel/preset-typescript",
  ],
  plugins: [
    ["babel-plugin-webpack-import-ignore", {
      pattern: "^@myscope/"
    }]
  ],
};
```

## Options

### `pattern` (required)

Specifies which dynamic imports should receive the `/* webpackIgnore: true */` comment.

**Type:** `string | RegExp`

**Examples:**

```javascript
// Match imports starting with @myscope/
{
  pattern: "^@myscope/"
}

// Match any scoped package
{
  pattern: "^@"
}

// Match multiple specific packages
{
  pattern: "^(lodash|axios)"
}

// Match with case insensitivity (use RegExp object for flags)
{
  pattern: /^@mycompany\//i
}

// RegExp object
{
  pattern: /^@mycompany\//
}
```

**String Format:** Strings are treated as regex patterns and passed directly to `new RegExp(pattern)`. Use RegExp objects if you need flags like `i` (case insensitive) or `g` (global).

## What It Does

The plugin transforms dynamic imports matching your pattern by adding the webpack magic comment `/* webpackIgnore: true */`:

**Before:**
```javascript
import('@my-scope/module-one');
import('@my-scope/module-two');
```

**After:**
```javascript
import(/* webpackIgnore: true */ '@my-scope/module-one');
import(/* webpackIgnore: true */ '@my-scope/module-two');
```

## Features

- **Pattern matching:** Use regex patterns or simple strings to match import paths
- **Safe transformation:** Only transforms string literals (not template strings or expressions)
- **Preserves existing comments:** Won't add the comment if any webpack magic comment already exists
- **No-op by default:** Does nothing if `pattern` is not provided

## Use Cases

This plugin is useful when:

1. **External modules:** You want webpack to ignore certain dynamic imports that will be resolved at runtime (e.g., via import maps)
2. **Microfrontend architectures:** Dynamic imports of federated modules that shouldn't be bundled
3. **Runtime module loading:** Modules loaded from CDN or external sources at runtime

## Why `webpackIgnore: true`?

The `/* webpackIgnore: true */` magic comment tells webpack to:
- Not attempt to bundle the imported module
- Not create a separate chunk for it
- Leave the import as-is in the output, to be resolved at runtime

This is particularly useful in microfrontend architectures where modules are loaded from external sources using browser-native import maps.

## License

MIT
