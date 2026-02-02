# XRP Daily Trading Bot

Backend en Node.js + Express que consulta datos históricos de Binance una vez al día y analiza las últimas 3 velas de XRP (1D) para determinar si es un buen momento de compra.

## 📌 Funcionalidad

El bot:
- Consulta a Binance las últimas 3 velas de XRP (XRPUSDT) en timeframe 1 día
- Guarda el precio de apertura y cierre
- Verifica dos condiciones:
  1. Que los rangos de precio entre velas no se superpongan
  2. Que el precio sea bajista (cada cierre menor que el anterior)
- Envía un email con el resultado:
  - ✅ Buen momento para comprar
  - ❌ No es momento de comprar

## 🧠 Estrategia aplicada

Condición bajista:
Condición de no solapamiento:
- El rango de cada vela (open-close) no debe intersectarse con los demás

Solo si se cumplen ambas condiciones se considera buen momento de compra.

## 🚀 Instalación

Clonar repositorio:

git clone https://github.com/TU_USUARIO/TU_REPO.git
cd TU_REPO

## variables de entorno
EMAIL_USER=tu_mail@gmail.com
EMAIL_PASS=app_password_gmail
EMAIL_TO=destinatario@gmail.com

## autor
Kevin Castro
