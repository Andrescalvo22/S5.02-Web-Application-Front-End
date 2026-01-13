"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { register } from "@/api/auth";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await register({ name, email, password });
      router.push("/login");
    } catch {
      setError("Hubo un error al registrarte.");
    }
  };

  return (
    <main
      className="min-h-screen relative flex items-center justify-center px-6 py-14 text-white overflow-hidden
                 bg-[url('/fondo.login.jpg')] bg-cover bg-center bg-no-repeat"
    >
      {/* Overlay oscuro */}
      <div className="absolute inset-0 bg-black/70" />

      {/* Contenido */}
      <div className="relative z-10 w-full flex items-center justify-center">
        <div className="w-full max-w-[1700px] bg-red-600/90 text-white shadow-2xl border border-red-400 rounded-3xl p-16 backdrop-blur-sm">
          <h1 className="text-center text-6xl font-bold mb-14">
            Crear cuenta
          </h1>

          <form onSubmit={handleRegister} className="space-y-10">
            <div>
              <label className="text-3xl font-semibold">Nombre</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-6 py-5 rounded-2xl bg-black/80 border border-red-300 
                           text-white text-3xl focus:outline-none focus:ring-4 focus:ring-white"
                placeholder="Tu nombre"
                required
              />
            </div>

            <div>
              <label className="text-3xl font-semibold">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-6 py-5 rounded-2xl bg-black/80 border border-red-300 
                           text-white text-3xl focus:outline-none focus:ring-4 focus:ring-white"
                placeholder="tu@email.com"
                required
              />
            </div>

            <div>
              <label className="text-3xl font-semibold">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-6 py-5 rounded-2xl bg-black/80 border border-red-300 
                           text-white text-3xl focus:outline-none focus:ring-4 focus:ring-white"
                placeholder="********"
                required
              />
            </div>

            {error && (
              <p className="text-center text-white text-2xl font-semibold">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-black/90 hover:bg-red-800 text-white border border-white 
                         py-6 rounded-3xl text-4xl font-bold transition"
            >
              Registrarse
            </button>

            <p className="text-center text-3xl text-gray-200 mt-8">
              ¿Ya tienes cuenta?
              <Link
                href="/login"
                className="text-white font-bold underline ml-2"
              >
                Iniciar sesión
              </Link>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}



