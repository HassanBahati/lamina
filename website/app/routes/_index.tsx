import type { MetaFunction } from "@remix-run/node";
import {
  ArrowRight,
  Code,
  Laptop,
  MessageSquare,
  Terminal,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export const meta: MetaFunction = () => {
  return [
    { title: "Lamina" },
    {
      name: "Welcome to Lamina!",
      content:
        "Lamina is a VS Code extension that provides a chat interface to interact with Ollama models, offering an easy way to query AI models like llama3.1 and get responses directly inside your code editor!",
    },
  ];
};

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <header className="container mx-auto py-8">
        <h1 className="text-4xl font-bold mb-2">Lamina</h1>
        <p className="text-xl text-gray-300">
          AI-powered chat interface for your code editor and beyond
        </p>
      </header>

      <main className="container mx-auto py-12">
        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-6">What is Lamina?</h2>
          <p className="text-lg mb-4">
            Lamina is a powerful tool that brings AI-powered chat capabilities
            to your development environment. Originally designed as a VS Code
            extension, Lamina now extends its reach to macOS, Windows, and
            Linux, offering a seamless AI interaction experience across multiple
            platforms.
          </p>
          <Button className="mt-4">
            Get Started
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-6">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FeatureCard
              icon={<MessageSquare className="h-8 w-8" />}
              title="AI-Powered Chat"
              description="Interact with Ollama models directly within your development environment."
            />
            <FeatureCard
              icon={<Code className="h-8 w-8" />}
              title="Code Integration"
              description="Get AI assistance and code suggestions without leaving your editor."
            />
            <FeatureCard
              icon={<Laptop className="h-8 w-8" />}
              title="Cross-Platform"
              description="Available as a VS Code extension, macOS app, Windows app, and Linux app."
            />
            <FeatureCard
              icon={<Terminal className="h-8 w-8" />}
              title="Customizable"
              description="Configure Lamina to work with your preferred Ollama models and settings."
            />
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-6">Available Platforms</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <PlatformCard title="VS Code Extension" icon="/vscode-icon.svg" />
            <PlatformCard title="macOS App" icon="/macos-icon.svg" />
            <PlatformCard title="Windows App" icon="/windows-icon.svg" />
            <PlatformCard title="Linux App" icon="/linux-icon.svg" />
          </div>
        </section>
      </main>

      <footer className="container mx-auto py-8 text-center text-gray-400">
        <p>&copy; 2025 Lamina. All rights reserved.</p>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center">
          {icon}
          <span className="ml-2">{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-gray-300">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
}

function PlatformCard({ title, icon }: { title: string; icon: string }) {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="flex flex-col items-center">
          <img
            src={icon || "/placeholder.svg"}
            alt={title}
            className="w-16 h-16 mb-2"
          />
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
    </Card>
  );
}
