/*
 * dong-update
 * https://github.com/crossjs/dong-update
 *
 * Copyright (c) 2015 crossjs
 * Licensed under the MIT license.
 */

'use strict';

// var fs = require('fs')
var path = require('path')

var log = require('spm-log')
var shell = require('shelljs')
// var checkUpdates = require('npm-check-updates')
var latestVersion = require('latest-version')

module.exports = function(options) {
  function getLocal() {
    return shell.exec('dong -V', {
      silent: true
    }).output.trim()
  }

  function doUpdateDong() {
    log.info('update', 'updating ...')

    var command = 'npm install -g dong'

    if (options.sudo && process.platform !== 'win32') {
      command = 'sudo ' + command
    }

    if (options.registry) {
      command += ' --registry ' + options.registry
    }

    shell.exec(command, {
      silent: false
    })

    log.info('update', 'current installed version is ' + getLocal())

    command = 'dong patch -R'

    if (options.sudo && process.platform !== 'win32') {
      command += ' -S'
    }

    // do patch
    shell.exec(command, {
      silent: false
    })
  }

  function doUpdateDeps(dest, key, ver) {
    var command = 'npm install ' + key + '@' + ver + ' --save';

    if (options.registry) {
      command += ' --registry ' + options.registry
    }

    command = ['cd ' + dest, command]

    if (process.platform === 'win32' && dest.charAt(1) === ':') {
      command.unshift(dest.slice(0, 2))
    }

    log.info('update', 'updating ' + key + ' ...')

    shell.exec(command.join(' && '), {
      silent: true
    })

    log.info('update', key + ' up-to-date')
  }

  if (options.registry) {
    if (options.registry === true) {
      log.warn('update', 'maybe need run `cnpm sync dong` first')
      options.registry = 'https://registry.npm.taobao.org'
    }
  }

  // local current version
  var version = getLocal()

  log.info('update', 'local dong@' + version)

  if (options.force) {
    doUpdateDong()
  } else {
    latestVersion('dong', function(err, ver) {
      if (version === ver) {
        log.info('update', 'dong already up-to-date')

        // update dependencies
        log.info('update', 'check dependencies ...')

        var dest = path.join(__dirname, '..', '..', '..')
        var dependencies = require(path.join(dest, 'package.json')).dependencies

        Object.keys(dependencies)
        .filter(function(key) {
          return /^dong\-/.test(key)
        })
        .forEach(function(key) {
          latestVersion(key, function(err, ver) {
            var cur = dependencies[key].replace(/[^\.\d]/g, '')
            if (cur === ver) {
              log.info('update', key + ' already up-to-date')
            } else {
              log.info('update', 'local ' + key + '@' + cur)
              log.info('update', 'latest ' + key + '@' + ver)
              doUpdateDeps(dest, key, ver);
            }
          })
        })
      } else {
        log.info('update', 'latest dong@' + ver)
        doUpdateDong()
      }
    })
  }
}
