import Image from "next/image";
import RegisterForm from "@/components/forms/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="grid min-h-screen w-full grid-cols-1 lg:grid-cols-2">
      {/* Sol panel / Mobilde üst: Form */}
      <div className="relative flex flex-col justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-8 sm:px-10 sm:py-12 md:px-14 md:py-12 lg:px-20">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-transparent to-blue-900/10" />
        
        <div className="relative z-10 mx-auto w-full max-w-sm">
          <div className="animate-slide-in-left">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent sm:text-3xl">
              Kayıt ol
            </h1>
            <p className="mt-2 text-sm text-slate-400">Yeni hesap oluşturun</p>
          </div>
          <div className="mt-8 animate-slide-in-left" style={{ animationDelay: "100ms" }}>
            <RegisterForm />
          </div>
        </div>
      </div>

      {/* Sağ panel / Mobilde alt: Logo */}
      <div className="relative flex flex-shrink-0 flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-cyan-600 via-blue-600 to-cyan-700 px-4 py-6 sm:py-8 md:px-12 md:py-12 lg:min-h-0 lg:px-16">
        {/* Animated background shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-white/10 blur-3xl animate-float" style={{ animationDelay: "1s" }} />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-blue-300/20 blur-3xl animate-float" style={{ animationDelay: "3s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl animate-pulse" />
        </div>

        <div className="relative z-10 flex w-full max-w-sm flex-col items-center text-center lg:max-w-md">
          <div className="rounded-3xl bg-white/10 backdrop-blur-md p-4 shadow-2xl animate-pulse-cyan-glow">
            <Image
              src="/logo_montana.png"
              alt="Montana Gym"
              width={280}
              height={280}
              className="h-28 w-auto object-contain sm:h-36 md:h-44 lg:h-56 animate-float"
              priority
            />
          </div>
          <p className="mt-6 text-sm font-medium tracking-wide text-white/90 sm:mt-6 sm:text-base md:mt-8 md:text-lg drop-shadow-lg animate-slide-in-up">
            Antrenman programlarınıza tek yerden erişin
          </p>
        </div>
      </div>
    </div>
  );
}
