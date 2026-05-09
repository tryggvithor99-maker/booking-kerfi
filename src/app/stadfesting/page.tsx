import Link from 'next/link'

export default async function ConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ name?: string; id?: string }>
}) {
  const params = await searchParams
  const name = params.name || 'vinur'

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-2xl shadow-md p-8">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Bókun móttekin!</h1>
          <p className="text-gray-600 mb-6">
            Takk, <strong>{name}</strong>! Bókun þín hefur verið skráð. Við sjáumst!
          </p>
          <div className="p-4 bg-indigo-50 rounded-xl mb-6 text-left">
            <p className="text-sm text-indigo-700">
              <strong>Athugaðu:</strong> Ef þú þarft að breyta eða afbóka, hafðu samband við okkur beint.
            </p>
          </div>
          <Link
            href="/"
            className="block w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
          >
            Til baka á forsíðu
          </Link>
        </div>
      </div>
    </div>
  )
}
