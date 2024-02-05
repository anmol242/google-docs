import { Schema, model, Document } from "mongoose";

export interface Doc extends Document {
  _id: String;
  data: Object;
}

export const DocSchema = new Schema({
  _id: String,
  data: Object,
});

const Doc = model<Doc>("Doc", DocSchema);
export default Doc;
