import Link from "next/link";

const translations = {
    en: {
        brandName: "Compessify",
        ctaButton: "Condense Now",
        ctaButtonMobile: "Condense"
    },
    id: {
        brandName: "Compessify",
        ctaButton: "Kompres Sekarang",
        ctaButtonMobile: "Kompres"
    }
};

export const Navbar = () => {
    const userLanguage = navigator.language || 'en';
    const language = userLanguage.startsWith('id') ? 'id' : 'en';
    const t = translations[language];

    return (
        <nav className="fixed top-0 left-6 lg:left-8 right-6 lg:right-8 py-6 lg:pt-8 pb-0 z-30">
            <div className="w-full border border-gray-200 p-3 lg:p-4 max-w-5xl bg-gray-50/50 backdrop-blur-lg sm:grid flex justify-between sm:grid-cols-3 items-center mx-auto rounded-2xl">
                <Link href={"/"} className="flex items-center gap-2">
                    <p className="text-transparent bg-clip-text bg-gradient-to-r from-purple-700 via-purple-950 to-purple-950 font-semibold sm:text-xl">{t.brandName}</p>
                </Link>
                <div className="sm:flex gap-4 items-center"></div>

                <div className="flex justify-end items-center">
                    <Link
                        href={"/video"}
                        className="bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-purple-700 via-purple-950 to-purple-950 rounded-lg text-white/90 relative px-3.5 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition ease-in-out duration-500 focus:ring-purple-950 flex-shrink-0"
                    >
                        <span className="hidden sm:inline">{t.ctaButton}</span>
                        <span className="sm:hidden">{t.ctaButtonMobile}</span>
                    </Link>
                </div>
            </div>
        </nav>
    );
};
