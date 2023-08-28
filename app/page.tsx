import InputForm from "@/components/InputForm";

export default function Home() {
  const image = false;
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="z-10 flex min-h-screen w-72 flex-col items-center justify-center font-mono text-sm">
        <h1 className="mb-5 text-center text-lg font-semibold">
          Folka face-recognition
        </h1>
        {image && (
          <div className="mb-5 h-80 w-96 bg-pink-300 lg:h-[400px] lg:w-[700px]">
            test
          </div>
        )}
        <InputForm />
      </div>
    </main>
  );
}
