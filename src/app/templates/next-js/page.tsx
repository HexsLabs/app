// pages/index.tsx
import { ArrowLeft, Github, Rocket } from 'lucide-react'
import Head from 'next/head'
import Link from 'next/link'

interface Backend {
  version: string
  binary: string
  directory: string
  envNamespace: string
  repository: string
  image: string
}

export default function Home() {
  const backend: Backend = {
    version: 'next-1.0',
    binary: 'next0',
    directory: '.next',
    envNamespace: 'next',
    repository: 'https://github.com/',
    image: 'paste the url here '
  }

  return (
    <div className="min-h-screen bg-[#101012] text-white">
      <Head>
        <title>NEXT</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <nav className="flex items-center justify-between mb-12">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-gray-400 hover:text-white">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-2xl font-bold flex items-center space-x-2">
              <span>Backend</span>
              <Link href="https://github.com/" target="_blank" className="text-gray-400 hover:text-white">
                <Github className="w-6 h-6" />
              </Link>
            </h1>
          </div>
          <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md flex items-center space-x-2">
            <Rocket className="w-4 h-4" />
            <span>Deploy</span>
          </button>
        </nav>

        {/* Main Content */}
        <div className="bg-zinc-900 rounded-lg overflow-hidden">
          <table className="w-full">
            <tbody>
              {Object.entries(backend).map(([key, value]) => (
                <tr key={key} className="border-b border-zinc-800 last:border-b-0">
                  <td className="py-4 px-6 text-gray-400 capitalize">
                    {key === 'envNamespace' ? 'ENV namespace' : key}
                  </td>
                  <td className="py-4 px-6">
                    {key === 'repository' ? (
                      <Link href={value} target="_blank" className="text-blue-400 hover:underline">
                        {value}
                      </Link>
                    ) : (
                      <span className={key === 'version' ? 'bg-zinc-800 px-2 py-1 rounded' : ''}>
                        {value}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}