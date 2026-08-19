export { SLOT_PRESETS, SLOT_KEYS, type SlotKey } from "./model/slots";
// Server-only reads live in ./api/queries — import them directly from views
// to keep the postgres client out of client bundles.
