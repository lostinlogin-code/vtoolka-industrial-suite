import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Building2, UserRound } from "lucide-react";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\+7\s?\(?\d{3}\)?\s?\d{3}[-\s]?\d{2}[-\s]?\d{2}$/;
const innRegex = /^(\d{10}|\d{12})$/;

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length === 0) return "+7 ";
  let f = "+7";
  if (digits.length > 1) f += ` (${digits.slice(1, 4)}`;
  if (digits.length > 4) f += `) ${digits.slice(4, 7)}`;
  if (digits.length > 7) f += `-${digits.slice(7, 9)}`;
  if (digits.length > 9) f += `-${digits.slice(9, 11)}`;
  return f;
}

interface FieldError {
  [key: string]: string;
}

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [clientType, setClientType] = useState<"b2c" | "b2b">("b2c");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FieldError>({});

  // B2C fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("+7 ");

  // B2B fields
  const [companyName, setCompanyName] = useState("");
  const [inn, setInn] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [workPhone, setWorkPhone] = useState("+7 ");
  const [legalAddress, setLegalAddress] = useState("");

  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const validate = (): boolean => {
    const e: FieldError = {};

    if (!emailRegex.test(email)) e.email = "Некорректный email";
    if (password.length < 6) e.password = "Минимум 6 символов";

    if (!isLogin) {
      if (clientType === "b2c") {
        if (!firstName.trim()) e.firstName = "Обязательное поле";
        if (!lastName.trim()) e.lastName = "Обязательное поле";
        if (phone.length > 3 && !phoneRegex.test(phone)) e.phone = "Формат: +7 (XXX) XXX-XX-XX";
      } else {
        if (!companyName.trim()) e.companyName = "Обязательное поле";
        if (!innRegex.test(inn)) e.inn = "ИНН должен содержать 10 или 12 цифр";
        if (!contactPerson.trim()) e.contactPerson = "Обязательное поле";
        if (!phoneRegex.test(workPhone)) e.workPhone = "Формат: +7 (XXX) XXX-XX-XX";
        if (!legalAddress.trim()) e.legalAddress = "Обязательное поле";
      }
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) throw error;
        toast.success("Вы вошли в систему");
        navigate("/");
      } else {
        const fullName = clientType === "b2c"
          ? `${firstName} ${lastName}`.trim()
          : contactPerson;

        const metadata: Record<string, string | boolean> = {};
        if (clientType === "b2b") {
          metadata.is_b2b = true;
          metadata.company_name = companyName;
          metadata.inn = inn;
          metadata.phone = workPhone;
          metadata.legal_address = legalAddress;
        } else {
          if (phone.length > 3) metadata.phone = phone;
        }

        const { error } = await signUp(email, password, fullName, metadata);
        if (error) throw error;

        toast.success("Регистрация успешна! Проверьте email для подтверждения.");
      }
    } catch (err: any) {
      toast.error(err.message || "Ошибка");
    } finally {
      setLoading(false);
    }
  };

  const FieldError = ({ field }: { field: string }) =>
    errors[field] ? <p className="text-xs text-destructive mt-1">{errors[field]}</p> : null;

  return (
    <Layout>
      <div className="container max-w-md py-16">
        <div className="bg-card border rounded-lg p-6">
          <h1 className="text-2xl font-display font-bold text-center mb-6">
            {isLogin ? "Вход в аккаунт" : "Регистрация"}
          </h1>

          {/* Client type selector - only for registration */}
          {!isLogin && (
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                type="button"
                onClick={() => setClientType("b2c")}
                className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                  clientType === "b2c"
                    ? "border-accent bg-accent/5"
                    : "border-border hover:border-muted-foreground/30"
                }`}
              >
                <UserRound className={`w-6 h-6 ${clientType === "b2c" ? "text-accent" : "text-muted-foreground"}`} />
                <span className={`text-sm font-medium ${clientType === "b2c" ? "text-foreground" : "text-muted-foreground"}`}>
                  Частное лицо
                </span>
              </button>
              <button
                type="button"
                onClick={() => setClientType("b2b")}
                className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                  clientType === "b2b"
                    ? "border-accent bg-accent/5"
                    : "border-border hover:border-muted-foreground/30"
                }`}
              >
                <Building2 className={`w-6 h-6 ${clientType === "b2b" ? "text-accent" : "text-muted-foreground"}`} />
                <span className={`text-sm font-medium ${clientType === "b2b" ? "text-foreground" : "text-muted-foreground"}`}>
                  B2B клиент
                </span>
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* B2C Registration Fields */}
            {!isLogin && clientType === "b2c" && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="firstName" className="text-sm">Имя *</Label>
                    <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Иван" />
                    <FieldError field="firstName" />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-sm">Фамилия *</Label>
                    <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Иванов" />
                    <FieldError field="lastName" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="phone" className="text-sm">Телефон</Label>
                  <Input id="phone" value={phone} onChange={(e) => setPhone(formatPhone(e.target.value))} placeholder="+7 (XXX) XXX-XX-XX" />
                  <FieldError field="phone" />
                </div>
              </>
            )}

            {/* B2B Registration Fields */}
            {!isLogin && clientType === "b2b" && (
              <>
                <div>
                  <Label htmlFor="companyName" className="text-sm">Название компании *</Label>
                  <Input id="companyName" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="ООО «Компания»" />
                  <FieldError field="companyName" />
                </div>
                <div>
                  <Label htmlFor="inn" className="text-sm">ИНН *</Label>
                  <Input id="inn" value={inn} onChange={(e) => setInn(e.target.value.replace(/\D/g, "").slice(0, 12))} placeholder="10 или 12 цифр" maxLength={12} />
                  <FieldError field="inn" />
                </div>
                <div>
                  <Label htmlFor="contactPerson" className="text-sm">Контактное лицо (ФИО) *</Label>
                  <Input id="contactPerson" value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} placeholder="Иванов Иван Иванович" />
                  <FieldError field="contactPerson" />
                </div>
                <div>
                  <Label htmlFor="workPhone" className="text-sm">Рабочий телефон *</Label>
                  <Input id="workPhone" value={workPhone} onChange={(e) => setWorkPhone(formatPhone(e.target.value))} placeholder="+7 (XXX) XXX-XX-XX" />
                  <FieldError field="workPhone" />
                </div>
                <div>
                  <Label htmlFor="legalAddress" className="text-sm">Юридический адрес *</Label>
                  <Input id="legalAddress" value={legalAddress} onChange={(e) => setLegalAddress(e.target.value)} placeholder="г. Москва, ул. Примерная, д. 1" />
                  <FieldError field="legalAddress" />
                </div>
              </>
            )}

            <div>
              <Label htmlFor="email" className="text-sm">{!isLogin && clientType === "b2b" ? "Рабочий email *" : "Email *"}</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@company.ru" />
              <FieldError field="email" />
            </div>
            <div>
              <Label htmlFor="password" className="text-sm">Пароль *</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Минимум 6 символов" minLength={6} />
              <FieldError field="password" />
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-accent text-accent-foreground hover:bg-industrial-orange-hover font-semibold">
              {loading ? "Загрузка..." : isLogin ? "Войти" : "Зарегистрироваться"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-4">
            {isLogin ? "Нет аккаунта?" : "Уже есть аккаунт?"}{" "}
            <button onClick={() => { setIsLogin(!isLogin); setErrors({}); }} className="text-accent hover:underline font-medium">
              {isLogin ? "Зарегистрироваться" : "Войти"}
            </button>
          </p>
        </div>
      </div>
    </Layout>
  );
}
