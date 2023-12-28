import mongoose from "mongoose";

const usuariosEsquema=new mongoose.Schema(
    {
        nombre: String,
        apellido: String,
        email: {
            type: String, unique: true
        },
        age: Number,
        password: String,
    },
    {
        timestamps: {
            updatedAt: "FechaUltMod", createdAt: "FechaAlta"
        }
    }
)

export const userService=mongoose.model("usuarios", usuariosEsquema)