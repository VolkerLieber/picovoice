# picovoice-web-demo

This is a basic demo to show how to use the Picovoice SDK for Web in a browsers, using the IIFE version of the library (i.e. an HTML script tag). It instantiates a Picovoice engine and uses it with the [@picovoice/web-voice-processor](https://www.npmjs.com/package/@picovoice/web-voice-processor) to access (and automatically downsample) microphone audio.

## Install & run

Use `yarn` or `npm` to install the dependencies, and the `start` script to start a local web server hosting the demo.

```console
yarn
yarn start
```

Open `localhost:5000` in your web browser, as hinted at in the output:

```console
   ┌──────────────────────────────────────────────────┐
   │                                                  │
   │   Serving!                                       │
   │                                                  │
   │   - Local:            http://localhost:5000      │
   │   - On Your Network:  http://192.168.1.69:5000   │
   │                                                  │
   │   Copied local address to clipboard!             │
   │                                                  │
   └──────────────────────────────────────────────────┘
```

Wait until Picovoice and the WebVoiceProcessor have initialized. Say "Picovoice", then say a command within the context "Pico Clock", e.g.:

> "Picovoice, set a timer for ten seconds"

```
Inference detected: {"isFinalized":true,"isUnderstood":true,"intent":"setTimer","slots":{"seconds":"10"}}
```
