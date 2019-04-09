## Music Instrument JS

Play any musical instrument from the browser

## Install

```sh
  yarn add music-instrument-js
```

## Usage

```typescript
import { getInstrument, startNote, stopNote, instrumentNames } from "music-instrument-js";

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

async function main() {
  await startNote('acoustic_grand_piano', 'A3', {})
  await delay(500)
  stopNote('acoustic_grand_piano', 'A3')
  
  instrumentNames // list of supported instruments

  await getInstrument('banjo') // Loads banjo instrument
  startNote('banjo', 'A3', {})
  await delay(500)
  stopNote('banjo', 'A3')
  
}

```
