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
  
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  
  return String.fromCodePoint(...codePoints);
}

// Função para enviar dados para o webhook
async function sendToWebhook(data: AccessLog): Promise<void> {
  try {
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

    await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        embeds: [embed],
      }),
    });
  } catch (error) {
    console.error("Erro ao enviar log para o webhook:", error);
  }
}

// Hook para usar o logger
export function useAccessLogger(): void {
  useEffect(() => {
    const logAccess = async () => {
      try {
        // Obter informações de geolocalização e IP
        const geoResponse = await fetch("https://ipapi.co/json/");
        const geoData = await geoResponse.json();

        const accessLog: AccessLog = {
          ip: geoData.ip || "Unknown",
          country: geoData.country_name || "Unknown",
          countryFlag: getCountryFlag(geoData.country_code || ""),
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
        console.error("Erro ao registrar acesso:", error);
      }
    };

    logAccess();
  }, []);
}
