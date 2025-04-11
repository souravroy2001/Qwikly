module.exports = {
  presets: ['module:@react-native/babel-preset'],

  plugins: [
    [
      'react-native-reanimated/plugin',
      {
        relativeSourceLocation: true,
      }
    ],
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          components: './src/components',
          screens: './src/screens',
        },
      },
    ],
  ],
};
