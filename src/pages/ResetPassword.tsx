import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { KeyRound } from "lucide-react";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Supabase sets the session from the URL hash automatically
    supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setReady(true);
      }
    });
  }, []);

  const passwordValid = password.length >= 8 && /[a-zA-Zа-яА-Я]/.test(password) && /\d/.test(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordValid) {
      toast.error("Пароль: мин. 8 символов, буквы + цифры");
      return;
    }
    if (password !== confirm) {
      toast.error("Пароли не совпадают");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Пароль успешно изменён!");
      navigate("/dashboard");
    }
  };

  return (
    <Layout>
      <div className="container max-w-md py-16">
        <div className="bg-card border rounded-lg p-6">
          <div className="flex flex-col items-center gap-2 mb-6">
            <KeyRound className="w-10 h-10 text-accent" />
            <h1 className="text-2xl font-display font-bold">Новый пароль</h1>
          </div>

          {!ready ? (
            <p className="text-center text-muted-foreground text-sm">
              Ожидание подтверждения ссылки из письма...
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label className="text-sm">Новый пароль *</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Мин. 8 символов, буквы + цифры"
                  minLength={8}
                />
                {password && !passwordValid && (
                  <p className="text-xs text-destructive mt-1">Мин. 8 символов, содержит буквы и цифры</p>
                )}
              </div>
              <div>
                <Label className="text-sm">Подтвердите пароль *</Label>
                <Input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Повторите пароль"
                />
                {confirm && password !== confirm && (
                  <p className="text-xs text-destructive mt-1">Пароли не совпадают</p>
                )}
              </div>
              <Button
                type="submit"
                disabled={loading || !passwordValid || password !== confirm}
                className="w-full bg-accent text-accent-foreground hover:bg-industrial-orange-hover"
              >
                {loading ? "Сохранение..." : "Установить пароль"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
}
