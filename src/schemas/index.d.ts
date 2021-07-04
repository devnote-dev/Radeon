/**
 * index.d.ts for database because TypeScript
 * *cue pain expression*
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */


import { Document, Model } from 'mongoose';

export const AR:       Model<Document>;
export const Bans:     Model<Document>;
export const Guild:    Model<Document>;
export const Muted:    Model<Document>;
export const Settings: Model<Document>;
export const Warnings: Model<Document>;
export const Presets:  object;

export class DBManager {
    constructor(connector: Model<Document>)

    get(id: string): Promise<Model<Document>>;
    getAll(): Promise<Array<Model<Document>>>;
    create(id: string, data: object, result: boolean): Promise<Model<Document>|null>;
    update(id: string, data: object, result: boolean): Promise<Model<Document>|null>;
    delete(id: string, data: object, result: boolean): Promise<Model<Document>|null>;
}
