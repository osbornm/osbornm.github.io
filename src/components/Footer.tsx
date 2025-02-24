import SocialIcons from "./SocialIcons";

const Footer = () => {
  return (
    <footer className="max-w-screen-xl px-4 py-6 mx-auto space-y-8 md:space-y-0 overflow-hidden sm:px-6 lg:px-8">
      <div className="flex justify-center mt-4 space-x-6 md:hidden">
        <SocialIcons />
      </div>
      <p className="text-base leading-6 text-center">
        Made with ❤️ by Matthew Osborn &copy; {new Date().getFullYear()}
      </p>


    </footer>
  )
}

export default Footer;