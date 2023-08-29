import InputForm from "@/components/InputForm";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="z-10 flex min-h-screen w-72 flex-col items-center justify-center font-mono text-sm">
        <h1 className="mb-5 text-center text-lg font-semibold">
          Folka face-recognition
        </h1>
        <InputForm />
      </div>
    </main>
  );
}
