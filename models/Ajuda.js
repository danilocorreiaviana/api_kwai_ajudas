import mongoose from "mongoose";

const AjudaSchema = new mongoose.Schema({
  nome: {
    type: String,
    unique: true,
    required: true
  },
  link: {
    type: String,
    required: true
  }
});

export default mongoose.model("Ajuda", AjudaSchema);
