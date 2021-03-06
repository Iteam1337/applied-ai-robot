'use strict'

const AudioRecorder = require(`node-audiorecorder`)
const MemoryStream = require('memorystream')
const translationService = require('./translationService')
const socket = require('./utils/socket');
const EventEmitter = require('events');

const translationEvents = new EventEmitter();

// Initialize recorder and file stream.
const audioRecorder = new AudioRecorder({
  program: process.platform === `win32` ? `sox` : `rec`,
  silence: 0.5,
  thresholdStart: 0.5,
  thresholdStop: 0.9, // Very unpicky - will treat background noise as silence === good
  bits: 16, // Sample size. (only for `rec` and `sox`)
  channels: 1, // Channel count.
  encoding: `signed-integer`, // Encoding type. (only for `rec` and `sox`)
  format: `S16_LE`, // Encoding type. (only for `arecord`)
  rate: 16000, // Sample rate.
  type: `wav`, // Format type.
  duration: 10,
})

function startRecording() {
  let buffer = null

  // Create write stream.
  const stream = new MemoryStream(null, { readable: false })
  audioRecorder
    .start()
    .stream()
    .pipe(stream)

  audioRecorder.stream().on(`close`, function (code) {
    clearTimeout(timeout)
    const audioBytes = new Uint16Array(buffer)
    translationService.translateAudio(audioBytes).then(translationResult => {
      if (translationResult.transcription) {
        console.log('\x1b[36m%s\x1b[0m', '(', translationResult.transcription, ')')
        translationResult.translations.forEach(t => {
          console.log('\x1b[33m%s\x1b[0m', t.language, t.text)
        })
        addTranslation({
          origin: 'me',
          timestamp: Date.now(),
          transcription: translationResult.transcription,
          translations: translationResult.translations
        })
      }
    })

    // This could probably be converted into something less recursive
    // if heap becomes a problem...
    startRecording()
  })

  // Don't record more than 10 seconds even if there is no silence.
  // Helps with noisy backgrounds and longwinded speakers
  let timeout = setTimeout(audioRecorder.stop, 30000)

  audioRecorder.stream().on(`end`, function () { })
  audioRecorder.stream().on(`error`, function () {
    console.warn(`Recording error.`)
  })
  audioRecorder.stream().on('data', function (chunk) {
    buffer = !buffer ? new Buffer(chunk) : Buffer.concat([buffer, chunk])
  })
}

let finishedTranslations = []

const getFinishedTranslations = async () => {
  return new Promise((resolve, reject) => {
    let interval = setInterval(async () => {
      if (finishedTranslations.length !== 0) {
        let returnedTranslations = finishedTranslations.slice(
          0,
          finishedTranslations.length
        )
        finishedTranslations.splice(0, finishedTranslations.length)
        clearInterval(interval)
        resolve(returnedTranslations)
      }
    }, 100)
  })
}

const addTranslation = translation => {
  finishedTranslations.push(translation)
  console.log('sending to socket', translation)
  socket.sendTranslationToFrontend(translation)
  translationEvents.emit('translation', translation)
}

module.exports = {
  startRecording,
  getFinishedTranslations,
  addTranslation,
  translationEvents
}
