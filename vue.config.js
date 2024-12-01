const path = require('path');

module.exports = {
  transpileDependencies: true,
  pluginOptions: {
    electronBuilder: {
      preload: path.resolve(__dirname, './preload.js'),
      mainProcessFile: path.resolve(__dirname, './src/background.js'), 
      builderOptions: {
        appId: 'com.rs.focusbloom',
        productName: 'FocusBloom',
        copyright: '© 2024 Rui S0ng',
        asar: true, 
        directories: {
          output: 'dist_electron', 
        },
        extraResources: [
          {
            from: 'public/',
            to: 'resources/'
          },
        ],
        win: {
          target: ['nsis', 'zip'],
          icon: path.resolve(__dirname, 'public/focus_bloom.ico'),
        },
        mac: {
          target: ['dmg', 'zip'],
          icon: path.resolve(__dirname, 'public/focus_bloom.icns'),
        },
        nsis: {
          oneClick: false,
          perMachine: true,
          allowToChangeInstallationDirectory: true,
          installerIcon: path.resolve(__dirname, 'public/installerIcon.ico'),
          uninstallerIcon: path.resolve(__dirname, 'public/uninstallerIcon.ico'),
        },
      },
    },
  },
};
