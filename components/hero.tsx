import Link from "next/link";

const translations = {
    en: {
        tagline: "🎉 Let's do it folks.",
        title: "Compressify Videos",
        subtitle: "Eliminate oversized files! Reduce video size by <span>90%</span> without sacrificing quality, all while working offline.",
        ctaButton: "Condense Now"
    },
    id: {
        tagline: "🎉 Ayo kita mulai!",
        title: "Compressify Video",
        subtitle: "Hilangkan file terlalu besar! Kurangi ukuran video hingga <span>90%</span> tanpa mengurangi kualitas, bisa digunakan offline.",
        ctaButton: "Kompres Sekarang"
    }
};

const Hero = () => {
    const userLanguage = navigator.language || 'en';
    const language = userLanguage.startsWith('id') ? 'id' : 'en';
    const t = translations[language];

    return (
        <div className="pt-5 md:pt-10 px-6 lg:px-0">
            <div className="text-gray-600 flex items-center gap-x-1.5 text-2xl border border-gray-200 rounded-full px-3 py-1.5 mx-auto w-fit mb-8">
                <p className="text-sm sm:text-base">{t.tagline}</p>
            </div>
            <h1 className="text-center text-4xl font-bold md:text-5xl lg:text-7xl lg:font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-700 via-purple-950 to-purple-950 text-balance pb-4">
                {t.title}
            </h1>
            <h2
                className="sm:text-lg max-w-xl mx-auto text-gray-500 text-center mt-5"
                dangerouslySetInnerHTML={{
                    __html: t.subtitle.replace(
                        '<span>',
                        '<span class="font-bold text-purple-700">'
                    )
                }}
            />
            <div className="flex gap-4 items-center justify-center mt-10 mb-10">
                <Link
                    className="bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-purple-700 via-purple-950 to-purple-950 rounded-lg text-white/90 relative px-3.5 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition ease-in-out duration-500 focus:ring-purple-950 flex-shrink-0"
                    href={"/video"}
                >
                    {t.ctaButton}
                </Link>
            </div>
        </div>
    );
};

export default Hero;