module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      "nativewind/babel",
      [
        "module-resolver",
        {
          root: ["./"],
          alias: {
            "@": "./",
            "@assets": "./assets",
            "@components": "./src/components",
            "@utils": "./src/utils",
            "@screens": "./src/screens",
          },
        },
      ],
    ],
  };
};
