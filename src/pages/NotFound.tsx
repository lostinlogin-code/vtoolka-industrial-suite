import { Link } from "react-router-dom";
import { Wrench, ArrowLeft } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background industrial-grid">
      <div className="text-center px-4">
        <div className="inline-flex items-center gap-2 mb-6">
          <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
            <Wrench className="w-5 h-5 text-accent-foreground" />
          </div>
          <span className="font-display font-bold text-xl">vtoolka</span>
        </div>
        <h1 className="text-7xl md:text-8xl font-display font-bold text-primary">404</h1>
        <p className="text-xl text-muted-foreground mt-4 mb-2">Страница не найдена</p>
        <p className="text-sm text-muted-foreground/60 mb-8 max-w-md mx-auto">Возможно, страница была перемещена или вы перешли по неверной ссылке</p>
        <Link to="/">
          <button className="inline-flex items-center gap-2 bg-accent text-accent-foreground hover:bg-industrial-orange-hover font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" /> Вернуться на главную
          </button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
