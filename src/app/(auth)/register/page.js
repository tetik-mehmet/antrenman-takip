import Image from "next/image";
import RegisterForm from "@/components/forms/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="grid min-h-screen w-full grid-cols-1 lg:grid-cols-2">
      {/* Sol panel / Mobilde üst: Form */}
      <div className="flex flex-col justify-center bg-zinc-900 px-4 py-8 sm:px-10 sm:py-12 md:px-14 md:py-12 lg:px-20">
        <div className="mx-auto w-full max-w-sm">
          <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Kayıt ol
          </h1>
          <p className="mt-2 text-sm text-zinc-400">Yeni hesap oluşturun</p>
          <div className="mt-8">
            <RegisterForm />
          </div>
        </div>
      </div>

      {/* Sağ panel / Mobilde alt: Logo */}
      <div
        className="flex flex-shrink-0 flex-col items-center justify-center px-4 py-6 sm:py-8 md:px-12 md:py-12 lg:min-h-0 lg:px-16"
        style={{
          background:
            "linear-gradient(165deg, #0c0c0c 0%, #141414 35%, #0f0f0f 70%, rgba(255,162,64,0.04) 100%)",
        }}
      >
        <div className="flex w-full max-w-sm flex-col items-center text-center lg:max-w-md">
          <Image
            src="/logo_montana.png"
            alt="Montana Gym"
            width={280}
            height={280}
            className="h-28 w-auto object-contain sm:h-36 md:h-44 lg:h-56"
            priority
          />
          <p className="mt-3 text-xs font-medium tracking-wide text-zinc-300 sm:mt-4 sm:text-sm md:mt-6 md:text-base [text-shadow:0_1px_2px_rgba(0,0,0,0.5)]">
            Antrenman programlarınıza tek yerden erişin
          </p>
        </div>
      </div>
    </div>
  );
}
