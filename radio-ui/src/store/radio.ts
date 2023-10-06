import { writable } from "svelte/store";

export const visible = writable(false);

export const radioVolume = writable(60);
export const radioEnabled = writable(true);

/** the initial radio that gets sent by the client */
export const clientRadioChannel = writable(0);

/** the radio channel set by the ui (that will be sent to the client on change) */
export const uiRadioChannel = writable(0);

// Config
export const radioChannelOffset = writable(0);
export const maxDecimalPlaces = writable(2);
export const maxChannels = writable(1000);
