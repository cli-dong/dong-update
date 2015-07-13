/*
 * dong-update
 * https://github.com/crossjs/dong-update
 *
 * Copyright (c) 2015 crossjs
 * Licensed under the MIT license.
 */

'use strict';

module.exports = {
  command: 'update',
  description: '给 SPM 打补丁',
  options: [{
    name: 'registry',
    alias: 'R',
    description: '自定义 NPM 源',
    optional: true,
    defaults: ''
  }, {
    name: 'sudo',
    alias: 's',
    description: '需要 su 权限（unix）',
    defaults: false
  }],
  bootstrap: require('./lib/update'),
  help: function(chalk) {
    console.log('  Examples:')
    console.log('')
    console.log(chalk.gray('    $ ') +
                chalk.magenta('dong update -R') +
                chalk.gray(' ....... equal to `dong update -R https://registry.npm.taobao.org`'))
    console.log('')
  }
}
