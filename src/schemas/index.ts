// index.ts for database schemas because TypeScript
// *cue pain expression*

import { Document, Model } from "mongoose";

export const AR:       Model<Document> = require('./antiraid-schema');
export const Bans:     Model<Document> = require('./ban-schema');
export const Guild:    Model<Document> = require('./guild-schema');
export const Muted:    Model<Document> = require('./muted-schema');
export const Settings: Model<Document> = require('./settings-schema');
export const Warns:    Model<Document> = require('./warn-schema');