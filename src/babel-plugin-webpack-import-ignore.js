// Adds /* webpackIgnore: true */ to dynamic imports matching a pattern
// Only for string literals and only if there is no existing webpack magic comment.
module.exports = function webpackIgnoreDynamic(api, options = {}) {
  const { pattern } = options;

  // If no pattern provided, don't do anything
  if (!pattern) {
    return {
      name: "webpack-import-ignore",
      visitor: {},
    };
  }

  // Create regex from pattern
  let matchRegex;
  if (typeof pattern === 'string') {
    matchRegex = new RegExp(pattern);
  } else if (pattern instanceof RegExp) {
    matchRegex = pattern;
  } else {
    throw new Error('pattern option must be a string or RegExp');
  }

  return {
    name: "webpack-import-ignore",
    visitor: {
      Import(path) {
        const call = path.parentPath;
        if (!call.isCallExpression()) return;

        const [arg] = call.node.arguments || [];
        if (!arg || arg.type !== "StringLiteral") return;

        const spec = arg.value;
        if (!matchRegex.test(spec)) return;

        // Don't add if any webpack magic comment already exists
        const hasMagic =
          (arg.leadingComments || []).some((c) => /webpack/i.test(c.value)) ||
          (call.node.leadingComments || []).some((c) =>
            /webpack/i.test(c.value)
          );
        if (hasMagic) return;

        // Attach: import(/* webpackIgnore: true */ "...")
        const block = { type: "CommentBlock", value: " webpackIgnore: true " };
        arg.leadingComments = (arg.leadingComments || []).concat(block);
      },
    },
  };
};
