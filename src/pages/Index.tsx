import { MadeWithDyad } from "@/components/made-with-dyad";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-4">Welcome to your Dyad app!</h1>
      <p className="text-lg text-gray-700 mb-8">Start building amazing things.</p>
      <MadeWithDyad />
    </div>
  );
};

export default Index;