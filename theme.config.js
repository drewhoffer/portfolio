const YEAR = new Date().getFullYear();

export default {
  logo: (
    <>
      <span className="mr-2 font-extrabold hidden md:inline">Nextra</span>
      <span className="text-gray-600 font-normal hidden md:inline">
        The Next Docs Builder
      </span>
    </>
  ),
  titleSuffix: " – Drew's Zoo",
  nextLinks: true,
  prevLinks: true,
  search: true,

  footer: (
    <footer>
      <small>
        <time>{YEAR}</time> © Drew Hoffer.
        <a href="/feed.xml">RSS</a>
      </small>
      <style jsx>{`
        footer {
          margin-top: 3rem;
        }
        a {
          float: right;
        }
      `}</style>
    </footer>
  ),
  readMore: "Read More →", //Used for read more link on posts
  projectLink: "https://github.com/drewhoffer/portfolio",
};
