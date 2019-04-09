import { getInstrument, startNote, stopNote } from "../src/";
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
  console.warn(startNote);
  // await getInstrument("acoustic_grand_piano");
  await startNote("acoustic_grand_piano", "A3", {});
  await delay(500);
  stopNote("acoustic_grand_piano", "A3");
}
main();
