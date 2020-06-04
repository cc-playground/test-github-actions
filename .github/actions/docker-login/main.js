const terminal = require('@actions/exec');

terminal.exec('docker ps')
terminal.exec('touch hello-world-test')
