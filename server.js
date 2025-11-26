import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Ajuda from "./models/Ajuda.js";

dotenv.config(); // ← ativa o .env

const app = express();
app.use(cors());
app.use(express.json());

// 🔗 Conexão com MongoDB usando variável do .env
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB conectado!"))
  .catch((err) => console.error("Erro ao conectar no MongoDB", err));

/*
|--------------------------------------------------------------------------
| POST /add — adicionar ajuda
|--------------------------------------------------------------------------
*/

app.post("/add", async (req, res) => {
  try {
    const { nome, link} = req.body;

    if (!nome || !link) {
      return res.status(400).json({ error: "Campos obrigatórios ausentes" });
    }

    // Impedir nome repetido
    const exists = await Ajuda.findOne({ nome: nome });
    if (exists) {
      return res.status(400).json({ error: "Este nome já existe" });
    }

    await Ajuda.create({ nome, link });

    res.json({ message: "Ajuda adicionada com sucesso" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/*
|--------------------------------------------------------------------------
| PUT /edit — editar link
|--------------------------------------------------------------------------
*/

app.put("/edit", async (req, res) => {
  try {
    const { nome, link } = req.body;

    if (!nome || !link) {
      return res.status(400).json({ error: "Nome e link são obrigatórios" });
    }

    const ajuda = await Ajuda.findOne({ nome });

    if (!ajuda) {
      return res.status(404).json({ error: "Nome não encontrado" });
    }

    ajuda.link = link;
    await ajuda.save();

    res.json({ message: "Link atualizado com sucesso" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/*
|--------------------------------------------------------------------------
| GET /get/:nome — retorna a ajuda relacionada
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| DELETE /delete — remover ajuda pelo nome
|--------------------------------------------------------------------------
*/

app.delete("/delete", async (req, res) => {
  try {
    const { nome } = req.body;

    if (!nome) {
      return res.status(400).json({ error: "Nome é obrigatório para deletar" });
    }

    const deleted = await Ajuda.findOneAndDelete({ nome });

    if (!deleted) {
      return res.status(404).json({ error: "Item não encontrado" });
    }

    res.json({ message: "Item removido com sucesso" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.get("/all", async (req, res) => {
  try {
    const itens = await Ajuda.find();

    res.json(itens);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔥 Iniciar servidor
app.listen(process.env.PORT, () => {
  console.log(`API rodando em http://localhost:${process.env.PORT}`);
});


