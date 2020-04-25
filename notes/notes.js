const fs = require('fs');

const addNote = function (title, body) {
    const notes = loadNotes();
    const duplicateNotes = notes.filter(note => note.title === title)
    debugger;
    if (duplicateNotes.length === 0) {
        notes.push({
            title: title,
            body: body
        })
    } else {
        console.log("Duplicate Notes");
    }

    saveNotes(notes);
};

const removeNote = function(title) {
    const notes = loadNotes();
    const filteredNotes = notes.filter(note => note.title.toUpperCase() !== title.toUpperCase())
    saveNotes(filteredNotes);
}

const saveNotes = function (notes) {
    const notesJSON = JSON.stringify(notes);
    fs.writeFileSync('notes.json', notesJSON);
}

const loadNotes = function () {
    try {
        const dataBuffer = fs.readFileSync('notes.json');
        const dataJSON = dataBuffer.toString();
        return JSON.parse(dataJSON);
    } catch (e) {
        return []
    }

}
module.exports = {
    addNote: addNote,
    removeNote: removeNote
}