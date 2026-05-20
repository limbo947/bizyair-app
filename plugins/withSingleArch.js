const { withAppBuildGradle } = require('@expo/config-plugins');

module.exports = function withSingleArch(config) {
  return withAppBuildGradle(config, (cfg) => {
    if (cfg.modResults.language === 'groovy') {
      let contents = cfg.modResults.contents;

      contents = contents.replace(
        /(defaultConfig\s*\{)/,
        `defaultConfig {
        ndk {
            abiFilters "arm64-v8a"
        }`
      );

      contents = contents.replace(
        /android\.packagingOptions\[prop\]/g,
        `android.packagingOptions[prop]`
      );

      const excludesBlock = `android.packagingOptions.excludes += '**/x86/*.so'
android.packagingOptions.excludes += '**/x86_64/*.so'
android.packagingOptions.excludes += '**/armeabi-v7a/*.so'
`;

      contents = contents.replace(
        /\}\s*$/,
        `${excludesBlock}}`
      );

      cfg.modResults.contents = contents;
    }
    return cfg;
  });
};
