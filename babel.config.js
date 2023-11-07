module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      "nativewind/babel",
      "react-native-reanimated/plugin",
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
            "@helpers": "./src/helpers",
            "@constants": "./src/constants",
            "@drawer": "./src/drawer",
            "@env": "./src/env",
            "@constants": "./src/constants",
          },
        },
      ],
    ],
  };
};
