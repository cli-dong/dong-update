/*
 * dong-update
 * https://github.com/crossjs/dong-update
 *
 * Copyright (c) 2015 crossjs
 * Licensed under the MIT license.
 */

'use strict';

var log = require('spm-log')
var shell = require('shelljs')
var latestVersion = require('latest-version')

module.exports = function(options) {
  function getLocal() {
    return shell.exec('dong -V', {
      silent: false
    }).output.trim()
  }

  function doUpdate() {
    log.info('update', 'updating ...')

    var install = 'npm install -g dong'

    if (options.sudo && process.platform !== 'win32') {
      install = 'sudo ' + install
    }

    if (options.registry) {
      if (options.registry === true) {
        options.registry = 'https://registry.npm.taobao.org'
      }

      install += ' --registry ' + options.registry
    }

    shell.exec(install, {
      silent: false
    })

    log.info('update', 'done! current installed version is ' + getLocal())

    shell.exec('dong patch -R', {
      silent: false
    })
  }

  // local current version
  var version = getLocal()

  log.info('update', 'current installed version is ' + version)

  latestVersion('dong', function(err, ver) {
    if (version === ver) {
      log.info('update', 'already up-to-date')
    } else {
      log.info('update', 'the latest version is ' + ver)
      doUpdate()
    }
  })
}
