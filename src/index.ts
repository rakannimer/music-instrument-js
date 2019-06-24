import { InstrumentName, Player, instrument } from "soundfont-player";
import instrumentNames from "./constants/INSTRUMENTS";

export { InstrumentName, Player, instrumentNames };

export const getAudioContext = () => {
  const AudioContext =
    // @ts-ignore
    window.AudioContext || // Default
    // @ts-ignore
    window.webkitAudioContext || // Safari and old versions of Chrome
    false;
  if (!AudioContext) {
    console.warn(
      "Sorry but the WebAudio API is not supported on this browser. Please consider using Chrome or Safari for the best experience "
    );
    return {};
    // throw new Error('PLATFORM_NOT_SUPPORTED');
  }
  return new AudioContext();
};

export type NotePlayer = {
  play: (
    noteName: string,
    opts?: {
      duration?: number;
      gain?: number;
      attack?: number;
      decay?: number;
      sustain?: number;
      release?: number;
      adsr?: [number, number, number, number];
      loop?: boolean;
    }
  ) => void;
  stop: (noteName?: string) => void;
};
const instruments = new Map<InstrumentName, NotePlayer>();
const playingNotes = new Map<string, Player>();

export const getInstrument = async (instrumentName: InstrumentName) => {
  if (instruments.has(instrumentName)) {
    return instruments.get(instrumentName) as NotePlayer;
  }
  const ac = getAudioContext();
  const player = await instrument(ac, instrumentName);
  const play: NotePlayer["play"] = (noteName: string, options = {}) => {
    let audioNode = player.play(noteName, 0, options);
    playingNotes.set(`${instrumentName}_${noteName}`, audioNode);
    if (!!options.duration) {
      audioNode.stop(ac.currentTime + options.duration / 1000);
    }
  };
  const stop = (noteName?: string, fadeOutDuration?: number) => {
    if (!!noteName && playingNotes.has(`${instrumentName}_${noteName}`)) {
      //@ts-ignore
      playingNotes.get(`${instrumentName}_${noteName}`).stop();
      playingNotes.delete(`${instrumentName}_${noteName}`);
    } else {
      player.stop();
    }
  };
  instruments.set(instrumentName, { play, stop });
  return { play, stop } as NotePlayer;
};

export async function startNote(
  instrumentName: InstrumentName,
  noteName: string,
  noteOptions = {}
) {
  const instrument = await getInstrument(instrumentName);
  await instrument.play(noteName, noteOptions);
}

export async function stopNote(
  instrumentName: InstrumentName,
  noteName: string
) {
  const instrument = await getInstrument(instrumentName);
  instrument.stop(noteName);
}
