export type SiteConfig = typeof siteConfig

export const siteConfig = {
    name: "Playlisty",
    description:
        "Playlisty.xyx is a YouTube playlist manager that helps you stay focused and distraction-free.",
    mainNav: [
        {
            title: "Donate",
            href: "/donate",
        },
    ],
    playlistNav: [
        {
            title: "Home",
            href: "/",
        },
        {
            title: "About",
            href: "/about",
        },
        {
            title: "Contact",
            href: "/contact",
        },
    ],
    links: {
        twitter: "https://twitter.com/sattwyk",
        github: "https://github.com/sattwyk/playlisty.xyz",
    },
}
