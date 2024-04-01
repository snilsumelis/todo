# Resmi Node.js imajını kullan
FROM node:14

# Docker içinde çalıştırılacak dizini belirt
WORKDIR /home

# Gerekli dosyaları kopyala
COPY package*.json ./

# Bağımlılıkları yükle
RUN npm install

# Tüm dosyaları kopyala
COPY . .

# Uygulamayı çalıştır
CMD ["node", "index.js"]

EXPOSE 3000
