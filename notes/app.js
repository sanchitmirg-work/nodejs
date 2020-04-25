const yargs = require('yargs');
const notes = require('./notes.js');

yargs.command({
    command: 'add',
    describe: 'This to add note',
    builder: {
        title: {
            describe: "Notes Title",
            demandOption: true
        },
        body: {
            describe: "Notes Body",
            demandOption: true
        }
    },
    handler: function(argv) {
        notes.addNote(argv.title, argv.body)
    }
});

yargs.command({
    command: 'removeNote',
    describe: 'This is to remove Note',
    builder: {
        title: {
            describe: 'To remove note.',
            demandOption: true
        }
    },
    handler: function(argv) {
        notes.removeNote(argv.title)
    }
})

console.log('This is yargs argv', yargs.argv)
