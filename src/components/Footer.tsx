const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 border-t border-gray-700 py-4">
      <div className="container-app">
        <p className="text-sm text-gray-400 text-center">
          DevBills PRO {currentYear} - Desenvolvido por <strong>Douglas Salazar</strong>.
          Tecnologias:
          <strong> TypeScript, React e Tailwind</strong>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
