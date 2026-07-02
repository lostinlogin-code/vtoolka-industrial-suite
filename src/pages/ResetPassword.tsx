import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { KeyRound, Wrench, Shield } from "lucide-react";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady(true);
    });
  }, []);

  const passwordValid = password.length >= 8 && /[a-zA-Zа-яА-Я]/.test(password) && /\d/.test(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordValid) { toast.error("Пароль: мин. 8 символов, буквы + цифры"); return; }
    if (password !== confirm) { toast.error("Пароли не совпадают"); return; }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) toast.error(error.message);
    else { toast.success("Пароль успешно изменён!"); navigate("/dashboard"); }
  };

  return (
    <Layout>
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-3">
              <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                <Wrench className="w-5 h-5 text-accent-foreground" />
              </div>
              <span className="font-display font-bold text-xl">vtoolka</span>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 shadow-card">
            <div className="flex flex-col items-center gap-2 mb-6">
              <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
                <KeyRound className="w-6 h-6" />
              </div>
              <h1 className="text-xl font-display font-bold">Новый пароль</h1>
            </div>

            {!ready ? (
              <div className="text-center py-4">
                <Shield className="w-8 h-8 text-muted-foreground/40 mx-auto mb-3 animate-pulse" />
                <p className="text-sm text-muted-foreground">Ожидание подтверждения ссылки из письма...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label className="text-sm">Новый пароль *</Label>
                  <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Мин. 8 символов, буквы + цифры" minLength={8} className="mt-1" />
                  {password && !passwordValid && <p className="text-xs text-destructive mt-1">Мин. 8 символов, содержит буквы и цифры</p>}
                </div>
                <div>
                  <Label className="text-sm">Подтвердите пароль *</Label>
                  <Input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Повторите пароль" className="mt-1" />
                  {confirm && password !== confirm && <p className="text-xs text-destructive mt-1">Пароли не совпадают</p>}
                </div>
                <Button type="submit" disabled={loading || !passwordValid || password !== confirm} className="w-full bg-accent text-accent-foreground hover:bg-industrial-orange-hover font-semibold h-11">
                  {loading ? "Сохранение..." : "Установить пароль"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
