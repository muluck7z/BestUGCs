import { useEffect } from "react";

interface AccessLog {
  ip: string;
  country: string;
  countryFlag: string;
  device: string;
  timestamp: string;
}

const WEBHOOK_URL = "https://discord.com/api/webhooks/1519765059038085250/APD3n6KfCQZ0Vglej_v96xcZPGNKltSscERQb1W56QZUCiNDORkanL1YCEaE8DRyLCte";

// Função para obter informações do dispositivo
function getDeviceInfo(): string {
  const ua = navigator.userAgent;
  
  if (/mobile|android|iphone|ipad|phone/i.test(ua)) {
    if (/iphone|ipad/i.test(ua)) {
      return "iPhone/iPad";
    } else if (/android/i.test(ua)) {
      return "Android";
    }
    return "Mobile";
  } else if (/windows/i.test(ua)) {
    return "Windows";
  } else if (/macintosh|mac os x/i.test(ua)) {
    return "macOS";
  } else if (/linux/i.test(ua)) {
    return "Linux";
  }
  
  return "Unknown";
}

// Função para obter a bandeira do país baseado no código
function getCountryFlag(countryCode: string): string {
  if (!countryCode || countryCode.length !== 2) return "🌍";
  
  try {
    const codePoints = countryCode
      .toUpperCase()
      .split("")
      .map((char) => 127397 + char.charCodeAt(0));
    
    return String.fromCodePoint(...codePoints);
  } catch {
    return "🌍";
  }
}

// Função para enviar dados para o webhook com retry
async function sendToWebhook(data: AccessLog): Promise<void> {
  const embed = {
    title: "🌐 Novo Acesso ao Site",
    color: 0xff0000,
    fields: [
      {
        name: "IP",
        value: `\`${data.ip}\``,
        inline: true,
      },
      {
        name: "País",
        value: `${data.countryFlag} ${data.country}`,
        inline: true,
      },
      {
        name: "Aparelho",
        value: `\`${data.device}\``,
        inline: true,
      },
      {
        name: "Horário",
        value: `\`${data.timestamp}\``,
        inline: false,
      },
    ],
    timestamp: new Date().toISOString(),
  };

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        embeds: [embed],
      }),
    });

    if (!response.ok) {
      console.warn(`Webhook retornou status ${response.status}`);
    }
  } catch (error) {
    console.warn("Erro ao enviar log para o webhook:", error);
  }
}

// Função para obter IP e país usando múltiplas APIs
async function getGeoData(): Promise<{ ip: string; country: string; countryCode: string }> {
  // Tentar primeira API
  try {
    const response = await Promise.race([
      fetch("https://ipapi.co/json/", { signal: AbortSignal.timeout(3000) }),
      new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 3000))
    ]);
    
    if (response instanceof Response && response.ok) {
      const data = await response.json();
      return {
        ip: data.ip || "Unknown",
        country: data.country_name || "Unknown",
        countryCode: data.country_code || "",
      };
    }
  } catch (error) {
    console.warn("Erro na primeira API de geolocalização:", error);
  }

  // Fallback para segunda API
  try {
    const response = await Promise.race([
      fetch("https://ipwho.is/", { signal: AbortSignal.timeout(3000) }),
      new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 3000))
    ]);
    
    if (response instanceof Response && response.ok) {
      const data = await response.json();
      return {
        ip: data.ip || "Unknown",
        country: data.country || "Unknown",
        countryCode: data.country_code || "",
      };
    }
  } catch (error) {
    console.warn("Erro na segunda API de geolocalização:", error);
  }

  // Se ambas falharem, retornar valores padrão
  return {
    ip: "Unknown",
    country: "Unknown",
    countryCode: "",
  };
}

// Hook para usar o logger
export function useAccessLogger(): void {
  useEffect(() => {
    const logAccess = async () => {
      try {
        const geoData = await getGeoData();

        const accessLog: AccessLog = {
          ip: geoData.ip,
          country: geoData.country,
          countryFlag: getCountryFlag(geoData.countryCode),
          device: getDeviceInfo(),
          timestamp: new Date().toLocaleString("pt-BR", {
            timeZone: "America/Sao_Paulo",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
        };

        await sendToWebhook(accessLog);
      } catch (error) {
        console.warn("Erro ao registrar acesso:", error);
      }
    };

    // Executar o logger com um pequeno delay para garantir que o DOM está pronto
    const timeoutId = setTimeout(logAccess, 100);
    
    return () => clearTimeout(timeoutId);
  }, []);
}
