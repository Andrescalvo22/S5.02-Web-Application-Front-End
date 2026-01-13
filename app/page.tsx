import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-6">
      
      {/* LOGO */}
      <div className="mb-10 flex justify-center">
        <div className="w-[1100px] max-w-full animate-logo-enter animate-glow-pulse">
          <Image
            src="/logo.svg"
            alt="Absolut Workshop Barcelona"
            width={2000}
            height={1000}
            priority
            className="w-full h-auto"
          />
        </div>
      </div>

      {/* BUTTONS */}
      <div className="flex flex-col gap-4 w-[350px] max-w-full">
        <Link
          href="/login"
          className="bg-red-600 hover:bg-red-700 text-white text-center py-4 rounded-lg text-xl font-bold shadow-xl transition"
        >
          Iniciar Sesión
        </Link>

        <Link
          href="/register"
          className="bg-white text-black hover:bg-gray-200 border border-red-600 text-center py-4 rounded-lg text-xl font-bold shadow-xl transition"
        >
          Registrarse
        </Link>
      </div>
    </div>
  );
}

