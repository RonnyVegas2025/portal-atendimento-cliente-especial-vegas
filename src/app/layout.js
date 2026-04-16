import "./globals.css";

export const metadata = {
  title: "Portal Parceiros Vegas",
  description: "Demo navegável do sistema de atendimento Vegas Card"
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}

