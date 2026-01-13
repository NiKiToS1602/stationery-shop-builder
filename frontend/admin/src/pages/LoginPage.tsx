import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Store, Mail, ArrowRight, RefreshCw, HelpCircle } from "lucide-react";

import { setAccessToken } from "../features/auth/authSlice";
import { apiFetch } from "../shared/api/client";

// Если ты уже сделал сохранение токена на 30 минут:
import { saveToken } from "../shared/auth/tokenStorage";

const COOLDOWN_SECONDS = 30;

export function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("test@example.com");
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<string>("");

  // UI шаги: сначала отправка кода, затем ввод кода
  const [isCodeSent, setIsCodeSent] = useState(false);

  const [cooldownLeft, setCooldownLeft] = useState(0);
  const timerRef = useRef<number | null>(null);

  function startCooldown(seconds: number) {
    setCooldownLeft(seconds);

    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }

    timerRef.current = window.setInterval(() => {
      setCooldownLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) window.clearInterval(timerRef.current);
          timerRef.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, []);

  async function handleSendCode() {
    if (cooldownLeft > 0) return;

    setStatus("Отправляем код...");

    try {
      const res = await apiFetch("/api/v1/auth/login/", {
        method: "POST",
        body: JSON.stringify({ email }),
      });

      if (res.status === 429) {
        setStatus("Слишком часто. Попробуйте через 30 секунд.");
        startCooldown(COOLDOWN_SECONDS);
        return;
      }

      if (!res.ok) {
        setStatus("Ошибка отправки кода");
        return;
      }

      setStatus("Код отправлен. Проверь почту.");
      setIsCodeSent(true);
      startCooldown(COOLDOWN_SECONDS);
    } catch {
      setStatus("Ошибка сети или API");
    }
  }

  async function handleConfirm() {
    setStatus("Подтверждаем код...");

    try {
      const res = await apiFetch("/api/v1/auth/confirm/", {
        method: "POST",
        body: JSON.stringify({ email, code }),
      });

      if (res.status === 429) {
        setStatus("Слишком много попыток. Попробуйте позже.");
        return;
      }

      if (!res.ok) {
        setStatus("Неверный или просроченный код");
        return;
      }

      const data = await res.json();

      // ✅ Сохраняем на 30 минут (если ты сделал tokenStorage.ts)
      saveToken(data.access_token);

      dispatch(setAccessToken(data.access_token));
      navigate("/");
    } catch {
      setStatus("Ошибка сети или API");
    }
  }

  const sendBtnText =
    cooldownLeft > 0 ? `Отправить код (${cooldownLeft}s)` : "Отправить код";

  const resendText =
    cooldownLeft > 0
      ? `Отправить повторно через ${cooldownLeft}s`
      : "Отправить код повторно";

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-0 bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Left Side - Branding */}
        <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-12 text-white flex flex-col justify-center relative">
          <button
            type="button"
            onClick={() => alert("Добавь сюда ссылку на помощь/инструкцию")}
            className="absolute top-6 right-6 flex items-center gap-2 bg-white/15 hover:bg-white/20 transition px-3 py-2 rounded-lg text-sm"
            title="Помощь"
          >
            <HelpCircle className="w-4 h-4" />
            Помощь
          </button>

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Store className="w-12 h-12" />
              <h1 className="text-2xl font-bold text-white">ShopBuilder</h1>
            </div>
            <p className="text-lg opacity-90 mb-8">
              Создавайте профессиональные интернет-магазины одежды за минуты
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-white/20 p-3 rounded-lg">
                <Store className="w-6 h-6" />
              </div>
              <div>
                <h3 className="mb-1 text-white font-semibold">Готовые шаблоны</h3>
                <p className="text-sm opacity-80">
                  Выбирайте из профессионально разработанных дизайнов
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-white/20 p-3 rounded-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                  />
                </svg>
              </div>
              <div>
                <h3 className="mb-1 text-white font-semibold">Настройка дизайна</h3>
                <p className="text-sm opacity-80">
                  Полный контроль над цветами, шрифтами и контентом
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-white/20 p-3 rounded-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="mb-1 text-white font-semibold">Мгновенная публикация</h3>
                <p className="text-sm opacity-80">
                  Запустите свой магазин одним нажатием кнопки
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="p-12 flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">
              {!isCodeSent ? "Добро пожаловать!" : "Введите код"}
            </h2>
            <p className="text-gray-600">
              {!isCodeSent
                ? "Введите ваш email для получения кода доступа"
                : `Мы отправили код на ${email}`}
            </p>
          </div>

          {!isCodeSent ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendCode();
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={cooldownLeft > 0}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2 group disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {sendBtnText}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              {status && <p className="text-sm text-gray-600">{status}</p>}
            </form>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleConfirm();
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium mb-2">Код подтверждения</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-center text-2xl tracking-widest"
                  placeholder="••••••"
                  maxLength={6}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2 group"
              >
                Войти
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    if (cooldownLeft > 0) return;
                    handleSendCode();
                  }}
                  disabled={cooldownLeft > 0}
                  className={`flex items-center justify-center gap-2 mx-auto text-sm ${
                    cooldownLeft > 0
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-indigo-600 hover:text-indigo-700"
                  }`}
                >
                  <RefreshCw className="w-4 h-4" />
                  {resendText}
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsCodeSent(false);
                  setCode("");
                  setStatus("");
                }}
                className="w-full border border-gray-300 py-3 px-4 rounded-lg hover:bg-gray-50 transition text-sm"
              >
                Назад
              </button>

              {status && <p className="text-sm text-gray-600">{status}</p>}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
